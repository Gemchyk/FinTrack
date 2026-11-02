import { readdir, readFile } from 'node:fs/promises';
import { Pool, types } from 'pg';
import type { PoolClient } from 'pg';
import { env } from './env.ts';

// pg returns bigint and numeric as strings, which break sums and .toFixed on the client, and turns
// a date into a JS Date shifted by the server timezone; keep dates as plain 'YYYY-MM-DD'
types.setTypeParser(types.builtins.INT8, Number);
types.setTypeParser(types.builtins.NUMERIC, Number);
types.setTypeParser(types.builtins.DATE, (value) => value);

export const pool = new Pool({ connectionString: env.DATABASE_URL, idleTimeoutMillis: 10_000 });

// Neon closes the connections when its compute goes to sleep. An idle client then emits 'error', and an
// unhandled 'error' event would crash the process; the pool simply opens a new client for the next query
pool.on('error', (err) => {
  console.error('Idle database client failed:', err.message);
});

export const UNIQUE_VIOLATION = '23505';
export const FOREIGN_KEY_VIOLATION = '23503';

// Error texts follow the server locale (Russian locally, English on Neon), so match on SQLSTATE
export function isPgError(err: unknown, code: string): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === code;
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    // A failed ROLLBACK must not hide the error that caused it
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

// Applies server/migrations/*.sql in name order, each once and in its own transaction.
// ponytail: no lock, two instances starting at once could race; add pg_advisory_lock when scaling out
export async function migrate(): Promise<void> {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const dir = new URL('./migrations/', import.meta.url);
  const files = (await readdir(dir)).filter((name) => name.endsWith('.sql')).sort();
  const { rows } = await pool.query<{ name: string }>('SELECT name FROM schema_migrations');
  const applied = new Set(rows.map((row) => row.name));

  for (const name of files.filter((file) => !applied.has(file))) {
    const sql = await readFile(new URL(name, dir), 'utf8');
    await withTransaction(async (client) => {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
    });
    console.log(`Applied migration ${name}`);
  }
}
