"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import {
  galleryImageFormSchema,
  siteSettingsFormSchema,
  teamMemberFormSchema,
  type GalleryImageFormValues,
  type SiteSettingsFormValues,
  type TeamMemberFormValues,
} from "@/lib/schemas/site";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };


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

/** Team + gallery live on /about. */
function revalidateAbout(): void {
  revalidatePath("/about");
  revalidatePath("/admin/team");
  revalidatePath("/admin/gallery");
}

/** Settings (email, socials, WhatsApp) appear in the footer on every page. */
function revalidateEverywhere(): void {
  revalidatePath("/", "layout");
}

/** Shared "swap sort_order with the neighbour" reorder. */
async function swapOrder(
  table: "team_members" | "gallery_images",
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from(table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;

  const list = (data ?? []) as { id: string; sort_order: number }[];
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return { ok: false, error: "Item not found." };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= list.length) return { ok: true }; // at edge

  const current = list[idx];
  const neighbour = list[swapIdx];
  const { error: e1 } = await admin
    .from(table)
    .update({ sort_order: neighbour.sort_order })
    .eq("id", current.id);
  const { error: e2 } = await admin
    .from(table)
    .update({ sort_order: current.sort_order })
    .eq("id", neighbour.id);
  if (e1 ?? e2) throw e1 ?? e2;
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/*  Team members                                                       */
/* ------------------------------------------------------------------ */

function toTeamRow(values: TeamMemberFormValues) {
  return {
    name: values.name,
    role: values.role ? values.role : null,
    photo_url: values.photo_url ? values.photo_url : null,
    instagram_url: values.instagram_url ? values.instagram_url : null,
    linkedin_url: values.linkedin_url ? values.linkedin_url : null,
    website_url: values.website_url ? values.website_url : null,
    sort_order: values.sort_order,
  };
}

export async function createTeamMember(
  input: TeamMemberFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = teamMemberFormSchema.parse(input);
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("team_members")
      .insert(toTeamRow(values))
      .select("id")
      .single();
    if (error) throw error;
    revalidateAbout();
    const row = data as { id: string } | null;
    return { ok: true, id: row?.id };
  } catch (err) {
    return {
      ok: false,
      error: errorMessage(err, "Failed to create team member."),
    };
  }
}

export async function updateTeamMember(
  id: string,
  input: TeamMemberFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = teamMemberFormSchema.parse(input);
    const admin = createAdminClient();
    const { error } = await admin
      .from("team_members")
      .update(toTeamRow(values))
      .eq("id", id);
    if (error) throw error;
    revalidateAbout();
    return { ok: true, id };
  } catch (err) {
    return {
      ok: false,
      error: errorMessage(err, "Failed to update team member."),
    };
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("team_members").delete().eq("id", id);
    if (error) throw error;
    revalidateAbout();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: errorMessage(err, "Failed to delete team member."),
    };
  }
}

export async function moveTeamMember(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const res = await swapOrder("team_members", id, direction);
    revalidateAbout();
    return res;
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to reorder.") };
  }
}

/* ------------------------------------------------------------------ */
/*  Gallery images                                                     */
/* ------------------------------------------------------------------ */

function toGalleryRow(values: GalleryImageFormValues) {
  return {
    image_url: values.image_url,
    alt: values.alt ? values.alt : null,
    sort_order: values.sort_order,
  };
}

export async function createGalleryImage(
  input: GalleryImageFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = galleryImageFormSchema.parse(input);
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("gallery_images")
      .insert(toGalleryRow(values))
      .select("id")
      .single();
    if (error) throw error;
    revalidateAbout();
    const row = data as { id: string } | null;
    return { ok: true, id: row?.id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to add image.") };
  }
}

export async function updateGalleryImage(
  id: string,
  input: GalleryImageFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = galleryImageFormSchema.parse(input);
    const admin = createAdminClient();
    const { error } = await admin
      .from("gallery_images")
      .update(toGalleryRow(values))
      .eq("id", id);
    if (error) throw error;
    revalidateAbout();
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to update image.") };
  }
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("gallery_images").delete().eq("id", id);
    if (error) throw error;
    revalidateAbout();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to delete image.") };
  }
}

export async function moveGalleryImage(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const res = await swapOrder("gallery_images", id, direction);
    revalidateAbout();
    return res;
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Failed to reorder.") };
  }
}

/* ------------------------------------------------------------------ */
/*  Site settings                                                      */
/* ------------------------------------------------------------------ */

export async function updateSiteSettings(
  input: SiteSettingsFormValues,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const values = siteSettingsFormSchema.parse(input);
    const admin = createAdminClient();
    const { error } = await admin.from("site_settings").upsert({
      id: 1,
      email: values.email,
      whatsapp_number: values.whatsapp_number ?? "",
      instagram_url: values.instagram_url ?? "",
      facebook_url: values.facebook_url ?? "",
      linkedin_url: values.linkedin_url ?? "",
      youtube_url: values.youtube_url ?? "",
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    revalidateEverywhere();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: errorMessage(err, "Failed to save settings."),
    };
  }
}
