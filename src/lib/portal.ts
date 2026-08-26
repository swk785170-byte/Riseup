/** Shared types for the client portal. Mirrors 0010_client_portal.sql. */

export type DomainStatus = "submitted" | "reviewed" | "needs_info";
export type MessageSender = "client" | "admin";

export type DbClient = {
  id: string;
  auth_user_id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
};

export type DbDomainRegistration = {
  id: string;
  client_id: string;
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

export type DbMessage = {
  id: string;
  client_id: string;
  sender: MessageSender;
  body: string;
  read_at: string | null;
  created_at: string;
};

/** Row shape for the admin clients list. */
export type ClientSummary = {
  client: DbClient;
  status: DomainStatus | null;
  lastMessageAt: string | null;
  unreadFromClient: number;
};

export const DOMAIN_STATUS_LABEL: Record<DomainStatus, string> = {
  submitted: "Submitted",
  reviewed: "Reviewed",
  needs_info: "Needs info",
};

/** Narrowing helpers — never trust a raw string from the database or a form. */
export function isDomainStatus(value: unknown): value is DomainStatus {
  return value === "submitted" || value === "reviewed" || value === "needs_info";
}

export function isMessageSender(value: unknown): value is MessageSender {
  return value === "client" || value === "admin";
}
