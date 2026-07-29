import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters, numbers and hyphens only",
    ),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  cover_url: z.string().url().optional().or(z.literal("")),
  body: z.string().trim().max(20000).optional().or(z.literal("")),
  author: z.string().trim().max(80).optional().or(z.literal("")),
  published: z.boolean().default(false),
  // From an <input type="date"> — "YYYY-MM-DD" or empty.
  published_at: z.string().trim().max(40).optional().or(z.literal("")),
});

export type PostFormValues = z.output<typeof postFormSchema>;
export type PostFormInput = z.input<typeof postFormSchema>;

/** Turn a title into a URL slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
