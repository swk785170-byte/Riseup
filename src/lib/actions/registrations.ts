"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { rateLimit } from "@/lib/rate-limit";
import { notifyTeam } from "@/lib/notify";
import { siteUrl } from "@/lib/site-url";
import { generateToken, hashToken } from "@/lib/tokens";
import { resolveLink } from "@/lib/registration-access";
import { uploadSmsLenzImage } from "@/lib/uploads";
import {
  domainRegistrationSchema,
  newLinkSchema,
  smsLenzApprovalSchema,
  statusSchema,
  type NewLinkInput,
} from "@/lib/schemas/portal";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string; field?: string };

/** Raw token is returned exactly once, at creation. */
export type CreateLinkResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Never surface a raw database error to the browser — they leak schema details
 * and constraint names. Log the real one, return something generic.
 */
function fail(err: unknown, fallback: string): { ok: false; error: string } {
  console.error("[registration action]", err);
  if (err instanceof Error && err.message === "Not authorised.") {
    return { ok: false, error: "Not authorised." };
  }
  return { ok: false, error: fallback };
}

/* ------------------------------------------------------------------ */
/*  Admin — mint and manage links                                      */
/* ------------------------------------------------------------------ */

/**
 * Mints a link and returns its URL.
 *
 * Only the SHA-256 hash is stored, so this URL cannot be recovered later — if
 * it is lost before being sent, revoke the link and mint a new one.
 */
export async function createRegistrationLink(
  input: NewLinkInput,
): Promise<CreateLinkResult> {
  try {
    await requireAdmin();

    const parsed = newLinkSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Please check the form.",
      };
    }
    const v = parsed.data;

    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + v.expires_in_days * 24 * 60 * 60 * 1000,
    ).toISOString();

    const admin = createAdminClient();
    const { error } = await admin.from("registration_links").insert({
      token_hash: hashToken(token),
      client_name: v.client_name,
      company_name: v.company_name ? v.company_name : null,
      client_email: v.client_email ? v.client_email : null,
      note: v.note ? v.note : null,
      expires_at: expiresAt,
    });
    if (error) throw error;

    revalidatePath("/admin/registrations");
    return { ok: true, url: `${siteUrl()}/register/${token}` };
  } catch (err) {
    return fail(err, "Could not create the link.");
  }
}

export async function revokeRegistrationLink(
  linkId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("registration_links")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", linkId)
      .is("revoked_at", null);
    if (error) throw error;

    revalidatePath("/admin/registrations");
    return { ok: true, message: "Link revoked." };
  } catch (err) {
    return fail(err, "Could not revoke the link.");
  }
}

/** Staff-only review decision on a submission. */
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

    revalidatePath("/admin/registrations");
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update the status.");
  }
}

/* ------------------------------------------------------------------ */
/*  Public — submit through a link                                     */
/* ------------------------------------------------------------------ */

/**
 * Saves BOTH client forms in one call.
 *
 * The two forms share a single submit button, so they must also share a single
 * write: the domain registration (all six fields required) and the optional
 * SMS Lenz approval are validated and persisted together. Submitting only what
 * one tab contains would silently drop whatever the client typed on the other.
 *
 * The token arrives with the request, but `link_id` is derived from it here by
 * `resolveLink` — which re-checks expiry and revocation on every submit, so a
 * page left open after a link is revoked cannot write.
 */
export async function submitClientForms(
  token: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (typeof token !== "string") {
      return { ok: false, error: "This link is no longer valid." };
    }

    const link = await resolveLink(token);
    if (!link) return { ok: false, error: "This link is no longer valid." };

    if (!rateLimit(`submit:${link.id}`, 20, 60 * 60_000).allowed) {
      return { ok: false, error: "Too many updates. Try again shortly." };
    }

    const text = (name: string): string => {
      const value = formData.get(name);
      return typeof value === "string" ? value : "";
    };

    // --- Domain registration: all six required ---
    const domain = domainRegistrationSchema.safeParse({
      business_name: text("business_name"),
      full_name: text("full_name"),
      email: text("email"),
      phone_number: text("phone_number"),
      address: text("address"),
      id_number: text("id_number"),
    });
    if (!domain.success) {
      const issue = domain.error.issues[0];
      return {
        ok: false,
        error: issue?.message ?? "Please check the form.",
        field: typeof issue?.path[0] === "string" ? issue.path[0] : undefined,
      };
    }

    // --- SMS Lenz: everything optional ---
    const sms = smsLenzApprovalSchema.safeParse({
      sender_id: text("sender_id"),
      address: text("sms_address"),
    });
    if (!sms.success) {
      return {
        ok: false,
        error: sms.error.issues[0]?.message ?? "Please check the form.",
      };
    }

    const file = (name: string): File | null => {
      const value = formData.get(name);
      return value instanceof File ? value : null;
    };

    const [front, back, logo] = await Promise.all([
      uploadSmsLenzImage(file("id_card_front"), "ID card (front)"),
      uploadSmsLenzImage(file("id_card_back"), "ID card (back)"),
      uploadSmsLenzImage(file("logo"), "Logo"),
    ]);
    if (!front.ok) return { ok: false, error: front.error };
    if (!back.ok) return { ok: false, error: back.error };
    if (!logo.ok) return { ok: false, error: logo.error };

    const admin = createAdminClient();
    const d = domain.data;

    const { error: domainError } = await admin.from("domain_registrations").upsert(
      {
        link_id: link.id,
        business_name: d.business_name,
        full_name: d.full_name,
        email: d.email,
        phone_number: d.phone_number,
        address: d.address,
        id_number: d.id_number,
        // An edit re-opens the submission for review rather than keeping a
        // stale "reviewed" badge on details that have since changed.
        status: "submitted" as const,
      },
      { onConflict: "link_id" },
    );
    if (domainError) throw domainError;

    /*
     * The SMS row is only written when the client actually gave something.
     * Upserting an all-null row would make an untouched optional form look
     * "submitted" to staff.
     */
    const smsData = sms.data;
    const hasSmsInput =
      Boolean(smsData.sender_id) ||
      Boolean(smsData.address) ||
      Boolean(front.url || back.url || logo.url);

    if (hasSmsInput) {
      // Keep files from an earlier submit that this one did not replace.
      const { data: existingRow } = await admin
        .from("sms_lenz_approvals")
        .select("id_card_front_url, id_card_back_url, logo_url")
        .eq("link_id", link.id)
        .maybeSingle();
      const existing = existingRow as {
        id_card_front_url: string | null;
        id_card_back_url: string | null;
        logo_url: string | null;
      } | null;

      const { error: smsError } = await admin.from("sms_lenz_approvals").upsert(
        {
          link_id: link.id,
          sender_id: smsData.sender_id ? smsData.sender_id : null,
          address: smsData.address ? smsData.address : null,
          id_card_front_url: front.url || existing?.id_card_front_url || null,
          id_card_back_url: back.url || existing?.id_card_back_url || null,
          logo_url: logo.url || existing?.logo_url || null,
          status: "submitted" as const,
        },
        { onConflict: "link_id" },
      );
      if (smsError) throw smsError;
    }

    revalidatePath("/admin/registrations");

    await notifyTeam(`Client submission — ${link.client_name}`, [
      `Client: ${link.client_name}`,
      `Business: ${d.business_name}`,
      `Contact: ${d.full_name} <${d.email}> ${d.phone_number}`,
      `SMS Lenz: ${hasSmsInput ? "included" : "not submitted"}`,
      "",
      "Open the admin panel to review.",
    ]);

    return { ok: true, message: "Saved." };
  } catch (err) {
    return fail(err, "Could not save your submission.");
  }
}

/** Staff-only review decision on an SMS Lenz submission. */
export async function setSmsLenzStatus(
  approvalId: string,
  status: unknown,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = statusSchema.safeParse({ status });
    if (!parsed.success) return { ok: false, error: "Unknown status." };

    const admin = createAdminClient();
    const { error } = await admin
      .from("sms_lenz_approvals")
      .update({ status: parsed.data.status })
      .eq("id", approvalId);
    if (error) throw error;

    revalidatePath("/admin/registrations");
    return { ok: true };
  } catch (err) {
    return fail(err, "Could not update the status.");
  }
}
