import { z } from "zod";

export const testimonialFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  quote: z
    .string()
    .trim()
    .min(10, "Quote is required")
    .max(600, "Keep quotes under 600 characters so cards stay even"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatar_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
});

export type TestimonialFormValues = z.output<typeof testimonialFormSchema>;
export type TestimonialFormInput = z.input<typeof testimonialFormSchema>;
