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
    // Serve public SEO resources on the canonical Pages host without
    // relying on the upstream service binding or a second Worker hop.
    // The same URLs are also listed in root sitemap.xml and robots.txt.
    const seoPath = new URL(request.url);
    if (seoPath.hostname === "djarwenn.pages.dev" &&
        (request.method === "GET" || request.method === "HEAD")) {
      const seoFiles = {
        "/sitemap.xml": {
          body: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <url><loc>https://djarwenn.pages.dev/</loc></url>\n  <url><loc>https://djarwenn.pages.dev/zasebnost.html</loc></url>\n</urlset>\n",
          type: "application/xml; charset=utf-8"
        },
        "/robots.txt": {
          body: "User-agent: *\nAllow: /\nSitemap: https://djarwenn.pages.dev/sitemap.xml\n",
          type: "text/plain; charset=utf-8"
        }
      };
      const seoAsset = seoFiles[seoPath.pathname];
      if (seoAsset) {
        return new Response(request.method === "HEAD" ? null : seoAsset.body, {
          status: 200,
          headers: {
            "Content-Type": seoAsset.type,
            "Cache-Control": "public, max-age=300",
            "X-Content-Type-Options": "nosniff"
          }
        });
      }
    }

    // Serve the exact Google Search Console proof on the canonical Pages
    // hostname. Advanced-mode Pages Workers otherwise forward this path
    // to the origin Worker, where the Pages-only file does not exist.
    const url = new URL(request.url);
    if (url.hostname === "djarwenn.pages.dev" &&
        url.pathname === "/googlefdb7c6d26ac3df0f.html" &&
        (request.method === "GET" || request.method === "HEAD")) {
      return new Response(request.method === "HEAD" ? null :
        "google-site-verification: googlefdb7c6d26ac3df0f.html\n", {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "X-Content-Type-Options": "nosniff"
        }
      });
    }
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

    // The primary Pages hostname has passed live form and Turnstile testing
    // and now has matching canonical URLs and sitemap. Allow indexing only
    // there; unique deployment and preview hostnames must remain noindex.
    if (new URL(request.url).hostname === "djarwenn.pages.dev") return response;
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
