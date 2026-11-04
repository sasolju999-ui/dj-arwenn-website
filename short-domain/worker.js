/**
 * DJ Arwenn - optional short public URL.
 *
 * Deploy as an INDEPENDENT Cloudflare Worker named "arwenn".
 * The existing "dj-arwenn-website" Worker remains unchanged and online.
 *
 * A Service Binding forwards the original Request directly to the working
 * DJ Arwenn service. No public HTTP redirect occurs, so the short host stays
 * in the visitor's address bar and API calls remain same-origin.
 *
 * No passwords, database binding, IP salt, or Turnstile secret are needed here:
 * all application logic runs in the existing, already configured Worker.
 */
export default {
  async fetch(request, env) {
    if (!env.DJ_ARWENN_ORIGIN || typeof env.DJ_ARWENN_ORIGIN.fetch !== "function") {
      return new Response("DJ Arwenn short address is not configured yet.", {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex"
        }
      });
    }
    return env.DJ_ARWENN_ORIGIN.fetch(request);
  }
};
