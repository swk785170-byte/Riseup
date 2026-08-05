"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import {
  testimonialFormSchema,
  type TestimonialFormValues,
} from "@/lib/schemas/testimonial";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };


/** Testimonials live on the homepage, so any change revalidates "/". */
function revalidatePublic(): void {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

function toRow(values: TestimonialFormValues) {
  return {
    name: values.name,
    role: values.role ? values.role : null,
    quote: values.quote,
    rating: values.rating,
    avatar_url: values.avatar_url ? values.avatar_url : null,
    sort_order: values.sort_order,
  };
}

/**
 * Never surface raw database/driver errors to the browser — they leak schema
 * details, constraint names and internal paths. Log the real error server-side
 * and return a generic, safe message instead.
 */
function errorMessage(err: unknown, fallback: string): string {
  console.error("[admin action]", err);
  if (err instanceof Error && err.message === "Not authorised.") {
    return "Not authorised.";
  }
  return fallback;
}

export async function createTestimonial(
  input: TestimonialFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = testimonialFormSchema.parse(input);
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("testimonials")
      .insert(toRow(values))
      .select("id")
      .single();
    if (error) throw error;
    revalidatePublic();
    const row = data as { id: string } | null;
    return { ok: true, id: row?.id };
  } catch (err) {
    return {
      ok: false,
      error: errorMessage(err, "Failed to create testimonial."),
    };
  }
}

export async function updateTestimonial(
  id: string,
  input: TestimonialFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = testimonialFormSchema.parse(input);
    const admin = createAdminClient();
    const { error } = await admin
      .from("testimonials")
      .update(toRow(values))
      .eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true, id };
  } catch (err) {
    return {
      ok: false,
      error: errorMessage(err, "Failed to update testimonial."),
    };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: errorMessage(err, "Failed to delete testimonial."),
    };
  }
}

/** Swap sort_order with the adjacent testimonial. */
export async function moveTestimonial(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("testimonials")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;

    const list = (data ?? []) as { id: string; sort_order: number }[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return { ok: false, error: "Testimonial not found." };

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return { ok: true }; // at edge

    const current = list[idx];
    const neighbour = list[swapIdx];
    const { error: e1 } = await admin
      .from("testimonials")
      .update({ sort_order: neighbour.sort_order })
      .eq("id", current.id);
    const { error: e2 } = await admin
      .from("testimonials")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbour.id);
    if (e1 ?? e2) throw e1 ?? e2;

    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to reorder.") };
  }
}
