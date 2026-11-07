// First import: loads server/.env before any other module reads the environment
import { env } from './env.ts';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { migrate } from './db.ts';
import { authRouter } from './auth.ts';
import { spendingRouter } from './spending.ts';
import { fail } from './http.ts';

const app = express();

// Render/Railway put one proxy in front of the app. Without this req.ip is the proxy's address and
// the rate limiter would count every user as the same client
app.set('trust proxy', 1);
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Сервер работает!');
});

// TEMPORARY, remove once 'trust proxy' is fixed: shows how the host's proxy forwards the client address.
// A forged X-Forwarded-For gave the rate limiter a fresh counter on Render, so req.ip is not the real client.
// It only echoes the caller's own request
app.get('/ip', (req, res) => {
  res.json({
    ip: req.ip,
    ips: req.ips,
    remoteAddress: req.socket.remoteAddress,
    xForwardedFor: req.headers['x-forwarded-for'] ?? null,
    cfConnectingIp: req.headers['cf-connecting-ip'] ?? null,
    trueClientIp: req.headers['true-client-ip'] ?? null,
    xRealIp: req.headers['x-real-ip'] ?? null,
  });
});

app.use(authRouter);
app.use(spendingRouter);

// Express 5 forwards errors thrown in async handlers here
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // express.json() rejects a malformed or oversized body with its own 4xx status
  const status =
    typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number' ? err.status : 500;
  if (status >= 500) console.error(err);
  fail(res, status, status >= 500 ? 'Internal server error' : 'Invalid request');
});

await migrate();

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
