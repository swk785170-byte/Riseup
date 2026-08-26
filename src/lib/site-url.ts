import "server-only";

/**
 * Canonical origin for this deployment.
 *
 * Built from an env var, NEVER from a request header — a Host header is
 * attacker-controllable, and using it here would poison canonical tags, the
 * sitemap and the registration links we email to clients.
 */
const FALLBACK_ORIGIN = "http://localhost:3000";

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    // Read at build time for metadataBase, canonicals, robots.txt and the
    // sitemap, so throwing here would break the build outright. Warn loudly
    // instead — a wrong canonical domain is bad, but a site that will not
    // build is worse.
    console.error(
      "[site-url] NEXT_PUBLIC_SITE_URL is not set — canonical URLs, the sitemap and registration links will point at localhost. Set it before deploying.",
    );
  }
  return FALLBACK_ORIGIN;
}

export function portalCallbackUrl(): string {
  return `${siteUrl()}/portal/auth/callback`;
}
