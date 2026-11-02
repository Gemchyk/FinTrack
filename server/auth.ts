import { randomBytes } from 'node:crypto';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { env } from './env.ts';
import { pool, withTransaction, isPgError, UNIQUE_VIOLATION } from './db.ts';
import { asRecord, fail } from './http.ts';
import type { AuthUser } from './http.ts';
import { isCurrency, isEmail, isPassword } from './validate.ts';

const BCRYPT_ROUNDS = 10;
const LANGS = ['en', 'uk'];

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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts, try again later' },
});

export const authRouter = express.Router();

authRouter.post('/signup', authLimiter, async (req, res) => {
  const { email, password, currency, lang } = asRecord(req.body);
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!isEmail(normalizedEmail)) return fail(res, 400, 'Invalid email');
  if (!isPassword(password)) return fail(res, 400, 'Password must be 8 to 72 bytes long');
  if (!isCurrency(currency)) return fail(res, 400, 'Invalid currency');
  if (typeof lang !== 'string' || !LANGS.includes(lang)) return fail(res, 400, 'Invalid language');

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
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!isEmail(normalizedEmail) || typeof password !== 'string') {
    return fail(res, 401, 'Invalid email or password');
  }

  const { rows } = await pool.query<{ id: string; password_hash: string; token_version: number }>(
    'SELECT id, password_hash, token_version FROM users WHERE email = $1',
    [normalizedEmail],
  );
  const user = rows[0];
  const passwordMatches = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  // One message for both cases, so the answer does not tell whether the email is registered
  if (!user || !passwordMatches) return fail(res, 401, 'Invalid email or password');

  const token = jwt.sign({ tv: user.token_version }, env.SECRET_KEY, { subject: user.id, expiresIn: '2h' });
  res.json({ token });
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
    'SELECT id, currency FROM users WHERE id = $1 AND token_version = $2',
    [claims.userId, claims.tokenVersion],
  );
  if (!rows[0]) return fail(res, 401, 'Unauthorized');

  res.locals.user = rows[0];
  next();
}
