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
  type DomainRegistrationInput,
  type NewLinkInput,
} from "@/lib/schemas/portal";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

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
 * Creates or updates the Domain Registration behind a link token.
 *
 * The token arrives with the request, but `link_id` is derived from it here by
 * `resolveLink` — which re-checks expiry and revocation on every submit, not
 * just when the page was first opened. Nothing in the payload names a link, so
 * a tampered request cannot be pointed at another client's submission.
 *
 * All six fields are required: enforced by zod here, and by the
 * `domain_registration_fields_complete` CHECK constraint in the database, so a
 * partial write is impossible even if this action were bypassed.
 */
export async function submitDomainRegistration(
  token: string,
  input: DomainRegistrationInput,
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

    const parsed = domainRegistrationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Please check the form.",
      };
    }
    const v = parsed.data;

    const admin = createAdminClient();
    const { error } = await admin.from("domain_registrations").upsert(
      {
        link_id: link.id,
        business_name: v.business_name,
        full_name: v.full_name,
        email: v.email,
        phone_number: v.phone_number,
        address: v.address,
        id_number: v.id_number,
        // An edit re-opens the submission for review rather than keeping a
        // stale "reviewed" badge on changed details.
        status: "submitted" as const,
      },
      { onConflict: "link_id" },
    );
    if (error) throw error;

    revalidatePath("/admin/registrations");

    await notifyTeam(`Domain registration — ${link.client_name}`, [
      `Client: ${link.client_name}`,
      `Business: ${v.business_name}`,
      `Contact: ${v.full_name} <${v.email}> ${v.phone_number}`,
      "",
      "Open the admin panel to review.",
    ]);

    return { ok: true, message: "Saved." };
  } catch (err) {
    return fail(err, "Could not save your submission.");
  }
}

/**
 * Creates or updates the OPTIONAL SMS Lenz approval behind a link token.
 *
 * Every field may be blank — submitting an empty form is valid and simply
 * records that the client has been here. Files arrive as FormData and are
 * validated and stored server-side (see lib/uploads.ts); the bucket grants no
 * public write, so an anonymous visitor cannot upload except through here,
 * after the token has been checked.
 */
export async function submitSmsLenzApproval(
  token: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    if (typeof token !== "string") {
      return { ok: false, error: "This link is no longer valid." };
    }

    const link = await resolveLink(token);
    if (!link) return { ok: false, error: "This link is no longer valid." };

    if (!rateLimit(`smslenz:${link.id}`, 20, 60 * 60_000).allowed) {
      return { ok: false, error: "Too many updates. Try again shortly." };
    }

    const parsed = smsLenzApprovalSchema.safeParse({
      sender_id: formData.get("sender_id") ?? "",
      address: formData.get("address") ?? "",
    });
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Please check the form.",
      };
    }
    const v = parsed.data;

    const idCard = formData.get("id_card_photo");
    const logo = formData.get("logo");

    const [idCardUpload, logoUpload] = await Promise.all([
      uploadSmsLenzImage(idCard instanceof File ? idCard : null, "ID card photo"),
      uploadSmsLenzImage(logo instanceof File ? logo : null, "Logo"),
    ]);
    if (!idCardUpload.ok) return { ok: false, error: idCardUpload.error };
    if (!logoUpload.ok) return { ok: false, error: logoUpload.error };

    const admin = createAdminClient();

    // Keep a previously uploaded file when this submit did not replace it.
    const { data: existingRow } = await admin
      .from("sms_lenz_approvals")
      .select("id_card_photo_url, logo_url")
      .eq("link_id", link.id)
      .maybeSingle();
    const existing = existingRow as
      | { id_card_photo_url: string | null; logo_url: string | null }
      | null;

    const { error } = await admin.from("sms_lenz_approvals").upsert(
      {
        link_id: link.id,
        sender_id: v.sender_id ? v.sender_id : null,
        address: v.address ? v.address : null,
        id_card_photo_url:
          idCardUpload.url || existing?.id_card_photo_url || null,
        logo_url: logoUpload.url || existing?.logo_url || null,
        status: "submitted" as const,
      },
      { onConflict: "link_id" },
    );
    if (error) throw error;

    revalidatePath("/admin/registrations");

    await notifyTeam(`SMS Lenz approval — ${link.client_name}`, [
      `Client: ${link.client_name}`,
      `Sender ID: ${v.sender_id || "(not given)"}`,
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
