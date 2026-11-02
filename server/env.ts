// Imported first by index.ts: ES modules run their imports before their own body, so loading .env
// anywhere later would leave the modules that read the environment at import time without it.

// Locally the secrets live in server/.env; in production the host injects them and the file is absent
try {
  process.loadEnvFile(new URL('.env', import.meta.url));
} catch (err) {
  if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
}

// No fallbacks: a secret known from the source would let anyone forge a token
const REQUIRED = ['SECRET_KEY', 'DATABASE_URL'] as const;
const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);

export const env = {
  SECRET_KEY: process.env.SECRET_KEY as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: Number(process.env.PORT ?? 5050),
  CLIENT_URL: process.env.CLIENT_URL ?? '*',
};
