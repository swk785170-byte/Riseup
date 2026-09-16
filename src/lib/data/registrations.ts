import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import type {
  DbDomainRegistration,
  DbRegistrationLink,
  DbSmsLenzApproval,
  LinkSummary,
} from "@/lib/registrations";

const LINK_COLS =
  "id, token_hash, client_name, company_name, client_email, note, expires_at, revoked_at, last_opened_at, created_at";
const REG_COLS =
  "id, link_id, business_name, full_name, email, phone_number, address, id_number, domain_name, is_owner, owner_name, owner_nic_or_passport, owner_email, owner_contact_number, status, submitted_at, updated_at";
const SMS_COLS =
  "id, link_id, sender_id, address, id_card_front_url, id_card_back_url, logo_url, status, submitted_at, updated_at";

/** Reads the submission behind an already-validated link. */
export async function getRegistrationForLink(
  linkId: string,
): Promise<DbDomainRegistration | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("domain_registrations")
    .select(REG_COLS)
    .eq("link_id", linkId)
    .maybeSingle();
  if (error) {
    console.error("[registration] read failed", error);
    return null;
  }
  return (data as DbDomainRegistration | null) ?? null;
}

/** Reads the optional SMS Lenz submission behind an already-validated link. */
export async function getSmsLenzForLink(
  linkId: string,
): Promise<DbSmsLenzApproval | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("sms_lenz_approvals")
    .select(SMS_COLS)
    .eq("link_id", linkId)
    .maybeSingle();
  if (error) {
    console.error("[sms-lenz] read failed", error);
    return null;
  }
  return (data as DbSmsLenzApproval | null) ?? null;
}

/* --- Admin reads: service role, so each one is gated on requireAdmin. --- */

export async function listRegistrationLinks(): Promise<LinkSummary[]> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: linkRows, error } = await admin
    .from("registration_links")
    .select(LINK_COLS)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;

  const links = (linkRows as DbRegistrationLink[] | null) ?? [];
  if (links.length === 0) return [];

  const ids = links.map((l) => l.id);

  const [{ data: regRows }, { data: smsRows }] = await Promise.all([
    admin.from("domain_registrations").select(REG_COLS).in("link_id", ids),
    admin.from("sms_lenz_approvals").select(SMS_COLS).in("link_id", ids),
  ]);

  const byLink = new Map<string, DbDomainRegistration>();
  for (const row of ((regRows as DbDomainRegistration[] | null) ?? [])) {
    byLink.set(row.link_id, row);
  }
  const smsByLink = new Map<string, DbSmsLenzApproval>();
  for (const row of ((smsRows as DbSmsLenzApproval[] | null) ?? [])) {
    smsByLink.set(row.link_id, row);
  }

  return links.map((link) => ({
    link,
    registration: byLink.get(link.id) ?? null,
    smsLenz: smsByLink.get(link.id) ?? null,
  }));
}

export async function getLinkDetail(id: string): Promise<LinkSummary | null> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: link } = await admin
    .from("registration_links")
    .select(LINK_COLS)
    .eq("id", id)
    .maybeSingle();
  if (!link) return null;

  const [{ data: registration }, { data: smsLenz }] = await Promise.all([
    admin.from("domain_registrations").select(REG_COLS).eq("link_id", id).maybeSingle(),
    admin.from("sms_lenz_approvals").select(SMS_COLS).eq("link_id", id).maybeSingle(),
  ]);

  return {
    link: link as DbRegistrationLink,
    registration: (registration as DbDomainRegistration | null) ?? null,
    smsLenz: (smsLenz as DbSmsLenzApproval | null) ?? null,
  };
}
