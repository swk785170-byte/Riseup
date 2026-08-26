"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { isAdminEmail } from "@/lib/auth/allowlist";
import { portalCallbackUrl } from "@/lib/site-url";
import {
  messageSchema,
  newClientSchema,
  statusSchema,
  type NewClientInput,
} from "@/lib/schemas/portal";

export type ActionResult =
  | { ok: true; id?: string; message?: string }
  | { ok: false; error: string };

function fail(err: unknown, fallback: string): ActionResult {
  console.error("[admin clients action]", err);
  if (err instanceof Error && err.message === "Not authorised.") {
    return { ok: false, error: "Not authorised." };
  }
  return { ok: false, error: fallback };
}

/**
 * Provisions a client account and emails them an invite link.
 *
 * This is the ONLY way a portal account comes into existence — there is no
 * public sign-up path, matching how admin accounts are handled.
 */
export async function createClientAccount(
  input: NewClientInput,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = newClientSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Please check the form.",
      };
    }
    const v = parsed.data;

    // Staff and client identities must stay disjoint: a portal account for an
    // admin address would give that session both roles at once.
    if (isAdminEmail(v.email)) {
      return {
        ok: false,
        error: "That address is a staff account and cannot be a portal client.",
      };
    }

    const admin = createAdminClient();

    const { data: invited, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(v.email, {
        redirectTo: portalCallbackUrl(),
      });

    if (inviteError || !invited?.user) {
      // Most common cause is an account that already exists for this address.
      console.error("[admin clients] invite failed", inviteError);
      return {
        ok: false,
        error:
          "Could not send the invite. If this address already has an account, remove it in Supabase first.",
      };
    }

    const { data, error } = await admin
      .from("clients")
      .insert({
        auth_user_id: invited.user.id,
        full_name: v.full_name,
        company_name: v.company_name ? v.company_name : null,
        email: v.email,
        phone: v.phone ? v.phone : null,
      })
      .select("id")
      .single();

    if (error) {
      // Roll back the auth user so a failed insert doesn't strand an orphan
      // account that could later sign in with no client row.
      await admin.auth.admin.deleteUser(invited.user.id).catch(() => {});
      throw error;
    }

    revalidatePath("/admin/clients");
    const row = data as { id: string } | null;
    return { ok: true, id: row?.id, message: "Invite sent." };
  } catch (err) {
    return fail(err, "Could not create the client.");
  }
}

/** Staff-only decision on a submission's review state. */
export async function setRegistrationStatus(
  registrationId: string,
  status: unknown,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = statusSchema.safeParse({ status });
    if (!parsed.success) return { ok: false, error: "Unknown status." };

    const admin = createAdminClient();
    const { error } = await admin
      .from("domain_registrations")
      .update({ status: parsed.data.status })
      .eq("id", registrationId);
    if (error) throw error;

    revalidatePath("/admin/clients");
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update the status.");
  }
}

export async function sendAdminMessage(
  clientId: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = messageSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Message could not be sent.",
      };
    }

    const admin = createAdminClient();
    // `sender` is fixed server-side, exactly as on the client path.
    const { error } = await admin.from("messages").insert({
      client_id: clientId,
      sender: "admin",
      body: parsed.data.body,
    });
    if (error) throw error;

    revalidatePath("/admin/clients");
    revalidatePath("/admin/messages");
    return { ok: true };
  } catch (err) {
    return fail(err, "Message could not be sent.");
  }
}

/** Marks a client's messages read from the staff side. */
export async function markClientThreadRead(
  clientId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("client_id", clientId)
      .eq("sender", "client")
      .is("read_at", null);
    if (error) throw error;
    revalidatePath("/admin/messages");
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update the thread.");
  }
}
