// JSON shapes the server sends and accepts. Both packages import this file with `import type` only,
// so it never reaches the runtime of either.

export type Lang = 'en' | 'uk';

export interface SignupInput {
  email: string;
  password: string;
  currency: string;
  lang: Lang;
}

// POST /signin: 401 for a wrong email or password, 403 while the email is not verified
export interface SigninInput {
  email: string;
  password: string;
}

export interface SigninResponse {
  token: string;
}

// GET /me; PATCH /me takes currency and/or lang and answers with the whole shape
export interface Me {
  email: string;
  currency: string;
  lang: Lang;
}

export type MeUpdate = Partial<Pick<Me, 'currency' | 'lang'>>;

export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD, a calendar date without a timezone
  categoryId: string | null;
  category: string | null;
  iconName: string | null;
}

export interface TransactionInput {
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  categoryId: string | null;
}

export interface TransactionPage {
  data: Transaction[];
  hasMore: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  goal: number | null;
}

export interface CategoryInput {
  name: string;
  iconName: string;
  goal: number | null;
}

export interface MonthTotals {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  balance: number;
}

export interface ReportCategory extends Category {
  spent: number;
}

export interface Report extends MonthTotals {
  // Expenses whose category was deleted
  uncategorized: number;
  categories: ReportCategory[];
}

export interface DashboardMonth {
  month: string;
  expense: number;
}

export interface ApiError {
  error: string;
}
