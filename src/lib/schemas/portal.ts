import { z } from "zod";

/**
 * Server-side validation for the two client forms.
 *
 * Note what is absent: no schema accepts a `link_id`, a `token_hash` or a
 * `status`. The link is resolved from the URL token in trusted server code and
 * the status is a staff decision, so a crafted payload has no field to point
 * at another client's submission.
 */

const trimmed = (max: number) => z.string().trim().max(max);

/* ------------------------------------------------------------------ */
/*  Domain registration — every field REQUIRED                         */
/* ------------------------------------------------------------------ */

export const domainRegistrationSchema = z.object({
  business_name: trimmed(160).min(1, "Business name is required"),
  full_name: trimmed(120).min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(200),
  phone_number: trimmed(40).min(1, "Phone number is required"),
  address: trimmed(400).min(1, "Address is required"),
  id_number: trimmed(40).min(1, "ID number is required"),
});

export type DomainRegistrationInput = z.input<typeof domainRegistrationSchema>;
export type DomainRegistrationValues = z.output<typeof domainRegistrationSchema>;

/* ------------------------------------------------------------------ */
/*  SMS Lenz approval — every field OPTIONAL                           */
/* ------------------------------------------------------------------ */

/**
 * Nothing here is required, so the whole form may be submitted empty. Only the
 * *shape* of a value is checked — a client who fills one field in is not then
 * forced to fill the rest.
 */
export const smsLenzApprovalSchema = z.object({
  sender_id: trimmed(80).optional().or(z.literal("")),
  address: trimmed(400).optional().or(z.literal("")),
});

export type SmsLenzApprovalInput = z.input<typeof smsLenzApprovalSchema>;
export type SmsLenzApprovalValues = z.output<typeof smsLenzApprovalSchema>;

/* ------------------------------------------------------------------ */
/*  Uploads                                                            */
/* ------------------------------------------------------------------ */

/** Mirrors the `sms-lenz-uploads` bucket limits, which Storage enforces too. */
export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

/**
 * SVG is deliberately absent: it is XML and can carry <script>, which would be
 * stored XSS served from the Storage origin.
 */
export const UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type UploadMimeType = (typeof UPLOAD_MIME_TYPES)[number];

export function isUploadMimeType(value: string): value is UploadMimeType {
  return (UPLOAD_MIME_TYPES as readonly string[]).includes(value);
}

/** Extension is derived from the validated MIME type, never from the filename. */
export const MIME_EXTENSION: Record<UploadMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/* ------------------------------------------------------------------ */
/*  Admin                                                              */
/* ------------------------------------------------------------------ */

export const newLinkSchema = z.object({
  client_name: trimmed(120).min(1, "Client name is required"),
  company_name: trimmed(160).optional().or(z.literal("")),
  client_email: z
    .string()
    .trim()
    .toLowerCase()
    .max(200)
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  note: trimmed(500).optional().or(z.literal("")),
  // Bounded so a link can never be minted that effectively never expires.
  expires_in_days: z.coerce.number().int().min(1).max(90).default(14),
});
export type NewLinkInput = z.input<typeof newLinkSchema>;
export type NewLinkValues = z.output<typeof newLinkSchema>;

export const statusSchema = z.object({
  status: z.enum(["submitted", "reviewed", "needs_info"]),
});
