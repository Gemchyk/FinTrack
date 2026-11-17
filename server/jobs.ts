import { createHash, timingSafeEqual } from 'node:crypto';
import express from 'express';
import type { Lang } from '../shared/api-types.ts';
import { env } from './env.ts';
import { pool } from './db.ts';
import { fail } from './http.ts';
import { MailError, reportMail, sendMail } from './mail.ts';
import { monthReport } from './spending.ts';
import { parseMonth } from './validate.ts';

// The past month's report goes out on days 1 to 7 only. The extra days cover failed runs; any later, a backdated
// entry or the switch turned on in the profile would bring the report in the middle of the next month
const REPORT_DAYS = 7;

interface Recipient {
  id: string;
  name: string | null;
  email: string;
  currency: string;
  lang: Lang;
}

export const jobsRouter = express.Router();

function sha256(text: string): Buffer {
  return createHash('sha256').update(text).digest();
}

// timingSafeEqual needs equal lengths, which the hashes have; the time it takes then tells nothing about the secret
function isCronSecret(value: string | undefined): boolean {
  return value !== undefined && timingSafeEqual(sha256(value), sha256(env.CRON_SECRET));
}

// cron-job.org calls it once a day. The answer comes before the work: cron-job.org gives up after 30 seconds,
// and a cold start on Render already takes most of them
jobsRouter.post('/jobs/daily', (req, res) => {
  if (!isCronSecret(req.get('X-Cron-Secret'))) return fail(res, 401, 'Unauthorized');
  res.sendStatus(202);
  runDailyJob(new Date()).catch((err) => console.error('Daily job failed:', err));
});

async function runDailyJob(now: Date): Promise<void> {
  // A link works once and for an hour; after that its row is of no use
  await pool.query('DELETE FROM email_tokens WHERE used_at IS NOT NULL OR expires_at < now()');

  if (now.getUTCDate() > REPORT_DAYS) return;
  // The previous month in UTC: the server knows no user's timezone, and at the 06:00 UTC run the month is over
  // from London to Kyiv. Date.UTC turns month -1 into December of the year before
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1)).toISOString().slice(0, 7);
  await sendMonthlyReports(month);
}

// ponytail: one email at a time, fine for the Resend free quota of 100 a day; the batch API or a paid plan when
// users outgrow it
async function sendMonthlyReports(month: string): Promise<void> {
  const range = parseMonth(month) as [string, string];
  const { rows: recipients } = await pool.query<Recipient>(
    `SELECT u.id, u.name, u.email, u.currency, u.lang
       FROM users u
      WHERE u.email_verified_at IS NOT NULL
        AND u.monthly_report
        -- Opened this month: entries backdated into the past month would bring its report right after signup
        AND u.created_at < ($3::date::timestamp AT TIME ZONE 'UTC')
        AND NOT EXISTS (SELECT 1 FROM report_sends s WHERE s.user_id = u.id AND s.month = $1)
        -- An empty month sends nothing
        AND EXISTS (SELECT 1 FROM transactions t WHERE t.user_id = u.id AND t.date >= $2 AND t.date < $3)`,
    [month, range[0], range[1]],
  );

  for (const user of recipients) {
    const report = await monthReport(user.id, month, range);
    // Claimed before sending, so a second run at the same time skips this user; the row keeps what was sent
    const { rowCount } = await pool.query(
      'INSERT INTO report_sends (user_id, month, payload) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [user.id, month, JSON.stringify(report)],
    );
    if (!rowCount) continue;

    try {
      // A timeout does not mean the email was not sent; the key keeps a retry from sending it twice
      await sendMail(reportMail(user, report), `report/${user.id}/${month}`);
    } catch (err) {
      // A request with this key went through or is still running: the email is out
      if (err instanceof MailError && err.status === 409) continue;
      // Released for the next day's run
      await pool.query('DELETE FROM report_sends WHERE user_id = $1 AND month = $2', [user.id, month]);
      console.error(`Monthly report for user ${user.id} not sent:`, err);
      // The quota is shared with the verification and password emails; every further send would fail too
      if (err instanceof MailError && err.status === 429) return;
    }
  }
}
