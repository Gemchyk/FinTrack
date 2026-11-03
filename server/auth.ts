import { createHash, randomBytes } from 'node:crypto';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import type { Pool, PoolClient } from 'pg';
import type { Lang, Me } from '../shared/api-types.ts';
import { env } from './env.ts';
import { pool, withTransaction, isPgError, UNIQUE_VIOLATION } from './db.ts';
import { asRecord, currentUser, fail } from './http.ts';
import type { AuthUser } from './http.ts';
import { linkMail, sendMail } from './mail.ts';
import type { LinkPurpose } from './mail.ts';
import { isCurrency, isEmail, isLang, isPassword } from './validate.ts';

const BCRYPT_ROUNDS = 10;
const INVALID_PASSWORD = 'Password must be 8 to 72 bytes long';
const INVALID_LINK = 'The link is invalid or expired';

// Created for every new user. No goals: an amount like 300 means nothing without knowing the currency
const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: 'Food' },
  { name: 'Fun', icon: 'Entertainment' },
  { name: 'Transport', icon: 'Transport' },
  { name: 'Shopping', icon: 'Shopping' },
  { name: 'Health', icon: 'Health' },
  { name: 'Other', icon: 'Other' },
];

// Compared against when the email is unknown, so a missing account answers as slowly as a wrong password
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString('hex'), BCRYPT_ROUNDS);

const limiterOptions = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts, try again later' },
} as const;
const authLimiter = rateLimit({ ...limiterOptions, windowMs: 15 * 60 * 1000, limit: 20 });
// Every accepted request here sends an email. A separate, lower limit keeps one client from flooding inboxes
// or using up the Resend daily quota, and failed sign-ins do not use up the budget for a password reset.
// Rejected requests (a typo, a taken email) send nothing and do not count; authLimiter still counts them
const mailLimiter = rateLimit({ ...limiterOptions, windowMs: 60 * 60 * 1000, limit: 10, skipFailedRequests: true });

// Uses the token_hash primary key, marks the link used and yields its user: the same link a second time,
// or after an hour, finds nothing
const USE_TOKEN = `WITH t AS (
  UPDATE email_tokens SET used_at = now()
   WHERE token_hash = $1 AND purpose = $2 AND used_at IS NULL AND expires_at > now()
  RETURNING user_id)`;

export const authRouter = express.Router();

function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Only the hash is stored, so a copy of the database cannot open the links
async function sendLink(
  db: Pool | PoolClient,
  user: { id: string; email: string; lang: Lang },
  purpose: LinkPurpose,
): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  // One hour, as the email texts promise
  await db.query(
    `INSERT INTO email_tokens (token_hash, user_id, purpose, expires_at) VALUES ($1, $2, $3, now() + interval '1 hour')`,
    [hashToken(token), user.id, purpose],
  );
  await sendMail(linkMail(purpose, user.lang, user.email, token));
}

// Called after the response is sent: forgot-password and resend-verification answer the same, and as fast,
// whether or not the address has an account
async function sendLinkIfRegistered(email: string, purpose: LinkPurpose): Promise<void> {
  const { rows } = await pool.query<{ id: string; email: string; lang: Lang; email_verified_at: Date | null }>(
    'SELECT id, email, lang, email_verified_at FROM users WHERE email = $1',
    [email],
  );
  const user = rows[0];
  if (!user || (purpose === 'verify' && user.email_verified_at)) return;
  await sendLink(pool, user, purpose);
}

function logMailError(err: unknown): void {
  console.error('Email not sent:', err);
}

authRouter.post('/signup', authLimiter, mailLimiter, async (req, res) => {
  const { email, password, currency, lang } = asRecord(req.body);
  const normalizedEmail = normalizeEmail(email);

  if (!isEmail(normalizedEmail)) return fail(res, 400, 'Invalid email');
  if (!isPassword(password)) return fail(res, 400, INVALID_PASSWORD);
  if (!isCurrency(currency)) return fail(res, 400, 'Invalid currency');
  if (!isLang(lang)) return fail(res, 400, 'Invalid language');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  try {
    await withTransaction(async (client) => {
      const { rows } = await client.query<{ id: string }>(
        'INSERT INTO users (email, password_hash, currency, lang) VALUES ($1, $2, $3, $4) RETURNING id',
        [normalizedEmail, passwordHash, currency, lang],
      );
      await client.query(
        `INSERT INTO categories (user_id, name, icon_name)
         SELECT $1, d.name, d.icon FROM unnest($2::text[], $3::text[]) AS d(name, icon)`,
        [rows[0].id, DEFAULT_CATEGORIES.map((c) => c.name), DEFAULT_CATEGORIES.map((c) => c.icon)],
      );
      // Sent before the commit: if the email cannot go out, no account is left behind to block signing up again
      await sendLink(client, { id: rows[0].id, email: normalizedEmail, lang }, 'verify');
    });
  } catch (err) {
    // Reveals that the address is registered; accepted trade-off, the endpoint is rate limited
    if (isPgError(err, UNIQUE_VIOLATION)) return fail(res, 409, 'Email already registered');
    throw err;
  }
  res.status(201).json({ success: true });
});

authRouter.post('/signin', authLimiter, async (req, res) => {
  const { email, password } = asRecord(req.body);
  const normalizedEmail = normalizeEmail(email);
  if (!isEmail(normalizedEmail) || typeof password !== 'string') {
    return fail(res, 401, 'Invalid email or password');
  }

  const { rows } = await pool.query<{
    id: string;
    password_hash: string;
    token_version: number;
    email_verified_at: Date | null;
  }>('SELECT id, password_hash, token_version, email_verified_at FROM users WHERE email = $1', [normalizedEmail]);
  const user = rows[0];
  const passwordMatches = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  // One message for both cases, so the answer does not tell whether the email is registered
  if (!user || !passwordMatches) return fail(res, 401, 'Invalid email or password');
  // Only after the right password, so it reveals nothing about other people's addresses
  if (!user.email_verified_at) return fail(res, 403, 'Email not verified');

  const token = jwt.sign({ tv: user.token_version }, env.SECRET_KEY, { subject: user.id, expiresIn: '2h' });
  res.json({ token });
});

// Answers without a session: on iPhone the link opens in Safari, not in the installed app, so the user
// signs in there
authRouter.post('/verify-email', async (req, res) => {
  const { token } = asRecord(req.body);
  if (typeof token !== 'string') return fail(res, 400, INVALID_LINK);

  const { rowCount } = await pool.query(
    `${USE_TOKEN}
     UPDATE users SET email_verified_at = COALESCE(email_verified_at, now()) WHERE id = (SELECT user_id FROM t)`,
    [hashToken(token), 'verify'],
  );
  if (!rowCount) return fail(res, 400, INVALID_LINK);
  res.json({ success: true });
});

authRouter.post('/resend-verification', mailLimiter, (req, res) => {
  const email = normalizeEmail(asRecord(req.body).email);
  if (!isEmail(email)) return fail(res, 400, 'Invalid email');
  res.json({ success: true });
  sendLinkIfRegistered(email, 'verify').catch(logMailError);
});

authRouter.post('/forgot-password', mailLimiter, (req, res) => {
  const email = normalizeEmail(asRecord(req.body).email);
  if (!isEmail(email)) return fail(res, 400, 'Invalid email');
  res.json({ success: true });
  sendLinkIfRegistered(email, 'reset').catch(logMailError);
});

// Rate limited because it hashes the password before the token is checked
authRouter.post('/reset-password', authLimiter, async (req, res) => {
  const { token, password } = asRecord(req.body);
  if (typeof token !== 'string') return fail(res, 400, INVALID_LINK);
  if (!isPassword(password)) return fail(res, 400, INVALID_PASSWORD);

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  // token_version + 1 signs out every session. The link came by email, so it proves the address as well
  const { rowCount } = await pool.query(
    `${USE_TOKEN}
     UPDATE users
        SET password_hash = $3, token_version = token_version + 1, email_verified_at = COALESCE(email_verified_at, now())
      WHERE id = (SELECT user_id FROM t)`,
    [hashToken(token), 'reset', passwordHash],
  );
  if (!rowCount) return fail(res, 400, INVALID_LINK);
  res.json({ success: true });
});

function verifyToken(token: string): { userId: string; tokenVersion: number } | null {
  try {
    const payload = jwt.verify(token, env.SECRET_KEY, { algorithms: ['HS256'] });
    if (typeof payload === 'object' && typeof payload.sub === 'string' && typeof payload.tv === 'number') {
      return { userId: payload.sub, tokenVersion: payload.tv };
    }
  } catch {
    // Expired, forged or malformed: all mean "not signed in"
  }
  return null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1];
  const claims = token ? verifyToken(token) : null;
  if (!claims) return fail(res, 401, 'Unauthorized');

  // The version check makes tokens issued before a password reset stop working right away
  const { rows } = await pool.query<AuthUser>(
    'SELECT id, email, currency, lang FROM users WHERE id = $1 AND token_version = $2',
    [claims.userId, claims.tokenVersion],
  );
  if (!rows[0]) return fail(res, 401, 'Unauthorized');

  res.locals.user = rows[0];
  next();
}

// Currency and language come from here, not from the JWT: a token would keep the old values for two hours
authRouter.get('/me', requireAuth, (_req, res) => {
  const { email, currency, lang } = currentUser(res);
  const body: Me = { email, currency, lang };
  res.json(body);
});

// Amounts are not converted when the currency changes; the client asks for confirmation first
authRouter.patch('/me', requireAuth, async (req, res) => {
  const { currency, lang } = asRecord(req.body);
  if (currency !== undefined && !isCurrency(currency)) return fail(res, 400, 'Invalid currency');
  if (lang !== undefined && !isLang(lang)) return fail(res, 400, 'Invalid language');

  const { rows } = await pool.query<Me>(
    `UPDATE users SET currency = COALESCE($2, currency), lang = COALESCE($3, lang)
      WHERE id = $1
     RETURNING email, currency, lang`,
    [currentUser(res).id, currency ?? null, lang ?? null],
  );
  res.json(rows[0]);
});
