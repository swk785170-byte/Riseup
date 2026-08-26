"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { rateLimit } from "@/lib/rate-limit";
import { notifyTeam } from "@/lib/notify";
import { siteUrl } from "@/lib/site-url";
import { generateToken, hashToken } from "@/lib/tokens";
import { resolveLink } from "@/lib/registration-access";
import {
  domainRegistrationSchema,
  newLinkSchema,
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
 * Creates or updates the submission behind a link token.
 *
 * The token arrives with the request, but `link_id` is derived from it here by
 * `resolveLink` — which re-checks expiry and revocation on every submit, not
 * just when the page was first opened. Nothing in the payload names a link, so
 * a tampered request cannot be pointed at another client's submission.
 *
 * `status` is likewise not accepted from the client: an edit always lands back
 * at "submitted" so a changed answer cannot keep a stale "reviewed" badge.
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
    if (!link) {
      return { ok: false, error: "This link is no longer valid." };
    }

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

    // When the client IS the owner, third-party fields are cleared rather than
    // left behind from a previous answer — stale personal data should not sit
    // in the record after it stops being relevant.
    const row = {
      link_id: link.id,
      domain_name: v.domain_name.toLowerCase(),
      is_owner: v.is_owner,
      owner_name: v.is_owner ? null : (v.owner_name || null),
      owner_nic_or_passport: v.is_owner ? null : (v.owner_nic_or_passport || null),
      owner_email: v.is_owner ? null : (v.owner_email || null),
      owner_contact_number: v.is_owner ? null : (v.owner_contact_number || null),
      status: "submitted" as const,
    };

    const admin = createAdminClient();
    const { error } = await admin
      .from("domain_registrations")
      .upsert(row, { onConflict: "link_id" });
    if (error) throw error;

    revalidatePath("/admin/registrations");

    await notifyTeam(`Domain submission — ${link.client_name}`, [
      `Client: ${link.client_name}${link.company_name ? ` (${link.company_name})` : ""}`,
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
