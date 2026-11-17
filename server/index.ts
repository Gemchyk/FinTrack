// First import: loads server/.env before any other module reads the environment
import { env } from './env.ts';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { migrate } from './db.ts';
import { authRouter } from './auth.ts';
import { jobsRouter } from './jobs.ts';
import { spendingRouter } from './spending.ts';
import { fail } from './http.ts';

const app = express();

// Express takes req.ip from X-Forwarded-For past this many proxies, and the rate limiter counts attempts per
// req.ip. How to count them for a host: TRUST_PROXY_HOPS in .env.example
app.set('trust proxy', env.TRUST_PROXY_HOPS);
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Сервер работает!');
});

app.use(authRouter);
// Before spendingRouter: its requireAuth answers 401 to every request that reaches it
app.use(jobsRouter);
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
