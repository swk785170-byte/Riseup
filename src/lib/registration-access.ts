import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { hashToken, looksLikeToken } from "@/lib/tokens";
import type { DbRegistrationLink } from "@/lib/registrations";

const LINK_COLS =
  "id, token_hash, client_name, company_name, client_email, note, expires_at, revoked_at, last_opened_at, created_at";

/**
 * Best-effort client IP, for rate limiting only.
 *
 * `x-forwarded-for` is attacker-controllable unless a trusted proxy overwrites
 * it, so this is a speed bump against casual scanning — never an identity or
 * an authorisation input.
 */
async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim().slice(0, 45);
  return h.get("x-real-ip")?.slice(0, 45) ?? "unknown";
}

/**
 * Resolves a URL token to its link row.
 *
 * Returns null for every failure mode — unknown, malformed, expired, revoked,
 * rate-limited — so a caller cannot tell a real-but-expired link from a token
 * that never existed. That is what stops the page becoming an oracle for
 * probing which tokens are real.
 *
 * A 256-bit token is not brute-forceable, but the per-IP limit still blunts
 * automated scanning and keeps the database out of a hot loop.
 */
export async function resolveLink(
  token: string,
): Promise<DbRegistrationLink | null> {
  if (!looksLikeToken(token)) return null;

  const ip = await clientIp();
  if (!rateLimit(`link:${ip}`, 60, 10 * 60_000).allowed) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("registration_links")
    .select(LINK_COLS)
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (error) {
    console.error("[registration] link lookup failed", error);
    return null;
  }
  if (!data) return null;

  const link = data as DbRegistrationLink;
  if (link.revoked_at) return null;
  if (new Date(link.expires_at).getTime() <= Date.now()) return null;

  return link;
}

/** Records that the client opened the link. Never blocks the page render. */
export async function touchLinkOpened(linkId: string): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin
      .from("registration_links")
      .update({ last_opened_at: new Date().toISOString() })
      .eq("id", linkId);
  } catch (err) {
    console.error("[registration] could not record link open", err);
  }
}
