import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanText, isAmount, isCurrency, isDate, isPassword, parseMonth } from './validate.ts';

test('parseMonth gives the month range and rejects bad input', () => {
  assert.deepEqual(parseMonth('2026-12'), ['2026-12-01', '2027-01-01']);
  assert.deepEqual(parseMonth('2026-02'), ['2026-02-01', '2026-03-01']);
  assert.equal(parseMonth('2026-13'), null);
  assert.equal(parseMonth('26-1'), null);
  assert.equal(parseMonth('0000-01'), null);
  assert.equal(parseMonth(202612), null);
});

test('isCurrency accepts ISO 4217 codes in upper case only', () => {
  assert.equal(isCurrency('UAH'), true);
  assert.equal(isCurrency('JPY'), true);
  assert.equal(isCurrency('XYZ'), false);
  assert.equal(isCurrency('uah'), false);
});

test('isAmount respects the fraction digits of the currency', () => {
  assert.equal(isAmount(1.5, 'JPY'), false);
  assert.equal(isAmount(150, 'JPY'), true);
  assert.equal(isAmount(1.234, 'KWD'), true);
  assert.equal(isAmount(1.234, 'USD'), false);
  assert.equal(isAmount(12.34, 'USD'), true);
  assert.equal(isAmount(0, 'USD'), false);
  assert.equal(isAmount(-5, 'USD'), false);
  assert.equal(isAmount('10', 'USD'), false);
  assert.equal(isAmount(1e10, 'USD'), false);
});

test('isDate rejects impossible dates', () => {
  assert.equal(isDate('2026-02-28'), true);
  assert.equal(isDate('2024-02-29'), true);
  assert.equal(isDate('2026-02-30'), false);
  assert.equal(isDate('2026-2-28'), false);
  assert.equal(isDate('0000-01-01'), false);
});

test('isPassword limits the length in bytes, as bcrypt does', () => {
  assert.equal(isPassword('short'), false);
  assert.equal(isPassword('long enough'), true);
  assert.equal(isPassword('я'.repeat(36)), true); // 72 bytes
  assert.equal(isPassword('я'.repeat(37)), false); // 74 bytes
});

test('cleanText trims and enforces the length', () => {
  assert.equal(cleanText('  Food  ', 50), 'Food');
  assert.equal(cleanText('   ', 50), null);
  assert.equal(cleanText('x'.repeat(51), 50), null);
  assert.equal(cleanText(42, 50), null);
});
