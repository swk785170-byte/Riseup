import { z } from "zod";

/** Discipline options — must match the derived-visuals map in lib/projects.ts. */
export const CATEGORY_OPTIONS = [
  "Web Design",
  "Web Development",
  "E-Commerce",
  "SEO & Growth",
  "LMS",
] as const;

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

const optionalText = z
  .string()
  .trim()
  .max(1200)
  .optional()
  .or(z.literal(""));

export const resultSchema = z.object({
  value: z.string().trim().min(1, "Required").max(24),
  label: z.string().trim().min(1, "Required").max(80),
});

export const projectFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(120),
  client_name: z.string().trim().min(1, "Client name is required").max(120),
  category: z.enum(CATEGORY_OPTIONS),
  tag: z.string().trim().max(60).optional().or(z.literal("")),
  year: z.coerce
    .number({ message: "Year is required" })
    .int()
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Year looks too far out"),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  challenge: optionalText,
  solution: optionalText,
  results: z.array(resultSchema).max(6).default([]),
  tags: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  gallery_urls: z.array(z.string().url()).max(8).default([]),
  featured: z.boolean().default(false),
  is_lms: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

/** Output (post-coerce, defaults applied) — what a submit handler receives. */
export type ProjectFormValues = z.output<typeof projectFormSchema>;
/** Input (pre-coerce) — what the form fields hold; used as useForm's field type. */
export type ProjectFormInput = z.input<typeof projectFormSchema>;
