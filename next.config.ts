import type { NextConfig } from "next";

/**
 * Supabase Storage host, derived from the env var so the config follows the
 * project. Used both to allow `next/image` remote loads and to scope the CSP.
 */
const supabaseHostname = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const isProd = process.env.NODE_ENV === "production";
const supabaseOrigin = supabaseHostname ? `https://${supabaseHostname}` : "";
const supabaseSocket = supabaseHostname ? `wss://${supabaseHostname}` : "";

/**
 * Content Security Policy.
 *
 * NOTE ON script-src 'unsafe-inline': Next.js App Router streams RSC payloads
 * through inline <script> tags. Eliminating 'unsafe-inline' requires per-request
 * nonces, which are incompatible with the statically prerendered pages this site
 * relies on (a cached page would carry a stale nonce and its scripts would be
 * blocked). The rest of the policy is locked down instead — no remote script
 * origins, object-src 'none', base-uri 'self', form-action 'self' — so injected
 * markup cannot load external code or hijack form targets. Moving to a nonce
 * policy would mean rendering every page dynamically.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  // Tailwind/framer-motion write inline styles; Fontshare serves the stylesheet.
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
  "font-src 'self' https://cdn.fontshare.com data:",
  `img-src 'self' data: blob: ${supabaseOrigin}`.trim(),
  "media-src 'self'",
  `connect-src 'self' ${supabaseOrigin} ${supabaseSocket}`.trim(),
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Only meaningful over HTTPS; omitted in dev so localhost isn't pinned.
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // A stray lockfile exists in the user directory above this project;
  // pin the workspace root so Turbopack doesn't infer the wrong one.
  turbopack: {
    root: __dirname,
  },
  // Don't advertise the framework/version to attackers.
  poweredByHeader: false,
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Admin pages are per-user and must never sit in a shared/browser cache.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        // Link-gated registration pages carry one client's private data and are
        // keyed on a secret in the URL — never cache, never index.
        source: "/register/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
