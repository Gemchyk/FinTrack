// Imported first by index.ts: ES modules run their imports before their own body, so loading .env
// anywhere later would leave the modules that read the environment at import time without it.

// Locally the secrets live in server/.env; in production the host injects them and the file is absent
try {
  process.loadEnvFile(new URL('.env', import.meta.url));
} catch (err) {
  if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
}

// Local development only: emails are printed to the console, so no mail account or domain is needed
const MAIL_TO_CONSOLE = process.env.MAIL_TO_CONSOLE === '1';

// No fallbacks: a secret known from the source would let anyone forge a token
const REQUIRED = ['SECRET_KEY', 'DATABASE_URL', 'CLIENT_URL', ...(MAIL_TO_CONSOLE ? [] : ['RESEND_API_KEY', 'MAIL_FROM'])];
const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);

const CLIENT_URL = process.env.CLIENT_URL as string;
// It is the CORS origin and the start of every link in emails; a trailing slash or a path breaks both
if (!URL.canParse(CLIENT_URL) || new URL(CLIENT_URL).origin !== CLIENT_URL) {
  throw new Error(`CLIENT_URL must be an origin such as https://fintrack.vercel.app, got: ${CLIENT_URL}`);
}

export const env = {
  SECRET_KEY: process.env.SECRET_KEY as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: Number(process.env.PORT ?? 5050),
  CLIENT_URL,
  MAIL_TO_CONSOLE,
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
  MAIL_FROM: process.env.MAIL_FROM ?? '',
};
