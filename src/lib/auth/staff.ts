import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "./allowlist";

/**
 * Mirrors the ADMIN_EMAILS allowlist into the `staff` table.
 *
 * Postgres cannot read env vars, so RLS needs its own notion of "admin" — that
 * is what `public.is_staff()` checks, and it is what lets an admin's *browser*
 * Realtime socket receive message events (those run under the anon key with
 * the admin's session, so RLS applies).
 *
 * Only ever called after the allowlist check has passed, and it re-checks
 * before writing, so being signed in is never enough to become staff.
 */
export async function ensureStaffRecord(): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email || !isAdminEmail(user.email)) return;

    const admin = createAdminClient();
    await admin
      .from("staff")
      .upsert(
        { auth_user_id: user.id, email: user.email.toLowerCase() },
        { onConflict: "auth_user_id" },
      );
  } catch (err) {
    // Never block the admin panel on this — it only affects live updates.
    console.error("[staff] could not sync staff record", err);
  }
}
