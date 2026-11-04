/**
 * Optional free, short Cloudflare Pages alias for DJ Arwenn.
 *
 * Publish this folder as a separate Pages project, if the project name
 * "djarwenn" is available. In Pages Settings > Bindings add a Service
 * Binding named DJ_ARWENN_ORIGIN pointing to the existing
 * dj-arwenn-website Worker in the SAME Cloudflare account.
 *
 * No redirects, private secrets, second D1 database or duplicate booking
 * logic. Keep the old Worker alive until end-to-end testing is complete.
 */
export default {
  async fetch(request, env) {
    if (!env.DJ_ARWENN_ORIGIN || typeof env.DJ_ARWENN_ORIGIN.fetch !== "function") {
      return new Response("DJ Arwenn short website is not connected yet.", {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow"
        }
      });
    }

    // Forward the original request URL, preserving the public Pages hostname.
    // Public API calls remain same-origin in the browser.
    const response = await env.DJ_ARWENN_ORIGIN.fetch(request);

    // Avoid duplicate Google indexing before all paths, Turnstile and Gmail
    // have been tested and the canonical URLs have been updated.
    if (env.PUBLIC_ALIAS_READY === "true") return response;
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    headers.set("Cache-Control", "no-store");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
