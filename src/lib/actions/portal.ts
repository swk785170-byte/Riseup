"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireClient } from "@/lib/auth/client-portal";
import { rateLimit } from "@/lib/rate-limit";
import { notifyTeam } from "@/lib/notify";
import { portalCallbackUrl } from "@/lib/site-url";
import {
  domainRegistrationSchema,
  magicLinkSchema,
  messageSchema,
  type DomainRegistrationInput,
} from "@/lib/schemas/portal";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

/**
 * Never surface a raw database/driver error to the browser — they leak schema
 * details and constraint names. Log the real one, return something generic.
 */
function fail(err: unknown, fallback: string): ActionResult {
  console.error("[portal action]", err);
  if (err instanceof Error && err.message === "Not authorised.") {
    return { ok: false, error: "Not authorised." };
  }
  return { ok: false, error: fallback };
}

/* ------------------------------------------------------------------ */
/*  Magic-link sign-in                                                 */
/* ------------------------------------------------------------------ */

/**
 * Requests a sign-in link.
 *
 * `shouldCreateUser: false` is the control that keeps the portal invite-only —
 * without it, submitting any address to this endpoint would provision an
 * account, which is exactly the public self-registration the brief forbids.
 *
 * The response is identical whether or not the address belongs to a client, so
 * this cannot be used to enumerate who has a portal account.
 */
export async function requestMagicLink(
  input: unknown,
): Promise<ActionResult> {
  const SAME = {
    ok: true as const,
    message: "If that address has a portal account, a sign-in link is on its way.",
  };

  try {
    const parsed = magicLinkSchema.safeParse(input);
    // Even a malformed address gets the neutral answer.
    if (!parsed.success) return SAME;
    const { email } = parsed.data;

    // Blunt the obvious abuse: mail-bombing one address, and walking a list.
    const limit = rateLimit(`magic:${email}`, 3, 15 * 60_000);
    if (!limit.allowed) return SAME;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: portalCallbackUrl(),
      },
    });
    // Errors are logged, never reflected — "user not found" must not be
    // distinguishable from success.
    if (error) console.warn("[portal] magic link:", error.message);

    return SAME;
  } catch (err) {
    console.error("[portal action] magic link", err);
    return SAME;
  }
}

export async function signOutClient(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

/* ------------------------------------------------------------------ */
/*  Domain registration                                                */
/* ------------------------------------------------------------------ */

/**
 * Creates or updates the caller's single submission.
 *
 * `client_id` comes from the session, never from `input` — there is no field
 * in the payload that names another client, so this cannot be redirected at
 * someone else's row. `status` is likewise not accepted from the client; the
 * database trigger resets it on edit.
 */
export async function saveDomainRegistration(
  input: DomainRegistrationInput,
): Promise<ActionResult> {
  try {
    const client = await requireClient();

    const limit = rateLimit(`domain:${client.id}`, 20, 60 * 60_000);
    if (!limit.allowed) {
      return { ok: false, error: "Too many updates. Try again shortly." };
    }

    const parsed = domainRegistrationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Please check the form.",
      };
    }
    const v = parsed.data;

    // When the client IS the owner, the third-party fields are cleared rather
    // than left behind from a previous answer — stale PII should not linger.
    const row = {
      client_id: client.id,
      domain_name: v.domain_name.toLowerCase(),
      is_owner: v.is_owner,
      owner_name: v.is_owner ? null : (v.owner_name ?? null) || null,
      owner_nic_or_passport: v.is_owner
        ? null
        : (v.owner_nic_or_passport ?? null) || null,
      owner_email: v.is_owner ? null : (v.owner_email ?? null) || null,
      owner_contact_number: v.is_owner
        ? null
        : (v.owner_contact_number ?? null) || null,
    };

    // Writes through the user's session, so RLS re-checks ownership even
    // though we already resolved it above (defence in depth).
    const supabase = await createClient();
    const { error } = await supabase
      .from("domain_registrations")
      .upsert(row, { onConflict: "client_id" });
    if (error) throw error;

    revalidatePath("/portal/domain-registration");
    revalidatePath("/portal/dashboard");

    await notifyTeam(`Domain submission — ${client.full_name}`, [
      `Client: ${client.full_name}${client.company_name ? ` (${client.company_name})` : ""}`,
      `Domain: ${row.domain_name}`,
      `Client is the owner: ${row.is_owner ? "yes" : "no"}`,
      "",
      "Open the admin panel to review.",
    ]);

    return { ok: true, message: "Saved." };
  } catch (err) {
    return fail(err, "Could not save your submission.");
  }
}

/* ------------------------------------------------------------------ */
/*  Messaging                                                          */
/* ------------------------------------------------------------------ */

export async function sendClientMessage(input: unknown): Promise<ActionResult> {
  try {
    const client = await requireClient();

    const limit = rateLimit(`msg:${client.id}`, 30, 5 * 60_000);
    if (!limit.allowed) {
      return { ok: false, error: "You're sending messages too quickly." };
    }

    const parsed = messageSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Message could not be sent.",
      };
    }

    const supabase = await createClient();
    // `sender` is hard-coded, and the RLS INSERT policy independently requires
    // it to be 'client' — a forged admin reply is rejected at both layers.
    const { error } = await supabase.from("messages").insert({
      client_id: client.id,
      sender: "client",
      body: parsed.data.body,
    });
    if (error) throw error;

    revalidatePath("/portal/messages");

    await notifyTeam(`New portal message — ${client.full_name}`, [
      `From: ${client.full_name} <${client.email}>`,
      "",
      parsed.data.body.slice(0, 500),
    ]);

    return { ok: true };
  } catch (err) {
    return fail(err, "Message could not be sent.");
  }
}

/** Stamps admin replies as read so the staff inbox count stays honest. */
export async function markThreadRead(): Promise<ActionResult> {
  try {
    const client = await requireClient();
    const supabase = await createClient();
    const { error } = await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("client_id", client.id)
      .eq("sender", "admin")
      .is("read_at", null);
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update the thread.");
  }
}
