# DJ Arwenn Website

Public static site + private date-by-date booking lookup on Cloudflare Workers.

## Status / varnostna zaščita

- **FormSubmit is no longer used**. Enquiry form sends through Web3Forms.
- **No public booked-date JSON or availability calendar**. A visitor can ask about only one chosen date.
- A Worker checks the private D1 table. The front-end never downloads a list of booked dates.
- Rate limiting is based on a secret-salted SHA-256 digest of the visitor IP, with temporary counters in D1 (6 per 10 min, 15 per day).
- An enquiry does **not** automatically block or reserve a date.
- **Until D1 and AVAILABILITY_HASH_SALT are configured, the checker replies "unknown"** and the user can still submit a normal enquiry. Never show "available" based on a missing database.

## One-time Cloudflare configuration

1. Create a Cloudflare D1 database named `dj-arwenn-bookings` in your account.
2. Find and copy its **database ID** (the UUID is an identifier, not a password).
3. Add the database to `wrangler.jsonc`, with:
   - binding: `DB`
   - database_name: `dj-arwenn-bookings`
   - database_id: the real ID from Cloudflare (never invent a placeholder)
4. Apply SQL schema `migrations/0001_availability.sql` to the **remote** D1 database (Cloudflare dashboard SQL console or Wrangler CLI).
5. Configure the Worker secret `AVAILABILITY_HASH_SALT` with a cryptographically random string at least 24 characters long via Cloudflare's secret settings or `wrangler secret put AVAILABILITY_HASH_SALT`. **Never commit it or share it in chat.**
6. Let the existing GitHub-connected deployment publish the updated Worker. Run a live check; if the D1 connection or schema fails, the interface falls back to manual confirmation.

Example binding shape (only after a real ID is known):

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "dj-arwenn-bookings",
    "database_id": "REAL_CLOUDFLARE_DATABASE_ID"
  }
]
```

## Editing booked dates (PRIVATE)

Use the D1 dashboard SQL console or secure Wrangler commands. Do **not** put booked dates, names, contracts, or other private details in `worker.js`, `index.html`, `app.js`, or any publicly fetched JSON.

A table row means "not accepting bookings for that date". Deleting that row reopens enquiries. Only confirmed bookings should be marked as booked; optional tentative holds must be handled explicitly.

**Do not commit completed SQL inserts into this public repository.**

## Deployment and local development

- Config: `wrangler.jsonc`
- Worker: `worker.js`
- Public UI: `index.html`, `app.js`, `availability.js`, `styles.css`, `premium.css`
- D1 schema: `migrations/0001_availability.sql` (safe to commit; no dates)
- Asset filtering: `.assetsignore` keeps private Worker code and SQL out of public asset delivery.

**Cloudflare Git deployment command: `npx wrangler deploy` (do not use `--assets .`).** The Worker serves `/api/availability` for POST requests while static files remain available. After editing the Cloudflare deploy command, a new GitHub commit can trigger a new deployment if automatic builds are enabled.

**Privacy limit:** Hiding the calendar and rate limiting greatly reduces casual snooping, but a determined person can still attempt repeated single-date queries. No public date-status checker can fully guarantee secrecy. Historical public GitHub commits may also contain previously published dates; Git history must be handled separately if those dates require full historical removal.

## Private owner interface (mobile)

The booking management UI is available at `/admin.html` (not linked from the public site).
The HTML itself is not secret, but the POST API `/api/admin/dates` rejects all unauthenticated operations.
The admin API does not return booked dates or modify D1 unless a separate, correct admin token is supplied.

**One-time setup before using admin:**

1. Open Cloudflare > Workers & Pages > `dj-arwenn-website` > Settings / Variables and Secrets.
2. Create an encrypted **Secret** named exactly `DJ_ARWENN_ADMIN_TOKEN` with a strong independent random value, minimum 32 characters (ideally 64+), **different from** `AVAILABILITY_HASH_SALT`.
3. Generate and store the key in a password manager; never commit it to GitHub or send it in chat.
4. Ensure the Worker is deployed after the new secret is configured; open `https://dj-arwenn-website.sasolju999.workers.dev/admin.html` and enter the admin token.
5. Click **ODPRI TERMINE** to view future blocked dates, add a confirmed booking, or release a date. Refresh the public checker to verify changes.

The admin form holds the token only in JS memory until the page closes or is locked, with no cookies, localStorage or URL parameters. The UI includes `noindex` but this does not restrict access; the server-side token is the security boundary. If the token is lost, generate and configure a new one in Cloudflare. If exposed, rotate immediately. Use HTTPS only.

**Important:** Do not reuse the existing `AVAILABILITY_HASH_SALT` as admin token. Newly received enquiries are not automatically marked as booked. The owner must explicitly confirm and mark each date.

