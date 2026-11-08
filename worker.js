/**
 * DJ Arwenn – private, per-date availability check.
 *
 * D1 binding: DB, private secret: AVAILABILITY_HASH_SALT.
 * No list endpoint. Nothing is marked booked by a visitor's enquiry.
 * Missing configuration, unavailable DB, or rate limiting MUST NOT
 * be interpreted by the browser as an available date.
 */
const responseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const reply = (payload, status = 200) =>
  new Response(JSON.stringify(payload), { status, headers: responseHeaders });

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function currentDateInSlovenia() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric", month: "2-digit", day: "2-digit",
    timeZone: "Europe/Ljubljana",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return value.year + "-" + value.month + "-" + value.day;
}

async function hashIp(ip, secret) {
  const bytes = new TextEncoder().encode(secret + "\0" + ip);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

async function withinRateLimit(db, hashedIp) {
  const now = Math.floor(Date.now() / 1000);
  // Each hashed visitor may check six dates in ten minutes / fifteen per day.
  const windows = [
    { name: "ten-min", bucket: Math.floor(now / 600), ttl: 1200, max: 6 },
    { name: "day", bucket: Math.floor(now / 86400), ttl: 172800, max: 15 },
  ];
  for (const window of windows) {
    const key = window.name + ":" + window.bucket;
    const row = await db.prepare(
      "INSERT INTO availability_checks (visitor, bucket, hits, expires_at) " +
      "VALUES (?, ?, 1, ?) " +
      "ON CONFLICT(visitor, bucket) DO UPDATE SET hits=hits+1 " +
      "RETURNING hits"
    ).bind(hashedIp, key, now + window.ttl).first();
    if (!row || row.hits > window.max) return false;
  }
  // Opportunistic cleanup; never retain rate-limit counters forever.
  if (Math.random() < 0.02) {
    await db.prepare("DELETE FROM availability_checks WHERE expires_at < ?").bind(now).run();
  }
  return true;
}

async function checkAvailability(request, env) {
  if (request.method !== "POST") {
    return reply({ status: "unknown", message: "Use POST." }, 405);
  }
  // Avoid triggering an unconfigured API in a deployed front-end:
  // client must gracefully fall back to manual enquiry.
  if (!env.DB || !env.AVAILABILITY_HASH_SALT || env.AVAILABILITY_HASH_SALT.length < 24) {
    return reply({ status: "unknown", reason: "not_configured" }, 503);
  }
  const requestOrigin = request.headers.get("Origin");
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return reply({ status: "unknown" }, 403);
  }
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return reply({ status: "unknown", reason: "unsupported_media_type" }, 415);
  }
  if (Number(request.headers.get("Content-Length") || 0) > 512) {
    return reply({ status: "unknown", reason: "invalid_request" }, 413);
  }
  let data;
  try {
    data = await request.json();
  } catch (_) {
    return reply({ status: "unknown", reason: "invalid_json" }, 400);
  }
  const date = data && data.date;
  if (!validDate(date)) {
    return reply({ status: "unknown", reason: "invalid_date" }, 400);
  }
  const first = currentDateInSlovenia();
  const end = new Date(first + "T00:00:00Z");
  end.setUTCFullYear(end.getUTCFullYear() + 2);
  if (date < first || date > end.toISOString().slice(0, 10)) {
    return reply({ status: "unknown", reason: "date_out_of_range" }, 400);
  }
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return reply({ status: "unknown" }, 503);
  try {
    const hashedIp = await hashIp(ip, env.AVAILABILITY_HASH_SALT);
    if (!(await withinRateLimit(env.DB, hashedIp))) {
      return reply({ status: "unknown", reason: "rate_limited" }, 429);
    }
    const occupied = await env.DB.prepare(
      "SELECT date FROM booked_dates WHERE date = ? LIMIT 1"
    ).bind(date).first();
    return reply({ status: occupied ? "booked" : "enquiries_open" });
  } catch (error) {
    // Avoid exposing details of private infrastructure to visitors.
    console.error("Availability lookup failed:", error?.name || "unknown");
    return reply({ status: "unknown", reason: "unavailable" }, 503);
  }
}


/**
 * Private owner-only D1 date management.
 * Unavailable until DJ_ARWENN_ADMIN_TOKEN is configured as a Worker secret.
 * Never send this token in a URL, persist it in browser storage, or reuse the IP salt.
 */
async function sameHash(a, b) {
  const enc = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const lhs = new Uint8Array(left);
  const rhs = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < lhs.length; i++) difference |= lhs[i] ^ rhs[i];
  return difference === 0;
}

async function recordInvalidAdminAttempt(db, hashedIp) {
  const now = Math.floor(Date.now() / 1000);
  const bucket = "admin-fail:" + Math.floor(now / 600);
  const row = await db.prepare(
    "INSERT INTO availability_checks (visitor, bucket, hits, expires_at) " +
    "VALUES (?, ?, 1, ?) " +
    "ON CONFLICT(visitor, bucket) DO UPDATE SET hits=hits+1 RETURNING hits"
  ).bind(hashedIp, bucket, now + 1200).first();
  return Boolean(row && row.hits > 10);
}


/**
 * Optional, server-to-server sync to Google Apps Script.
 * A booking is committed in D1 first. Calendar failure is reported separately,
 * never interpreted as a failed booking. Disabled unless explicitly configured.
 */
async function syncBookingCalendar(date, env) {
  if (env.BOOKING_CALENDAR_SYNC_ENABLED !== "true") return "disabled";
  if (typeof env.BOOKING_CALENDAR_BRIDGE_TOKEN !== "string" ||
      env.BOOKING_CALENDAR_BRIDGE_TOKEN.length < 32 ||
      typeof env.BOOKING_CALENDAR_APPS_SCRIPT_URL !== "string" ||
      !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(env.BOOKING_CALENDAR_APPS_SCRIPT_URL)) {
    return "not_configured";
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(env.BOOKING_CALENDAR_APPS_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: env.BOOKING_CALENDAR_BRIDGE_TOKEN,
        action: "book",
        date
      }),
      signal: controller.signal
    });
    const result = response.ok ? await response.json().catch(() => null) : null;
    return result && result.ok === true ? "ok" : "pending";
  } catch (_) {
    return "pending";
  } finally {
    clearTimeout(timer);
  }
}

async function managePrivateDates(request, env) {
  if (request.method !== "POST") return reply({ error: "method_not_allowed" }, 405);
  if (!env.DB || typeof env.DJ_ARWENN_ADMIN_TOKEN !== "string" ||
      env.DJ_ARWENN_ADMIN_TOKEN.length < 32 ||
      !env.AVAILABILITY_HASH_SALT || env.AVAILABILITY_HASH_SALT.length < 24) {
    return reply({ error: "admin_not_configured" }, 503);
  }
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return reply({ error: "forbidden" }, 403);
  const site = request.headers.get("Sec-Fetch-Site");
  if (site && site !== "same-origin" && site !== "none") {
    return reply({ error: "forbidden" }, 403);
  }
  if (!(request.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json")) {
    return reply({ error: "invalid_content_type" }, 415);
  }
  if (Number(request.headers.get("Content-Length") || 0) > 1024) {
    return reply({ error: "invalid_body" }, 413);
  }

  const tokenHeader = request.headers.get("Authorization") || "";
  const token = tokenHeader.startsWith("Bearer ") ? tokenHeader.slice(7) : "";
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return reply({ error: "unauthorized" }, 401);
  try {
    if (token.length < 32 || token.length > 256 ||
        !(await sameHash(token, env.DJ_ARWENN_ADMIN_TOKEN))) {
      const fingerprint = await hashIp(ip, env.AVAILABILITY_HASH_SALT);
      const blocked = await recordInvalidAdminAttempt(env.DB, fingerprint);
      return reply({ error: blocked ? "rate_limited" : "unauthorized" }, blocked ? 429 : 401);
    }

    // All admin requests are POST + authenticated. No unauthenticated list endpoint.
    const raw = await request.text();
    if (raw.length > 1024) return reply({ error: "invalid_body" }, 413);
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (_) {
      return reply({ error: "invalid_json" }, 400);
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return reply({ error: "invalid_request" }, 400);
    }
    if (payload.action === "calendar_diagnostics") {
      // Admin-authenticated, read-only checks. Never return secret values,
      // complete URLs, token lengths, or masked excerpts.
      const secret = env.BOOKING_CALENDAR_BRIDGE_TOKEN;
      const scriptUrl = env.BOOKING_CALENDAR_APPS_SCRIPT_URL;
      return reply({
        status: "ok",
        calendar: {
          enabled: env.BOOKING_CALENDAR_SYNC_ENABLED === "true",
          token_present: typeof secret === "string" && secret.length > 0,
          token_format_valid: typeof secret === "string" && secret.length >= 32,
          url_present: typeof scriptUrl === "string" && scriptUrl.length > 0,
          url_format_valid: typeof scriptUrl === "string" &&
            /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(scriptUrl)
        }
      });
    }

    const today = currentDateInSlovenia();
    const end = new Date(today + "T00:00:00Z");
    end.setUTCFullYear(end.getUTCFullYear() + 2);
    const last = end.toISOString().slice(0, 10);

    if (payload.action === "export") {
      // A private, read-only snapshot of the date-only booking table.
      // Include historical dates so a downloaded backup is complete.
      // Fail closed rather than silently exporting a truncated list.
      const records = await env.DB.prepare(
        "SELECT date FROM booked_dates ORDER BY date LIMIT 5001"
      ).all();
      if (!records.success || !Array.isArray(records.results)) {
        throw new Error("D1 export unavailable");
      }
      if (records.results.length > 5000) {
        return reply({ error: "export_too_large" }, 413);
      }
      return reply({
        status: "ok",
        format: "dj-arwenn-booked-dates-v1",
        exportedAt: new Date().toISOString(),
        dates: records.results.map(row => row.date),
        count: records.results.length
      });
    }

    if (payload.action === "list") {
      const records = await env.DB.prepare(
        "SELECT date FROM booked_dates WHERE date >= ? AND date <= ? ORDER BY date LIMIT 800"
      ).bind(today, last).all();
      return reply({ status: "ok", dates: records.results.map(row => row.date), first: today, last });
    }

    if (payload.action !== "book" && payload.action !== "release") {
      return reply({ error: "invalid_action" }, 400);
    }
    const date = payload.date;
    if (!validDate(date) || date < today || date > last) {
      return reply({ error: "invalid_date" }, 400);
    }
    const query = payload.action === "book"
      ? "INSERT OR IGNORE INTO booked_dates (date) VALUES (?)"
      : "DELETE FROM booked_dates WHERE date = ?";
    const update = await env.DB.prepare(query).bind(date).run();
    if (!update.success) throw new Error("D1 update was unsuccessful");
    // Only an explicitly approved booking is eligible for automatic creation.
    // Re-booking an existing date safely retries pending calendar sync.
    // Releasing dates never deletes calendar entries without human review.
    const calendarSync = payload.action === "book"
      ? await syncBookingCalendar(date, env)
      : "manual_review";
    return reply({ status: "ok", date, action: payload.action, calendar_sync: calendarSync });
  } catch (error) {
    console.error("Private date management failed:", error?.name || "unknown");
    return reply({ error: "unavailable" }, 503);
  }
}


/**
 * Optional Turnstile -> Gmail bridge. Disabled unless every setting is present
 * and ENQUIRY_TURNSTILE_ENABLED is explicitly "true".
 * The original Web3Forms/hCaptcha form stays available until activation.
 */
function enquiryBridgeMissing(env) {
  // Diagnostic labels only; NEVER return env values, passwords or secret material.
  const missing = [];
  if (env.ENQUIRY_TURNSTILE_ENABLED !== "true") missing.push("ENQUIRY_TURNSTILE_ENABLED");
  if (typeof env.TURNSTILE_SITE_KEY !== "string" || env.TURNSTILE_SITE_KEY.length < 20) {
    missing.push("TURNSTILE_SITE_KEY");
  }
  if (typeof env.TURNSTILE_SECRET_KEY !== "string" || env.TURNSTILE_SECRET_KEY.length < 20) {
    missing.push("TURNSTILE_SECRET_KEY");
  }
  if (typeof env.ENQUIRY_BRIDGE_TOKEN !== "string" || env.ENQUIRY_BRIDGE_TOKEN.length < 32) {
    missing.push("ENQUIRY_BRIDGE_TOKEN");
  }
  if (typeof env.ENQUIRY_APPS_SCRIPT_URL !== "string" ||
      !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(env.ENQUIRY_APPS_SCRIPT_URL)) {
    missing.push("ENQUIRY_APPS_SCRIPT_URL");
  }
  if (!env.DB) missing.push("DB");
  if (typeof env.AVAILABILITY_HASH_SALT !== "string" ||
      env.AVAILABILITY_HASH_SALT.length < 24) missing.push("AVAILABILITY_HASH_SALT");
  return missing;
}

function enquiryBridgeReady(env) {
  return enquiryBridgeMissing(env).length === 0;
}

function enquiryConfig(request, env) {
  if (request.method !== "GET") return reply({ error: "method_not_allowed" }, 405);
  const active = enquiryBridgeReady(env);
  const payload = active
    ? { mode: "turnstile", sitekey: env.TURNSTILE_SITE_KEY }
    : { mode: "hcaptcha" };
  return reply(payload);
}

function safeField(input, limit) {
  return typeof input === "string" && input.length <= limit ? input.trim() : null;
}

async function withinEnquiryLimit(db, fingerprint) {
  const now = Math.floor(Date.now() / 1000);
  const windows = [
    { bucket: "enquiry-hour:" + Math.floor(now / 3600), max: 5, ttl: 7200 },
    { bucket: "enquiry-day:" + Math.floor(now / 86400), max: 12, ttl: 172800 }
  ];
  for (const period of windows) {
    const row = await db.prepare(
      "INSERT INTO availability_checks (visitor, bucket, hits, expires_at) " +
      "VALUES (?, ?, 1, ?) " +
      "ON CONFLICT(visitor, bucket) DO UPDATE SET hits=hits+1 RETURNING hits"
    ).bind(fingerprint, period.bucket, now + period.ttl).first();
    if (!row || row.hits > period.max) return false;
  }
  return true;
}

async function sendTurnstileEnquiry(request, env) {
  if (request.method !== "POST") return reply({ error: "method_not_allowed" }, 405);
  if (!enquiryBridgeReady(env)) return reply({ error: "not_configured" }, 503);

  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return reply({ error: "forbidden" }, 403);
  const site = request.headers.get("Sec-Fetch-Site");
  if (site && site !== "same-origin" && site !== "none") return reply({ error: "forbidden" }, 403);
  if (!(request.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json")) {
    return reply({ error: "invalid_content_type" }, 415);
  }
  if (Number(request.headers.get("Content-Length") || 0) > 12000) {
    return reply({ error: "payload_too_large" }, 413);
  }

  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip) return reply({ error: "temporarily_unavailable" }, 503);
  let payload;
  try {
    const raw = await request.text();
    if (raw.length > 9000) return reply({ error: "payload_too_large" }, 413);
    payload = JSON.parse(raw);
  } catch (_) {
    return reply({ error: "invalid_json" }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return reply({ error: "invalid_body" }, 400);
  }

  // Do not pass arbitrary user-supplied properties, headers or HTML to the mailer.
  if (payload.botcheck) return reply({ success: true });
  const name = safeField(payload.name, 100);
  const email = safeField(payload.email, 150);
  const phone = safeField(payload.phone ?? "", 40);
  const eventType = safeField(payload.eventType, 100);
  const eventDate = safeField(payload.eventDate, 10);
  const location = safeField(payload.location, 80);
  const notes = safeField(payload.notes ?? "", 1500);
  const token = safeField(payload.turnstileToken, 2048);
  const emailValid = email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email);
  const valid = name && name.length >= 2 && emailValid && phone !== null &&
    eventType && eventType.length >= 2 && eventDate && validDate(eventDate) &&
    location && location.length >= 2 && notes !== null && token &&
    token.length >= 10 && payload.consent === true;
  if (!valid) return reply({ error: "invalid_fields" }, 400);

  const first = currentDateInSlovenia();
  const end = new Date(first + "T00:00:00Z");
  end.setUTCFullYear(end.getUTCFullYear() + 2);
  if (eventDate < first || eventDate > end.toISOString().slice(0, 10)) {
    return reply({ error: "invalid_date" }, 400);
  }
  try {
    const fingerprint = await hashIp(ip, env.AVAILABILITY_HASH_SALT);
    if (!(await withinEnquiryLimit(env.DB, fingerprint))) {
      return reply({ error: "rate_limited" }, 429);
    }
    const booked = await env.DB.prepare(
      "SELECT date FROM booked_dates WHERE date = ? LIMIT 1"
    ).bind(eventDate).first();
    if (booked) return reply({ error: "booked" }, 409);

    const verificationAbort = new AbortController();
    const verificationTimer = setTimeout(() => verificationAbort.abort(), 8000);
    let verification;
    try {
      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
        signal: verificationAbort.signal
      });
      verification = response.ok ? await response.json() : null;
    } finally {
      clearTimeout(verificationTimer);
    }
    if (!verification || verification.success !== true ||
        verification.hostname !== url.hostname || verification.action !== "dj_enquiry") {
      return reply({ error: "verification_required" }, 403);
    }

    // Apps Script sends a message from the owner's Google account to their inbox.
    // Its endpoint and shared secret are never exposed to the browser.
    const mailAbort = new AbortController();
    const mailTimer = setTimeout(() => mailAbort.abort(), 14000);
    let mailResult;
    try {
      const mailResponse = await fetch(env.ENQUIRY_APPS_SCRIPT_URL, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bridgeToken: env.ENQUIRY_BRIDGE_TOKEN,
          name, email, phone, eventType, eventDate, location, notes
        }),
        signal: mailAbort.signal
      });
      mailResult = mailResponse.ok ? await mailResponse.json().catch(() => null) : null;
    } finally {
      clearTimeout(mailTimer);
    }
    if (!mailResult || mailResult.ok !== true) return reply({ error: "delivery_unconfirmed" }, 502);
    return reply({ success: true });
  } catch (error) {
    // No personal details, keys or captcha tokens in Worker logs.
    console.error("Turnstile enquiry handler failed:", error?.name || "unknown");
    return reply({ error: "delivery_unconfirmed" }, 503);
  }
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === "/api/availability") return checkAvailability(request, env);
    if (path === "/api/enquiry/config") return enquiryConfig(request, env);
    if (path === "/api/enquiry") return sendTurnstileEnquiry(request, env);
    if (path === "/api/admin/dates") return managePrivateDates(request, env);
    if (path.startsWith("/api/")) return reply({ status: "unknown" }, 404);
    if (path === "/admin.html" || path === "/admin") {
      const assetResponse = await env.ASSETS.fetch(request);
      const headers = new Headers(assetResponse.headers);
      headers.set("Cache-Control", "private, no-store, max-age=0");
      headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      headers.set("X-Frame-Options", "DENY");
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "no-referrer");
      headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
      headers.set("Content-Security-Policy", "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
      return new Response(assetResponse.body, { status: assetResponse.status, statusText: assetResponse.statusText, headers });
    }
    return env.ASSETS.fetch(request);
  },
};
