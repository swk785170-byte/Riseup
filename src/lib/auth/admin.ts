import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "./allowlist";

/**
 * Single authorisation gate for every privileged (service-role) mutation.
 *
 * Uses `getUser()` — which validates the JWT against the Auth server — rather
 * than `getSession()`, which would trust whatever cookie the client sent.
 *
 * Throws a deliberately vague error: the caller surfaces it to the browser, so
 * it must not reveal whether the account exists, is unconfirmed, or is simply
 * not on the allowlist.
 */
export async function requireAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Not authorised.");
  }
}
