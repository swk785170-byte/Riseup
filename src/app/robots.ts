import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * Crawl directives. Without this, engines get no sitemap pointer and no
 * guidance on the private areas.
 *
 * /admin, /portal-era routes and /register are already noindex via headers;
 * disallowing them here also stops crawlers wasting budget on redirects, and
 * keeps secret registration links out of any crawl log.
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
