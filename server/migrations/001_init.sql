CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash text NOT NULL,
  email_verified_at timestamptz,
  -- In the JWT; bumping it on a password reset invalidates every token issued before
  token_version integer NOT NULL DEFAULT 0,
  currency char(3) NOT NULL,
  lang text NOT NULL CHECK (lang IN ('en', 'uk')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Email verification and password reset links; only the sha256 of the token is stored
CREATE TABLE email_tokens (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  purpose text NOT NULL CHECK (purpose IN ('verify', 'reset')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name text NOT NULL,
  icon_name text NOT NULL,
  goal numeric(14, 4) CHECK (goal > 0),
  UNIQUE (user_id, name),
  -- Target of the composite key in transactions
  UNIQUE (user_id, id)
);

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('Income', 'Expense')),
  title text NOT NULL,
  amount numeric(14, 4) NOT NULL CHECK (amount > 0),
  date date NOT NULL,
  category_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  -- A plain key on category_id would accept another user's category; including user_id makes the
  -- database refuse it. Deleting a category clears only category_id, not user_id
  FOREIGN KEY (user_id, category_id) REFERENCES categories (user_id, id) ON DELETE SET NULL (category_id)
);

CREATE INDEX transactions_user_date_idx ON transactions (user_id, date);

-- Monthly report emails already sent; the primary key keeps a retried cron run from sending twice
CREATE TABLE report_sends (
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  month char(7) NOT NULL,
  payload jsonb NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, month)
);
