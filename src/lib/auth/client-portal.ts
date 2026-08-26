import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "./allowlist";
import type { DbClient } from "@/lib/portal";

/**
 * Single authorisation gate for every portal action.
 *
 * Returns the caller's own `clients` row, resolved from the validated session
 * — never from anything the browser sent. Every portal mutation derives its
 * `client_id` from this result, which is what makes IDOR structurally
 * impossible: there is no request field naming another client to tamper with.
 *
 * Uses `getUser()` (validates the JWT against the Auth server) rather than
 * `getSession()` (trusts the cookie as presented).
 *
 * An account on the admin allowlist is explicitly NOT a portal client. Staff
 * and client identities stay disjoint so a compromise of one does not silently
 * confer the other.
 */
export async function requireClient(): Promise<DbClient> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isAdminEmail(user.email)) {
    throw new Error("Not authorised.");
  }

  // Read through the user's own session, so RLS is exercised rather than
  // bypassed — the query can only ever return this user's row.
  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, auth_user_id, full_name, company_name, email, phone, created_at",
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    // Signed in but not provisioned as a client. Fail closed and stay vague:
    // the message reaches the browser and must not distinguish "no account"
    // from "not permitted".
    throw new Error("Not authorised.");
  }

  return data as DbClient;
}

/** Non-throwing variant for layouts/pages that redirect instead of erroring. */
export async function getCurrentClient(): Promise<DbClient | null> {
  try {
    return await requireClient();
  } catch {
    return null;
  }
}
