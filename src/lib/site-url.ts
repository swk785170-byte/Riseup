import "server-only";

/**
 * Absolute URL for the magic-link callback.
 *
 * Built from a server-side env var, NEVER from a request header or a user
 * supplied value. A redirect target taken from input is the classic open
 * redirect, and here it would also be an account-takeover vector: the sign-in
 * code would be delivered to whatever host the attacker named.
 */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set in production so magic links point at the real site.",
    );
  }
  return raw.replace(/\/+$/, "");
}

export function portalCallbackUrl(): string {
  return `${siteUrl()}/portal/auth/callback`;
}
