"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import {
  clientLogoFormSchema,
  type ClientLogoFormValues,
} from "@/lib/schemas/client-logo";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };


/** The marquee lives on the homepage, so any change revalidates "/". */
function revalidatePublic(): void {
  revalidatePath("/");
  revalidatePath("/admin/client-logos");
}

function toRow(values: ClientLogoFormValues) {
  return {
    name: values.name,
    logo_url: values.logo_url ? values.logo_url : null,
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

export async function createClientLogo(
  input: ClientLogoFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = clientLogoFormSchema.parse(input);
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("client_logos")
      .insert(toRow(values))
      .select("id")
      .single();
    if (error) throw error;
    revalidatePublic();
    const row = data as { id: string } | null;
    return { ok: true, id: row?.id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to create logo.") };
  }
}

export async function updateClientLogo(
  id: string,
  input: ClientLogoFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = clientLogoFormSchema.parse(input);
    const admin = createAdminClient();
    const { error } = await admin
      .from("client_logos")
      .update(toRow(values))
      .eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to update logo.") };
  }
}

export async function deleteClientLogo(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("client_logos").delete().eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to delete logo.") };
  }
}

/** Swap sort_order with the adjacent logo. */
export async function moveClientLogo(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("client_logos")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;

    const list = (data ?? []) as { id: string; sort_order: number }[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return { ok: false, error: "Logo not found." };

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return { ok: true }; // at edge

    const current = list[idx];
    const neighbour = list[swapIdx];
    const { error: e1 } = await admin
      .from("client_logos")
      .update({ sort_order: neighbour.sort_order })
      .eq("id", current.id);
    const { error: e2 } = await admin
      .from("client_logos")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbour.id);
    if (e1 ?? e2) throw e1 ?? e2;

    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to reorder.") };
  }
}
