import { z } from "zod";

export const clientLogoFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  logo_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
});

export type ClientLogoFormValues = z.output<typeof clientLogoFormSchema>;
export type ClientLogoFormInput = z.input<typeof clientLogoFormSchema>;
