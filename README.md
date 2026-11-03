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

## Booking safety & manual recovery

- The owner-only **PRENESI VARNOSTNO KOPIJO** button downloads a JSON snapshot of the complete `booked_dates` table including past dates. It does not include IP rate-limit counters, client information, or any secret.
- Run a backup after every significant booking change, and keep it in a private folder. **Do not** upload JSON bookings to the public GitHub repo or share it via a public link.
- No automatic backup schedule, remote file upload, or one-click restore is included. Confirm the file exists in Downloads after using the button.
- A backup is **not** the same as a restore feature. To restore, use the private D1 console or Cloudflare D1's native backup/time-travel options (subject to plan and retention) and verify records before publishing. Do not paste or commit the private snapshot into public website files.
- The admin page receives `Cache-Control: no-store`, anti-indexing, anti-framing, and a restrictive Content Security Policy.
- Admin changes now require confirmation before a date is blocked or released.
- Public enquiries remain delivered through Web3Forms. Its existing botcheck honeypot and service-side protection are not an assurance against all spam; adding Turnstile would need a server-side verified submission proxy and careful testing.
- **Functional verification:** use a date you know is free, mark it booked in owner UI, verify the public lookup displays **TERMIN JE ŽE ZASEDEN**, release the date, verify **TERMIN JE PREDVIDOMA PROST**. Do not perform this test on actual confirmed bookings.

## Form spam protection (Web3Forms hCaptcha)

The contact form now includes free Web3Forms hCaptcha, in addition to its existing honeypot. The browser prevents submission until hCaptcha has produced a response token, while Web3Forms verifies that token on its own servers. This does not require a new Cloudflare Worker secret, hCaptcha account, paid subscription, or changes to the private booking D1 system.

**Required manual activation in the Web3Forms dashboard:**

1. Visit https://app.web3forms.com/ and open the form associated with the existing DJ Arwenn booking enquiry access key.
2. Find Spam Protection / Block Spam / CAPTCHA settings and choose **hCaptcha**, then save. Web3Forms documentation states that this is required to enforce hCaptcha server-side. Do not assume the UI alone enforces it.
3. Check the live enquiry form in a normal and a private mobile browser. Verify the hCaptcha appears, solving it allows an enquiry, and a real test email arrives.
4. Submit the form without solving the challenge and verify that no email is sent. Keep the fallback mailto and Messenger options usable if hCaptcha is blocked or the service is unavailable.
5. If problems arise, revert the site change or restore the prior working form while troubleshooting.

Web3Forms docs: https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha

Caveats: hCaptcha introduces some friction, and browsers that block third-party scripts might be unable to send via the Web3Forms form. A direct mailto or Messenger alternative remains available. The 45-second same-tab repeated-submission guard is client-side only; it is **not** an abuse or backend rate limit. Never expose the private Worker secrets.
