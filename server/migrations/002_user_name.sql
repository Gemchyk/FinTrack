-- Shown in the profile instead of the bare email. Signup requires it; accounts created before it have none
-- until the owner sets one in the profile
ALTER TABLE users ADD COLUMN name text;
