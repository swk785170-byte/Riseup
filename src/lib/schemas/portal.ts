import { z } from "zod";

/**
 * Server-side validation for every portal input.
 *
 * Note what is absent: none of these schemas accept a `client_id`, a `sender`
 * or a `status`. Those are decided on the server from the validated session,
 * so a crafted request has no field to tamper with (mass assignment /
 * privilege escalation).
 */

const trimmed = (max: number) => z.string().trim().max(max);

/** Conservative hostname shape — also blocks a URL or path being pasted in. */
const DOMAIN_RE =
  /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i;

export const magicLinkSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
});
export type MagicLinkValues = z.output<typeof magicLinkSchema>;

export const domainRegistrationSchema = z
  .object({
    domain_name: trimmed(253)
      .min(3, "Enter the domain name")
      .regex(DOMAIN_RE, "Enter a domain like example.com"),
    is_owner: z.boolean(),
    owner_name: trimmed(120).optional().or(z.literal("")),
    owner_nic_or_passport: trimmed(40).optional().or(z.literal("")),
    owner_email: trimmed(200).optional().or(z.literal("")),
    owner_contact_number: trimmed(40).optional().or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (values.is_owner) return;
    // Mirrors the `owner_details_required` CHECK constraint, so the rule holds
    // whether the write arrives through the form or through the raw API.
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

    if (values.owner_email && !z.string().email().safeParse(values.owner_email).success) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid email",
        path: ["owner_email"],
      });
    }
  });

export type DomainRegistrationInput = z.input<typeof domainRegistrationSchema>;
export type DomainRegistrationValues = z.output<typeof domainRegistrationSchema>;

export const messageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Write a message first")
    .max(4000, "Message is too long"),
});
export type MessageValues = z.output<typeof messageSchema>;

export const newClientSchema = z.object({
  full_name: trimmed(120).min(1, "Name is required"),
  company_name: trimmed(160).optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
  phone: trimmed(40).optional().or(z.literal("")),
});
export type NewClientInput = z.input<typeof newClientSchema>;
export type NewClientValues = z.output<typeof newClientSchema>;

export const statusSchema = z.object({
  status: z.enum(["submitted", "reviewed", "needs_info"]),
});
