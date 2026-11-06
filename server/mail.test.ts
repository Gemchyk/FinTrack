import { test } from 'node:test';
import assert from 'node:assert/strict';

// mail.ts reads its settings through env.ts, which refuses to load without them; real values win
process.env.SECRET_KEY ??= 'test';
process.env.DATABASE_URL ??= 'postgresql://unused';
process.env.CLIENT_URL ??= 'http://localhost:5173';
process.env.MAIL_TO_CONSOLE ??= '1';
const { linkMail } = await import('./mail.ts');

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
