import { z } from "zod";
import { normaliseDomain } from "@/lib/domain";

/**
 * Server-side validation for link-based domain registration.
 *
 * Note what is absent: no schema accepts a `link_id`, a `token_hash` or a
 * `status`. The link is resolved from the URL token in trusted server code and
 * the status is a staff decision, so a crafted payload has no field to point
 * at another client's submission.
 */

const trimmed = (max: number) => z.string().trim().max(max);

export const domainRegistrationSchema = z
  .object({
    /*
     * Accepts whatever the client pastes — a full URL, a www host, a trailing
     * slash — and normalises it rather than refusing. The only remaining rule
     * is the 3-253 character bound the database column enforces, so the two
     * can never disagree and produce an opaque constraint error.
     */
    domain_name: z
      .string()
      .trim()
      .max(400, "That is too long to be a domain name")
      .transform(normaliseDomain)
      .pipe(
        z
          .string()
          .min(3, "Enter the domain name")
          .max(253, "That is too long to be a domain name"),
      ),
    is_owner: z.boolean(),
    owner_name: trimmed(120).optional().or(z.literal("")),
    owner_nic_or_passport: trimmed(40).optional().or(z.literal("")),
    owner_email: trimmed(200).optional().or(z.literal("")),
    owner_contact_number: trimmed(40).optional().or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (values.is_owner) return;
    // Mirrors the `owner_details_required` CHECK constraint, so the rule holds
    // whether the write arrives through the form or another route.
    const required = [
      ["owner_name", "Owner name is required"],
      ["owner_nic_or_passport", "NIC or passport number is required"],
      ["owner_email", "Owner email is required"],
      ["owner_contact_number", "Contact number is required"],
    ] as const;

    for (const [field, message] of required) {
      if (!values[field] || values[field].trim().length === 0) {
        ctx.addIssue({ code: "custom", message, path: [field] });
      }
    }

    if (
      values.owner_email &&
      !z.string().email().safeParse(values.owner_email).success
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid email",
        path: ["owner_email"],
      });
    }
  });

export type DomainRegistrationInput = z.input<typeof domainRegistrationSchema>;
export type DomainRegistrationValues = z.output<typeof domainRegistrationSchema>;

/** Admin form for minting a link. */
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
