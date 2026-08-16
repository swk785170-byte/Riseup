import { z } from "zod";
import { PROJECT_TYPES } from "@/lib/inquiries";

/**
 * Validated on the server as well as the client — this endpoint is public, so
 * the client-side checks are convenience only. Lengths are bounded to keep a
 * scripted submitter from writing megabytes into the table.
 */
export const inquiryFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  project_type: z.enum(PROJECT_TYPES),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more")
    .max(4000, "Message is too long"),
  /**
   * Honeypot. Real people never see or fill this; bots that auto-fill every
   * field do. A non-empty value means we accept the request and silently
   * discard it, so the bot gets no signal to adapt.
   */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryFormValues = z.output<typeof inquiryFormSchema>;
export type InquiryFormInput = z.input<typeof inquiryFormSchema>;
