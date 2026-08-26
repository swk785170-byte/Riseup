import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Secret-link tokens.
 *
 * The token is the only credential guarding a registration form, so it is
 * handled like a password: generated from a CSPRNG with 256 bits of entropy,
 * and stored only as a SHA-256 hash. A database dump therefore contains no
 * usable links.
 *
 * SHA-256 without a work factor is deliberate and safe *here* — unlike a
 * human-chosen password, a 256-bit random token has no dictionary to attack,
 * so the slow-hash defence buys nothing while costing a lookup on every open.
 */
const TOKEN_BYTES = 32;

/** URL-safe token. Shown to the admin once; never persisted in the clear. */
export function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/** Shape check before touching the database — cheap rejection of junk input. */
export function looksLikeToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{40,64}$/.test(value);
}

/**
 * Constant-time comparison of two hex digests. The lookup itself is by index,
 * but where a digest is compared in application code, compare it this way so
 * the code never depends on a short-circuiting `===`.
 */
export function digestsEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
