import { readFileSync } from 'node:fs';
import type { Lang, Report } from '../shared/api-types.ts';
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

interface ReportTexts {
  subject: string;
  hello: string;
  income: string;
  expenses: string;
  balance: string;
  category: string;
  goal: string;
  spent: string;
  withoutCategory: string;
  button: string;
  outro: string;
  profile: string;
}

interface MailTexts {
  linkFallback: string;
  verify: LinkTexts;
  reset: LinkTexts;
  report: ReportTexts;
  // The default categories are stored under their English names (signup in auth.ts); a name the user typed
  // has no entry and is shown as it is
  categories: Record<string, string>;
}

interface ReportRecipient {
  name: string | null;
  email: string;
  currency: string;
  lang: Lang;
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
const REPORT_LAYOUT = readEmailFile('report.html');
const REPORT_ROW_LAYOUT = readEmailFile('report-row.html');

// Client pages that open the links; the token goes in the query string
const LINK_PATHS: Record<LinkPurpose, string> = { verify: '/verify', reset: '/reset' };

// Amounts in the report: red for a negative balance and for spending over the goal
const TEXT_COLOR = '#1f2937';
const ALERT_COLOR = '#e53935';

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Fills the placeholders: {{name}} with the value escaped, {{{name}}} with HTML that render() has already built.
// A placeholder without a value throws instead of sending an email with a blank in it
function render(layout: string, values: Record<string, string>): string {
  return layout.replace(/\{\{\{(\w+)\}\}\}|\{\{(\w+)\}\}/g, (_, html: string | undefined, text: string | undefined) => {
    const name = html ?? (text as string);
    const value = values[name];
    if (typeof value !== 'string') throw new Error(`No value for ${name} in an email layout`);
    return html ? value : value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
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

// The same rows as the report page: every category, then the expenses whose category was deleted
export function reportMail(user: ReportRecipient, report: Report): Mail {
  const texts = TEXTS[user.lang].report;
  const names = TEXTS[user.lang].categories;
  const money = new Intl.NumberFormat(user.lang, { style: 'currency', currency: user.currency });
  // Read in UTC: midnight of the 1st in a timezone west of UTC is still the previous month
  const monthName = new Intl.DateTimeFormat(user.lang, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${report.month}-01T00:00:00Z`),
  );
  const hello = user.name ? `${texts.hello}, ${user.name}!` : `${texts.hello}!`;
  const link = `${env.CLIENT_URL}/Statistics`;
  const profileLink = `${env.CLIENT_URL}/Profile`;

  const rows = [
    ...report.categories.map((category) => ({
      // hasOwn: a category the user named "constructor" must not pick up a property of Object.prototype
      name: Object.hasOwn(names, category.name) ? names[category.name] : category.name,
      goal: category.goal,
      spent: category.spent,
    })),
    ...(report.uncategorized > 0 ? [{ name: texts.withoutCategory, goal: null, spent: report.uncategorized }] : []),
  ];
  const rowsHtml = rows
    .map((row) =>
      render(REPORT_ROW_LAYOUT, {
        name: row.name,
        goal: row.goal === null ? '—' : money.format(row.goal),
        spent: money.format(row.spent),
        spentColor: row.goal !== null && row.spent > row.goal ? ALERT_COLOR : TEXT_COLOR,
      }),
    )
    .join('');

  const text = [
    hello,
    '',
    monthName,
    `${texts.income}: ${money.format(report.income)}`,
    `${texts.expenses}: ${money.format(report.expense)}`,
    `${texts.balance}: ${money.format(report.balance)}`,
    '',
    ...rows.map(
      (row) => `${row.name}: ${money.format(row.spent)}${row.goal === null ? '' : ` (${texts.goal}: ${money.format(row.goal)})`}`,
    ),
    '',
    `${texts.button}: ${link}`,
    `${texts.outro} ${texts.profile}: ${profileLink}`,
  ].join('\n');

  return {
    to: user.email,
    subject: `${texts.subject} ${monthName}`,
    text,
    html: render(REPORT_LAYOUT, {
      ...texts,
      lang: user.lang,
      hello,
      monthName,
      incomeAmount: money.format(report.income),
      expenseAmount: money.format(report.expense),
      balanceAmount: money.format(report.balance),
      balanceColor: report.balance < 0 ? ALERT_COLOR : TEXT_COLOR,
      rows: rowsHtml,
      link,
      profileLink,
    }),
  };
}

// Carries Resend's status: the monthly job stops on a used-up quota (429) and keeps going on other failures
export class MailError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// With an idempotency key Resend sends a repeat of the same key within 24 hours only once and answers it 409
export async function sendMail(mail: Mail, idempotencyKey?: string): Promise<void> {
  if (env.MAIL_TO_CONSOLE) {
    console.log(`\n[MAIL_TO_CONSOLE] To: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
    return;
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  // An HTTP API, not SMTP: free Render and Railway plans block the outgoing mail ports
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({ from: env.MAIL_FROM, to: [mail.to], subject: mail.subject, text: mail.text, html: mail.html }),
    // Signup waits for this inside a database transaction; a hung request must not keep it open
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new MailError(response.status, `Resend answered ${response.status}: ${await response.text()}`);
  }
}
