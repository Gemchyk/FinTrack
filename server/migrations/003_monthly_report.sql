-- The report email on the first days of each month; the owner turns it off in the profile
ALTER TABLE users ADD COLUMN monthly_report boolean NOT NULL DEFAULT true;
