-- DJ Arwenn – PRIVATE Cloudflare D1 database.
-- This schema contains NO actual booked dates. NEVER commit date lists or client details.
CREATE TABLE IF NOT EXISTS booked_dates (
  date TEXT PRIMARY KEY NOT NULL CHECK (length(date) = 10)
);
CREATE TABLE IF NOT EXISTS availability_checks (
  visitor TEXT NOT NULL,
  bucket TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (visitor, bucket)
);
CREATE INDEX IF NOT EXISTS availability_checks_expiry ON availability_checks(expires_at);
