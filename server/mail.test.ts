import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Report } from '../shared/api-types.ts';

// mail.ts reads its settings through env.ts, which refuses to load without them; real values win
process.env.SECRET_KEY ??= 'test';
process.env.DATABASE_URL ??= 'postgresql://unused';
process.env.CLIENT_URL ??= 'http://localhost:5173';
process.env.TRUST_PROXY_HOPS ??= '0';
process.env.CRON_SECRET ??= 'test';
process.env.MAIL_TO_CONSOLE ??= '1';
const { linkMail, reportMail } = await import('./mail.ts');

test('linkMail fills every placeholder in every language', () => {
  for (const lang of ['en', 'uk'] as const) {
    for (const purpose of ['verify', 'reset'] as const) {
      const mail = linkMail(purpose, lang, 'a@example.com', 'tok-en_123');
      const link = `/${purpose}?token=tok-en_123`;
      assert.ok(mail.subject, `${lang}/${purpose} subject`);
      assert.ok(mail.text.includes(link), `${lang}/${purpose} text link`);
      assert.ok(mail.html.includes(`${link}"`), `${lang}/${purpose} button link`);
      assert.ok(!mail.html.includes('{{'), `${lang}/${purpose} leftover placeholder`);
      assert.ok(mail.html.includes(`<html lang="${lang}">`));
    }
  }
});

test('reportMail fills the layout, escapes names and translates the default categories', () => {
  const report: Report = {
    month: '2026-11',
    income: 1000,
    expense: 350.5,
    balance: 649.5,
    uncategorized: 20,
    categories: [
      { id: '1', name: 'Food', iconName: 'Food', goal: 300, spent: 330.5 },
      { id: '2', name: '<b>Bills</b>', iconName: 'Other', goal: null, spent: 0 },
      { id: '3', name: 'constructor', iconName: 'Other', goal: null, spent: 0 },
    ],
  };
  for (const lang of ['en', 'uk'] as const) {
    const mail = reportMail({ name: 'Ann', email: 'a@example.com', currency: 'UAH', lang }, report);
    assert.ok(!mail.html.includes('{{'), `${lang} leftover placeholder`);
    assert.ok(mail.html.includes('&lt;b&gt;Bills&lt;/b&gt;'), `${lang} category name escaped`);
    assert.ok(!mail.html.includes('<b>Bills'), `${lang} category name as HTML`);
    assert.ok(mail.html.includes('>constructor<'), `${lang} name that is an Object.prototype key`);
    assert.ok(mail.html.includes('/Profile"'), `${lang} link to turn the email off`);
    assert.ok(mail.text.includes('Ann'), `${lang} greeting`);
  }

  const uk = reportMail({ name: null, email: 'a@example.com', currency: 'UAH', lang: 'uk' }, report);
  assert.match(uk.subject, /листопад 2026/);
  assert.ok(uk.html.includes('Їжа'), 'default category translated');
  assert.ok(uk.html.includes('Без категорії'), 'row of expenses without a category');
  assert.ok(uk.html.includes('330,50'), 'amount in the Ukrainian format');
  assert.ok(uk.html.includes('#e53935'), 'spending over the goal in red');
});
