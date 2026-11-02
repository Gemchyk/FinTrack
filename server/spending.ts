import express from 'express';
import type {
  Category,
  CategoryInput,
  DashboardMonth,
  MonthTotals,
  Report,
  ReportCategory,
  Transaction,
  TransactionInput,
  TransactionPage,
} from '../shared/api-types.ts';
import { pool, isPgError, FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } from './db.ts';
import { requireAuth } from './auth.ts';
import { asRecord, currentUser, fail } from './http.ts';
import { cleanText, isAmount, isDate, isUuid, parseMonth } from './validate.ts';

export const spendingRouter = express.Router();
spendingRouter.use(requireAuth);

const TRANSACTION_COLUMNS = `t.id, t.type, t.title, t.amount, t.date,
  t.category_id AS "categoryId", c.name AS category, c.icon_name AS "iconName"`;
const CATEGORY_COLUMNS = `id, name, icon_name AS "iconName", goal`;
const TRANSACTION_TYPES = ['Income', 'Expense'];

// A column name cannot be a query parameter, so ORDER BY is taken only from this list
const SORTS = new Map([
  ['date', 't.date DESC, t.created_at DESC'],
  ['amount', 't.amount ASC'],
  // ICU collation sorts the same on Windows and on Neon, unlike each server's default locale
  ['name', 't.title COLLATE "und-x-icu" ASC'],
]);

// Express 5 turns ?a=1&a=2 into an array; only a single value counts
function queryValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function queryInt(value: unknown, fallback: number): number | null {
  const text = queryValue(value);
  if (text === undefined) return fallback;
  return /^\d+$/.test(text) ? Number(text) : null;
}

function parseTransactionInput(body: unknown, currency: string): TransactionInput | string {
  const { type, title, amount, date, categoryId } = asRecord(body);
  if (type !== 'Income' && type !== 'Expense') return 'Invalid type';
  const cleanTitle = cleanText(title, 100);
  if (!cleanTitle) return 'Invalid title';
  if (!isAmount(amount, currency)) return 'Invalid amount';
  if (!isDate(date)) return 'Invalid date';

  let cleanCategoryId: string | null = null;
  if (categoryId !== null && categoryId !== undefined) {
    if (!isUuid(categoryId)) return 'Invalid category';
    // Categories group spending; an income in one would be counted as an expense in the report
    if (type === 'Income') return 'Income cannot have a category';
    cleanCategoryId = categoryId;
  }
  return { type, title: cleanTitle, amount, date, categoryId: cleanCategoryId };
}

function parseCategoryInput(body: unknown, currency: string): CategoryInput | string {
  const { name, iconName, goal } = asRecord(body);
  const cleanName = cleanText(name, 50);
  if (!cleanName) return 'Invalid name';
  const cleanIcon = cleanText(iconName, 30);
  if (!cleanIcon) return 'Invalid icon';

  let cleanGoal: number | null = null;
  if (goal !== null && goal !== undefined) {
    if (!isAmount(goal, currency)) return 'Invalid goal';
    cleanGoal = goal;
  }
  return { name: cleanName, iconName: cleanIcon, goal: cleanGoal };
}

async function monthTotals(userId: string, [first, next]: [string, string]) {
  const { rows } = await pool.query<Omit<MonthTotals, 'month'> & { uncategorized: number }>(
    `SELECT COALESCE(SUM(amount) FILTER (WHERE type = 'Income'), 0) AS income,
            COALESCE(SUM(amount) FILTER (WHERE type = 'Expense'), 0) AS expense,
            -- Computed in SQL: subtracting the two floats in JS would print 799.4999999999999
            COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE -amount END), 0) AS balance,
            COALESCE(SUM(amount) FILTER (WHERE type = 'Expense' AND category_id IS NULL), 0) AS uncategorized
       FROM transactions
      WHERE user_id = $1 AND date >= $2 AND date < $3`,
    [userId, first, next],
  );
  return rows[0];
}

// --- Transactions -----------------------------------------------------------------------------

spendingRouter.get('/transactions', async (req, res) => {
  const user = currentUser(res);
  const page = queryInt(req.query.page, 1);
  const limit = queryInt(req.query.limit, 20);
  if (page === null || page < 1 || limit === null || limit < 1 || limit > 50) {
    return fail(res, 400, 'Invalid page or limit');
  }
  const type = queryValue(req.query.type) ?? 'all';
  if (type !== 'all' && !TRANSACTION_TYPES.includes(type)) return fail(res, 400, 'Invalid type');
  const category = queryValue(req.query.category) ?? 'all';
  if (category !== 'all' && !isUuid(category)) return fail(res, 400, 'Invalid category');
  const orderBy = SORTS.get(queryValue(req.query.sort) ?? 'date');
  if (!orderBy) return fail(res, 400, 'Invalid sort');
  const month = queryValue(req.query.month);
  const range = month === undefined ? null : parseMonth(month);
  if (month !== undefined && !range) return fail(res, 400, 'Invalid month');

  // Only placeholders and the whitelisted ORDER BY go into the SQL text; values travel as parameters
  const params: unknown[] = [user.id];
  const where = ['t.user_id = $1'];
  if (type !== 'all') {
    params.push(type);
    where.push(`t.type = $${params.length}`);
  }
  if (category !== 'all') {
    params.push(category);
    where.push(`t.category_id = $${params.length}`);
  }
  if (range) {
    params.push(range[0], range[1]);
    where.push(`t.date >= $${params.length - 1} AND t.date < $${params.length}`);
  }
  // One extra row tells whether another page exists
  params.push(limit + 1, (page - 1) * limit);

  const { rows } = await pool.query<Transaction>(
    `SELECT ${TRANSACTION_COLUMNS}
       FROM transactions t
       LEFT JOIN categories c ON c.id = t.category_id
      WHERE ${where.join(' AND ')}
      ORDER BY ${orderBy}, t.id
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  const body: TransactionPage = { data: rows.slice(0, limit), hasMore: rows.length > limit };
  res.json(body);
});

spendingRouter.post('/transactions', async (req, res) => {
  const user = currentUser(res);
  const input = parseTransactionInput(req.body, user.currency);
  if (typeof input === 'string') return fail(res, 400, input);

  try {
    const { rows } = await pool.query<Transaction>(
      `WITH t AS (
         INSERT INTO transactions (user_id, type, title, amount, date, category_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *)
       SELECT ${TRANSACTION_COLUMNS} FROM t LEFT JOIN categories c ON c.id = t.category_id`,
      [user.id, input.type, input.title, input.amount, input.date, input.categoryId],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    // The composite key rejects a category that does not exist or belongs to another user
    if (isPgError(err, FOREIGN_KEY_VIOLATION)) return fail(res, 400, 'Unknown category');
    throw err;
  }
});

spendingRouter.put('/transactions/:id', async (req, res) => {
  const user = currentUser(res);
  if (!isUuid(req.params.id)) return fail(res, 404, 'Transaction not found');
  const input = parseTransactionInput(req.body, user.currency);
  if (typeof input === 'string') return fail(res, 400, input);

  try {
    const { rows } = await pool.query<Transaction>(
      `WITH t AS (
         UPDATE transactions
            SET type = $3, title = $4, amount = $5, date = $6, category_id = $7
          WHERE id = $1 AND user_id = $2
         RETURNING *)
       SELECT ${TRANSACTION_COLUMNS} FROM t LEFT JOIN categories c ON c.id = t.category_id`,
      [req.params.id, user.id, input.type, input.title, input.amount, input.date, input.categoryId],
    );
    // Another user's transaction looks exactly like a missing one
    if (!rows[0]) return fail(res, 404, 'Transaction not found');
    res.json(rows[0]);
  } catch (err) {
    if (isPgError(err, FOREIGN_KEY_VIOLATION)) return fail(res, 400, 'Unknown category');
    throw err;
  }
});

spendingRouter.delete('/transactions/:id', async (req, res) => {
  const user = currentUser(res);
  if (!isUuid(req.params.id)) return fail(res, 404, 'Transaction not found');
  const { rowCount } = await pool.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [
    req.params.id,
    user.id,
  ]);
  if (!rowCount) return fail(res, 404, 'Transaction not found');
  res.sendStatus(204);
});

// --- Categories -------------------------------------------------------------------------------

spendingRouter.get('/categories', async (_req, res) => {
  const { rows } = await pool.query<Category>(
    `SELECT ${CATEGORY_COLUMNS} FROM categories WHERE user_id = $1 ORDER BY name COLLATE "und-x-icu"`,
    [currentUser(res).id],
  );
  res.json(rows);
});

spendingRouter.post('/categories', async (req, res) => {
  const user = currentUser(res);
  const input = parseCategoryInput(req.body, user.currency);
  if (typeof input === 'string') return fail(res, 400, input);

  try {
    const { rows } = await pool.query<Category>(
      `INSERT INTO categories (user_id, name, icon_name, goal) VALUES ($1, $2, $3, $4)
       RETURNING ${CATEGORY_COLUMNS}`,
      [user.id, input.name, input.iconName, input.goal],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (isPgError(err, UNIQUE_VIOLATION)) return fail(res, 409, 'Category already exists');
    throw err;
  }
});

spendingRouter.put('/categories/:id', async (req, res) => {
  const user = currentUser(res);
  if (!isUuid(req.params.id)) return fail(res, 404, 'Category not found');
  const input = parseCategoryInput(req.body, user.currency);
  if (typeof input === 'string') return fail(res, 400, input);

  try {
    const { rows } = await pool.query<Category>(
      `UPDATE categories SET name = $3, icon_name = $4, goal = $5
        WHERE id = $1 AND user_id = $2
       RETURNING ${CATEGORY_COLUMNS}`,
      [req.params.id, user.id, input.name, input.iconName, input.goal],
    );
    if (!rows[0]) return fail(res, 404, 'Category not found');
    res.json(rows[0]);
  } catch (err) {
    if (isPgError(err, UNIQUE_VIOLATION)) return fail(res, 409, 'Category already exists');
    throw err;
  }
});

// The transactions stay; the foreign key clears their category_id
spendingRouter.delete('/categories/:id', async (req, res) => {
  const user = currentUser(res);
  if (!isUuid(req.params.id)) return fail(res, 404, 'Category not found');
  const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1 AND user_id = $2', [
    req.params.id,
    user.id,
  ]);
  if (!rowCount) return fail(res, 404, 'Category not found');
  res.sendStatus(204);
});

// --- Month figures ----------------------------------------------------------------------------
// The client sends its local month: the server's clock and timezone would put the first hours of a
// month in Kyiv into the previous one

spendingRouter.get('/balance', async (req, res) => {
  const month = queryValue(req.query.month);
  const range = parseMonth(month);
  if (month === undefined || !range) return fail(res, 400, 'Invalid month');

  const { income, expense, balance } = await monthTotals(currentUser(res).id, range);
  const body: MonthTotals = { month, income, expense, balance };
  res.json(body);
});

spendingRouter.get('/report', async (req, res) => {
  const user = currentUser(res);
  const month = queryValue(req.query.month);
  const range = parseMonth(month);
  if (month === undefined || !range) return fail(res, 400, 'Invalid month');

  const [totals, { rows: categories }] = await Promise.all([
    monthTotals(user.id, range),
    // Expenses only: an income has no category, and counting it here would inflate the spending
    pool.query<ReportCategory>(
      `SELECT c.id, c.name, c.icon_name AS "iconName", c.goal, COALESCE(SUM(t.amount), 0) AS spent
         FROM categories c
         LEFT JOIN transactions t
           ON t.category_id = c.id AND t.type = 'Expense' AND t.date >= $2 AND t.date < $3
        WHERE c.user_id = $1
        GROUP BY c.id
        ORDER BY c.name COLLATE "und-x-icu"`,
      [user.id, range[0], range[1]],
    ),
  ]);
  const body: Report = { month, ...totals, categories };
  res.json(body);
});

// Expenses of the 12 months ending with the given one
spendingRouter.get('/dashboard', async (req, res) => {
  const range = parseMonth(queryValue(req.query.month));
  if (!range) return fail(res, 400, 'Invalid month');

  // Every month is present, zero when empty: an empty list for a new user made the old client refetch forever
  const { rows } = await pool.query<DashboardMonth>(
    `SELECT to_char(m, 'YYYY-MM') AS month, COALESCE(SUM(t.amount), 0) AS expense
       FROM generate_series($2::date - interval '11 months', $2::date, interval '1 month') AS m
       LEFT JOIN transactions t
         ON t.user_id = $1 AND t.type = 'Expense' AND t.date >= m AND t.date < m + interval '1 month'
      GROUP BY m
      ORDER BY m`,
    [currentUser(res).id, range[0]],
  );
  res.json(rows);
});
