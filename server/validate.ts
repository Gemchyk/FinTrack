import type { Lang } from '../shared/api-types.ts';

const CURRENCIES = new Set(Intl.supportedValuesOf('currency'));
const LANGS: readonly string[] = ['en', 'uk'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// numeric(14,4) in the database holds at most 10 integer digits
const MAX_AMOUNT = 1e10;

export function parseMonth(value: unknown): [first: string, next: string] | null {
  if (typeof value !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value) || value.startsWith('0000')) return null;
  const [year, month] = value.split('-').map(Number);
  const next = month === 12
    ? `${String(year + 1).padStart(4, '0')}-01`
    : `${value.slice(0, 4)}-${String(month + 1).padStart(2, '0')}`;
  return [`${value}-01`, `${next}-01`];
}

export function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  // Date silently rolls 2026-02-30 over to March; the round trip catches that
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function isCurrency(value: unknown): value is string {
  return typeof value === 'string' && CURRENCIES.has(value);
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && LANGS.includes(value);
}

export function fractionDigits(currency: string): number {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

// Positive, fits the column and has no more decimals than the currency allows (JPY 0, USD 2, KWD 3)
export function isAmount(value: unknown, currency: string): value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value >= MAX_AMOUNT) return false;
  const scaled = value * 10 ** fractionDigits(currency);
  // Binary floats: 12.34 * 100 is 1234.0000000000002, so compare with a tolerance
  return Math.abs(scaled - Math.round(scaled)) < 1e-6;
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID.test(value);
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL.test(value);
}

// bcrypt ignores everything past 72 bytes, so a longer password would also match any of its 72-byte prefixes
export function isPassword(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 8 && Buffer.byteLength(value) <= 72;
}

// Trimmed non-empty text of at most `max` characters, or null
export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text && text.length <= max ? text : null;
}
