"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { inquiryFormSchema, type InquiryFormValues } from "@/lib/schemas/inquiry";

export type ActionResult = { ok: true } | { ok: false; error: string };

function logAndGenericise(err: unknown, fallback: string): string {
  console.error("[inquiries]", err);
  if (err instanceof Error && err.message === "Not authorised.") {
    return "Not authorised.";
  }
  return fallback;
}

/* ------------------------------------------------------------------ */
/*  Public — anyone may submit                                         */
/* ------------------------------------------------------------------ */

/**
 * Writes a contact-form submission.
 *
 * Deliberately uses the ordinary (anon-key) server client, NOT the service
 * role: the "Anyone can submit an inquiry" RLS policy is what authorises this
 * write, so the database — not just this function — enforces that the public
 * can insert and nothing more.
 */
export async function submitInquiry(
  input: InquiryFormValues,
): Promise<ActionResult> {
  try {
    const values = inquiryFormSchema.parse(input);

    // Honeypot tripped: behave exactly like success so a bot learns nothing.
    if (values.company) return { ok: true };

    if (!isSupabaseConfigured()) {
      return {
        ok: false,
        error: "Messaging isn't available right now. Please email us instead.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
      name: values.name,
      email: values.email,
      project_type: values.project_type,
      message: values.message,
    });
    if (error) throw error;

    revalidatePath("/admin/inquiries");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: logAndGenericise(
        err,
        "Something went wrong sending your message. Please try again.",
      ),
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Admin                                                              */
/* ------------------------------------------------------------------ */

export async function setInquiryHandled(
  id: string,
  handled: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("inquiries")
      .update({ handled })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/inquiries");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: logAndGenericise(err, "Failed to update.") };
  }
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("inquiries").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/inquiries");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: logAndGenericise(err, "Failed to delete.") };
  }
}
