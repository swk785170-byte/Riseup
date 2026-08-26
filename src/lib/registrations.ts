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
  domain_name: string;
  is_owner: boolean;
  owner_name: string | null;
  owner_nic_or_passport: string | null;
  owner_email: string | null;
  owner_contact_number: string | null;
  status: DomainStatus;
  submitted_at: string;
  updated_at: string;
};

/** A link plus its submission, for the admin list. */
export type LinkSummary = {
  link: DbRegistrationLink;
  registration: DbDomainRegistration | null;
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
