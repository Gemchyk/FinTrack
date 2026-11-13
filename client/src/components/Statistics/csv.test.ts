import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCsv } from './csv.ts';

test('toCsv in Ukrainian: semicolons, a decimal comma, quotes doubled', () => {
  assert.equal(
    toCsv([['Category', 'Goal'], ['Рахунки; "дім"', 1234.5, null, 'UAH'], [], ['Balance', -0.1]], 'uk', 2),
    '"Category";"Goal"\r\n"Рахунки; ""дім""";1234,50;;"UAH"\r\n\r\n"Balance";-0,10',
  );
});

test('toCsv in English: commas, a dot, the digits of the currency', () => {
  assert.equal(toCsv([['Food, home', 1500, 2.25]], 'en', 0), '"Food, home",1500,2');
  assert.equal(toCsv([['Food', 1.234]], 'en', 3), '"Food",1.234');
  assert.equal(toCsv([['Food', 1.5]], 'de', 2), '"Food",1.50');
});
