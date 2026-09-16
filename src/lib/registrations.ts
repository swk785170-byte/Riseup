/** Shared types for link-based domain registration. Mirrors 0011. */

export type DomainStatus = "submitted" | "reviewed" | "needs_info";

export type DbRegistrationLink = {
  id: string;
  token_hash: string;
  client_name: string;
  company_name: string | null;
  client_email: string | null;
  note: string | null;
  expires_at: string;
  revoked_at: string | null;
  last_opened_at: string | null;
  created_at: string;
};

export type DbDomainRegistration = {
  id: string;
  link_id: string;

  /* Phase 7 field set — all six required on submit, nullable in the column
     only so the rows that predate the change survive. */
  business_name: string | null;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  id_number: string | null;

  /* Legacy columns kept so earlier submissions keep their data. A row with
     `business_name === null` was captured by the old form. */
  domain_name: string | null;
  is_owner: boolean;
  owner_name: string | null;
  owner_nic_or_passport: string | null;
  owner_email: string | null;
  owner_contact_number: string | null;

  status: DomainStatus;
  submitted_at: string;
  updated_at: string;
};

export type DbSmsLenzApproval = {
  id: string;
  link_id: string;
  sender_id: string | null;
  address: string | null;
  id_card_photo_url: string | null;
  logo_url: string | null;
  status: DomainStatus;
  submitted_at: string;
  updated_at: string;
};

/** True when a submission was captured by the pre-Phase-7 form. */
export function isLegacyRegistration(row: DbDomainRegistration): boolean {
  return row.business_name === null;
}

/** A link plus both of its submissions, for the admin views. */
export type LinkSummary = {
  link: DbRegistrationLink;
  registration: DbDomainRegistration | null;
  smsLenz: DbSmsLenzApproval | null;
};

export const DOMAIN_STATUS_LABEL: Record<DomainStatus, string> = {
  submitted: "Submitted",
  reviewed: "Reviewed",
  needs_info: "Needs info",
};

export type LinkState = "active" | "revoked" | "expired";

export function linkState(link: DbRegistrationLink): LinkState {
  if (link.revoked_at) return "revoked";
  if (new Date(link.expires_at).getTime() <= Date.now()) return "expired";
  return "active";
}
