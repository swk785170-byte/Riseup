"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/lib/schemas/project";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

/** Verify a real signed-in admin before any privileged (service-role) write. */

function revalidatePublic(): void {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/services/lms");
  revalidatePath("/admin/projects");
}

function toRow(values: ProjectFormValues) {
  return {
    title: values.title,
    client_name: values.client_name,
    category: values.category,
    tag: values.tag ? values.tag : null,
    year: values.year,
    description: values.description ? values.description : null,
    challenge: values.challenge ? values.challenge : null,
    solution: values.solution ? values.solution : null,
    results: values.results,
    tags: values.tags,
    thumbnail_url: values.thumbnail_url ? values.thumbnail_url : null,
    gallery_urls: values.gallery_urls,
    featured: values.featured,
    is_lms: values.is_lms,
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

export async function createProject(
  input: ProjectFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = projectFormSchema.parse(input);
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("projects")
      .insert(toRow(values))
      .select("id")
      .single();
    if (error) throw error;
    revalidatePublic();
    const row = data as { id: string } | null;
    return { ok: true, id: row?.id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to create project.") };
  }
}

export async function updateProject(
  id: string,
  input: ProjectFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = projectFormSchema.parse(input);
    const admin = createAdminClient();
    const { error } = await admin
      .from("projects")
      .update(toRow(values))
      .eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to update project.") };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("projects").delete().eq("id", id);
    if (error) throw error;
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to delete project.") };
  }
}

/** Swap sort_order with the adjacent project (simple reorder). */
export async function moveProject(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("projects")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;

    const list = (data ?? []) as { id: string; sort_order: number }[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return { ok: false, error: "Project not found." };

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return { ok: true }; // at edge

    const current = list[idx];
    const neighbour = list[swapIdx];
    const { error: e1 } = await admin
      .from("projects")
      .update({ sort_order: neighbour.sort_order })
      .eq("id", current.id);
    const { error: e2 } = await admin
      .from("projects")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbour.id);
    if (e1 ?? e2) throw e1 ?? e2;

    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to reorder.") };
  }
}
