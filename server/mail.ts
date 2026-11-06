import { readFileSync } from 'node:fs';
import type { Lang } from '../shared/api-types.ts';
import { env } from './env.ts';

export type LinkPurpose = 'verify' | 'reset';

interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface LinkTexts {
  subject: string;
  intro: string;
  button: string;
  outro: string;
}

interface MailTexts {
  linkFallback: string;
  verify: LinkTexts;
  reset: LinkTexts;
}

// Texts per language and the HTML layouts live in server/emails/, read once at start. Layouts use inline
// styles and one column up to 480px wide: mail clients drop <style>, and most emails are read on phones
const EMAILS_DIR = new URL('./emails/', import.meta.url);
const readEmailFile = (name: string) => readFileSync(new URL(name, EMAILS_DIR), 'utf8');
const TEXTS: Record<Lang, MailTexts> = {
  en: JSON.parse(readEmailFile('en.json')),
  uk: JSON.parse(readEmailFile('uk.json')),
};
const LINK_LAYOUT = readEmailFile('link.html');

// Client pages that open the links; the token goes in the query string
const LINK_PATHS: Record<LinkPurpose, string> = { verify: '/verify', reset: '/reset' };

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Fills the {{name}} placeholders, escaping every value. A placeholder without a value throws instead of
// sending an email with a blank in it
function render(layout: string, values: Record<string, string>): string {
  return layout.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    if (typeof values[name] !== 'string') throw new Error(`No value for {{${name}}} in an email layout`);
    return values[name].replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
  });
}

export function linkMail(purpose: LinkPurpose, lang: Lang, to: string, token: string): Mail {
  const texts = TEXTS[lang][purpose];
  const link = `${env.CLIENT_URL}${LINK_PATHS[purpose]}?token=${token}`;
  return {
    to,
    subject: texts.subject,
    text: `${texts.intro}\n\n${link}\n\n${texts.outro}`,
    html: render(LINK_LAYOUT, { ...texts, linkFallback: TEXTS[lang].linkFallback, link, lang }),
  };
}

export async function sendMail(mail: Mail): Promise<void> {
  if (env.MAIL_TO_CONSOLE) {
    console.log(`\n[MAIL_TO_CONSOLE] To: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
    return;
  }
  // An HTTP API, not SMTP: free Render and Railway plans block the outgoing mail ports
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [mail.to], subject: mail.subject, text: mail.text, html: mail.html }),
    // Signup waits for this inside a database transaction; a hung request must not keep it open
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Resend answered ${response.status}: ${await response.text()}`);
}
