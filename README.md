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

## Optional no-subscription Turnstile + Gmail replacement (not enabled by default)

The current Web3Forms + hCaptcha flow remains active until **all** Cloudflare settings are configured and `ENQUIRY_TURNSTILE_ENABLED=true`. The old flow is not deleted. This branch adds a second transport:

1. Browser loads a Cloudflare Turnstile widget using the public `TURNSTILE_SITE_KEY`, with action `dj_enquiry`.
2. Browser sends enquiry and Turnstile response to same-origin `POST /api/enquiry` on our Cloudflare Worker.
3. Worker validates fields, checks D1 booked dates, applies IP-digest limits (5/hour and 12/day), and verifies Turnstile **server-side** using Cloudflare `siteverify` and `TURNSTILE_SECRET_KEY`. Never trust frontend checks alone.
4. Worker forwards only validated fields and a server-only bridge token to a Google Apps Script web app.
5. Google Apps Script uses `MailApp` to send the message to the Google account that deployed it (the owner), setting reply-to to the visitor.

**Setup. Do not switch on until the last test passes:**

1. In Cloudflare Turnstile, create a **Managed** widget. Allow the production hostname `dj-arwenn-website.sasolju999.workers.dev` (and your own domain if added later). Copy the **site key** and **secret key** separately. The site key is public; secret key must remain private.
2. In `https://script.google.com/`, create a standalone Apps Script project and paste `integrations/apps-script-gmail.gs` into `Code.gs`. The file is an example, not deployed automatically.
3. Generate a strong random shared secret (at least 32 characters) **locally**, save it in the Apps Script project's **Project Settings > Script properties** as `ENQUIRY_BRIDGE_TOKEN`. This is a **new independent secret**; do not reuse the admin key or the availability salt. Never send secret values in chat.
4. Deploy the script as a **Web app** with **Execute as: Me** and **Who has access: Anyone**. Authorize its required permissions to send mail. Copy its `https://script.google.com/macros/s/.../exec` deployment URL. The script's shared secret is still required for every delivery; its URL alone must never send email.
5. In Cloudflare Worker Settings > Variables and Secrets, configure:
   - `TURNSTILE_SITE_KEY` = public site key (plain-text variable is sufficient).
   - `TURNSTILE_SECRET_KEY` = private Turnstile secret (encrypted Secret).
   - `ENQUIRY_APPS_SCRIPT_URL` = Apps Script deployment URL (variable or Secret).
   - `ENQUIRY_BRIDGE_TOKEN` = same independent token as in Script Properties (encrypted Secret).
   - **Leave `ENQUIRY_TURNSTILE_ENABLED` unset during configuration.**
6. To test sending without impacting the live site, deploy or test the script separately (using a temporary private test harness with the shared token), ensure it sends to the intended owner Gmail account, and verify quotas and permissions. Then set `ENQUIRY_TURNSTILE_ENABLED=true` on the Worker to allow the new flow. Roll back by removing or setting the flag to `false`. This immediately restores the original hCaptcha/Web3Forms form after the next reload; **do not disable hCaptcha in Web3Forms dashboard while it is needed as the fallback**.
7. After enabling, refresh the website and verify that Turnstile appears instead of hCaptcha. Submit one real test enquiry. Confirm that email arrives with the visitor's correct reply-to and all event fields, and that booked dates are still rejected. Test mobile Chrome. If delivery is not confirmed, disable the flag and retain the old form.

**Reliability/security limitations:**

- This integration is prepared but has not yet been tested with the user's live Turnstile or Apps Script account. Do not assume it is activated from a GitHub merge.
- Google Apps Script may reject anonymous access if the account's administrator forbids "Anyone" deployments. MailApp has a **daily quota** and Google can change it.
- Turnstile/Apps Script are third-party services and may introduce access or privacy implications; review the privacy notice before enabling.
- If the Apps Script response is delayed, a message might arrive despite the browser reporting an unconfirmed send. Check your inbox before retrying.
- No custom domain or paid Web3Forms upgrade is required for this implementation. However, it still depends on an account that allows public Apps Script web apps and sufficient free MailApp quota.
- Users can still contact the DJ via Messenger or their email client if automated delivery fails. The Worker does not store enquiry personal details in D1, and the script does not log them.

## Important: Dashboard variables and GitHub deployments

Cloudflare Wrangler normally replaces dashboard-managed *plaintext variables* during a GitHub `wrangler deploy`. This project uses `"keep_vars": true` in `wrangler.jsonc` to preserve dashboard-managed variables. Encrypted Secrets are managed separately. After the first deploy with this setting, re-add any previously removed `TURNSTILE_SITE_KEY` and `ENQUIRY_TURNSTILE_ENABLED` under **Worker > Settings > Runtime variables and secrets > Production**. Use the real Turnstile public site key and exact string `true`, respectively. No secret values belong in the repository. Use `?debug_turnstile=1#inquiry-form` to check which configuration names are still invalid. Do not assume that a successful deployment means the form delivery has been verified.

## Optional free short public address (staged, no downtime)

**Target:** `https://arwenn.sasolju999.workers.dev/`

The existing `https://dj-arwenn-website.sasolju999.workers.dev/` **must remain deployed and untouched**. The new `arwenn` Worker in `short-domain/` is a thin proxy via a Cloudflare **Service Binding**, not an HTTP redirect. It forwards the original request to the existing Worker, so the shorter hostname remains in the visitor's browser and both addresses use the **same** private D1 date list, booking code and email delivery backend. Do not create a second database or copy any Worker secrets.

### Phone-friendly manual deployment (only after the code is reviewed)

1. In the *same Cloudflare account*, go to **Workers & Pages → Create → Worker → Start with Hello World**. Set name `arwenn` (or another available short name). This should offer the corresponding `*.sasolju999.workers.dev` URL.
2. Deploy the empty Worker, then use **Edit code** to replace its starter script with the **full contents** of `short-domain/worker.js` and deploy again. The Worker initially returns 503 until the Service Binding is added; the original production site keeps working.
3. In **that new Worker's Settings → Bindings → Add binding → Service**, create **Binding name** `DJ_ARWENN_ORIGIN`, **Service** `dj-arwenn-website`; save/deploy the binding. This is not a D1 binding. If Cloudflare offers a specific environment choice, use the live production target.
4. In **Turnstile → existing DJ Arwenn widget → Settings → Hostname management**, **add** the new hostname `arwenn.sasolju999.workers.dev` alongside the old hostname. Do not remove the old one and do not generate new keys. The backend checks that Siteverify's `hostname` matches the requested hostname, so this extra Turnstile allowance is required.
5. Test the short site in a separate browser tab while the old site remains active: page loads with all images/styles; one original booked date still reports booked; another date shows enquiry open; Turnstile verifies; submit **one** test enquiry from the short URL and confirm actual Gmail delivery; owner admin date list is identical at both URLs.
6. Only after all tests succeed, update SEO canonicals, social sharing URLs, `robots.txt`, `sitemap.xml`, and Linktree/FB/IG links to use the shorter URL. Search Console property should use **URL prefix + HTML tag** for the Workers subdomain (the user cannot add DNS verification records to `workers.dev`). Consider making the long address redirect to the short one **later**, only after the new address is working.

**Important:** The short URL is **not created merely by merging a GitHub PR**. It must be created/deployed in Cloudflare as a separate Worker and connected with the Service Binding; the existing site's GitHub deployment does not provision a new Worker. The current main site's HTML canonical and Open Graph references intentionally stay on the old host until a verified, tested cutover. Do not delete, rename or overwrite `dj-arwenn-website` during setup.

### CLI alternative (not required for mobile)

From the repository root, a developer with Wrangler access can deploy the separate Worker using `npx wrangler deploy --config short-domain/wrangler.jsonc`, provided the account supports that Service Binding. This must never be run instead of the primary Worker deploy in the existing GitHub CI.

## Optional private-label public URL with Cloudflare Pages (zero extra monthly cost)

Desired URL: `https://djarwenn.pages.dev/` **if the Pages project name `djarwenn` is available**. This is shorter and does not include the Cloudflare account's `sasolju999` subdomain in the visible public URL. Pages project names are not reserved by this commit and may already be taken.

The `pages-alias/` folder is a **separate Pages project** with an advanced-mode `_worker.js`, not a replacement for `dj-arwenn-website`. A Pages **Service binding** named `DJ_ARWENN_ORIGIN` forwards browser requests to the existing Worker, which still handles all assets, availability checks, private bookings and Gmail delivery. No public 301/302 redirect, no duplicated database, and no copied private keys. Until the owner has tested the new URL, the original site and its current social links remain in use.

### Safe setup on the phone

1. Cloudflare dashboard → Workers & Pages → Create → **Pages** → Connect to Git. Pick the existing repository `sasolju999-ui/dj-arwenn-website`. Do not rename/delete the existing Worker.
2. Set **Project name** to `djarwenn`, if available, for the URL `djarwenn.pages.dev`. Leave **Framework preset** as None, **Build command** blank (or `exit 0` if required), and **Build output directory** `pages-alias` relative to repository root. Keep repository **Root directory** empty/default. This deploys just the `pages-alias/` folder, including its `_worker.js` module.
3. Before expecting the alias to work, go to the new **Pages** project → Settings → Bindings → **Add → Service binding**. Set variable name `DJ_ARWENN_ORIGIN` and Service `dj-arwenn-website`. Save and redeploy the Pages project for the binding to take effect.
4. The proxy intentionally returns 503 if the service binding is absent. The existing site is unaffected.
5. Open the existing **Cloudflare Turnstile widget**, add hostname `djarwenn.pages.dev` to allowed hostnames **in addition** to `dj-arwenn-website.sasolju999.workers.dev`. Do not regenerate Site Key or Secret Key.
6. Test Pages URL and compare against old: loading images/CSS, blocked and open dates, Turnstile check, one real test enquiry arriving in Gmail, owner/admin dates. All must work before sharing the short URL.
7. After the above tests, decide whether to set Pages variable `PUBLIC_ALIAS_READY=true` and redeploy to permit indexation. Only then update canonical/OG/schema URLs, sitemap, robots, Google Search Console, social links, and optionally redirect the old address after a later separate safe migration. The old host is **currently still embedded in public HTML/metadata and can still be discovered by technical inspection**, so the shorter URL is branding, **not a privacy or anonymity guarantee**.

Never enable Pages automatic deployment from the repository root's primary Worker settings, and never change the existing `wrangler.jsonc` deployment command to deploy `pages-alias`. The folder-based Pages integration is separate. Do not paste private Cloudflare secrets into Pages, GitHub, or chat.



## Optional booking → Google Calendar sync (not active by default)

The admin's **OZNAČI KOT ZASEDENO** button now supports an optional server-side
Google Apps Script calendar bridge. The private D1 booking is always committed
before calling Google. A failed/disabled Google sync **does not undo the booking**
and is shown in the admin panel; clicking BOOK again retries safely.

### Required activation (manual; do not share any secrets)

1. In [Google Apps Script](https://script.google.com), create a **separate**
   standalone project under Sašo's account. Paste
   `integrations/apps-script-calendar.gs` as its code. Set its project
   timezone to **Europe/Ljubljana**.
2. Create a new, independent 48+ character random token in a password manager.
   Put it in Apps Script **Script Properties** named
   `BOOKING_CALENDAR_BRIDGE_TOKEN`. Never use the admin key or salt.
3. Deploy a **Web app**, execute as **Me**, accessible to **Anyone**. The endpoint
   is guarded by the independent token (do not put it into the URL). Copy the
   deployment URL ending with `/exec`.
4. In the Cloudflare Worker, set encrypted Secrets
   `BOOKING_CALENDAR_BRIDGE_TOKEN` (same token) and
   `BOOKING_CALENDAR_APPS_SCRIPT_URL` (the /exec URL).
   Set `BOOKING_CALENDAR_SYNC_ENABLED` to `true` **only after** testing.
5. Back up D1; verify the four previously confirmed dates in both calendars:
   2026-11-14, 2026-12-05, 2026-12-19, 2027-01-16. The bridge checks for
   same-day DJ Arwenn events, including these manual entries, before creating.
   Never run a live test on an unconfirmed date.
6. With a *genuinely new confirmed booking*, use the existing admin button.
   Expect the admin panel to report D1 saved and calendar sync confirmed.
   Verify the event and Lara's guest invitation in Google Calendar. Use
   the original admin UI as fallback if the bridge is unavailable.

**Safety boundaries:** The bridge is off by default. Only admin-authorized
`book` actions trigger it; public enquiries do not. Existing same-day DJ
events remain untouched. Calendar deletion on `release` is deliberately
**manual** to avoid deleting other personal or manual events. The site admin
displays a reminder to check Google Calendar after release. A one-day
reservation is created as an all-day busy event because the exact start time
is unknown (usually after 16:00). The Google endpoint uses the owner's
Google Calendar OAuth authorization; it is not automatically authorized by
connecting Calendar in ChatGPT. The Google Apps Script endpoint itself must be
deployed manually, and this PR alone does NOT activate the integration.
