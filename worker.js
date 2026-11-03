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

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === "/api/availability") return checkAvailability(request, env);
    if (path.startsWith("/api/")) return reply({ status: "unknown" }, 404);
    return env.ASSETS.fetch(request);
  },
};
