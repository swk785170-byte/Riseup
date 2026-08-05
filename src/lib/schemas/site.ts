import { z } from "zod";

const optionalUrl = z.string().trim().url().optional().or(z.literal(""));

export const teamMemberFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  photo_url: optionalUrl,
  instagram_url: optionalUrl,
  linkedin_url: optionalUrl,
  website_url: optionalUrl,
  sort_order: z.coerce.number().int().default(0),
});

export type TeamMemberFormValues = z.output<typeof teamMemberFormSchema>;
export type TeamMemberFormInput = z.input<typeof teamMemberFormSchema>;

export const galleryImageFormSchema = z.object({
  image_url: z.string().trim().url("Upload an image first"),
  alt: z.string().trim().max(160).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
});

export type GalleryImageFormValues = z.output<typeof galleryImageFormSchema>;
export type GalleryImageFormInput = z.input<typeof galleryImageFormSchema>;

export const siteSettingsFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(160),
  whatsapp_number: z
    .string()
    .trim()
    .max(20)
    .regex(
      /^[0-9]*$/,
      "Digits only — international format without '+' (e.g. 94771234567)",
    )
    .optional()
    .or(z.literal("")),
  instagram_url: optionalUrl,
  facebook_url: optionalUrl,
  linkedin_url: optionalUrl,
  youtube_url: optionalUrl,
});

export type SiteSettingsFormValues = z.output<typeof siteSettingsFormSchema>;
export type SiteSettingsFormInput = z.input<typeof siteSettingsFormSchema>;
