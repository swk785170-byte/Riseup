import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * Crawl directives. Without this, engines get no sitemap pointer and no
 * guidance on the private areas.
 *
 * /admin and /register already send `X-Robots-Tag: noindex`; disallowing them
 * here as well stops crawlers spending budget on pages that will never be
 * indexed, and keeps secret registration tokens out of any crawl log.
 *
 * `host` and `sitemap` are built from NEXT_PUBLIC_SITE_URL, so they always
 * name the host that actually serves 200s (www.riseup.lk) rather than the one
 * that redirects to it.
 *
 * Note there is no rule for AI crawlers (GPTBot, PerplexityBot, ClaudeBot,
 * Google-Extended). `User-Agent: *` therefore allows them, which is what the
 * site's GEO work assumes — being crawlable is how a page gets cited in AI
 * search results. Add per-agent rules here to opt out of model training.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/register/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
