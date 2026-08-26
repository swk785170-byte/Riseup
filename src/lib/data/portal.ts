import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import type {
  ClientSummary,
  DbClient,
  DbDomainRegistration,
  DbMessage,
} from "@/lib/portal";

const CLIENT_COLS =
  "id, auth_user_id, full_name, company_name, email, phone, created_at";
const REG_COLS =
  "id, client_id, domain_name, is_owner, owner_name, owner_nic_or_passport, owner_email, owner_contact_number, status, submitted_at, updated_at";
const MSG_COLS = "id, client_id, sender, body, read_at, created_at";

/* ------------------------------------------------------------------ */
/*  Client-side reads — go through the user's session so RLS applies.  */
/*  A missing `.eq()` here would still be safe, because the policy     */
/*  already scopes every row to the caller.                            */
/* ------------------------------------------------------------------ */

export async function getMyRegistration(
  clientId: string,
): Promise<DbDomainRegistration | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("domain_registrations")
    .select(REG_COLS)
    .eq("client_id", clientId)
    .maybeSingle();
  if (error) {
    console.error("[portal] registration read failed", error);
    return null;
  }
  return (data as DbDomainRegistration | null) ?? null;
}

export async function getMyMessages(clientId: string): Promise<DbMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(MSG_COLS)
    .eq("client_id", clientId)
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) {
    console.error("[portal] thread read failed", error);
    return [];
  }
  return (data as DbMessage[] | null) ?? [];
}

/** Unread admin replies, for the dashboard shortcut. */
export async function getMyUnreadCount(clientId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId)
    .eq("sender", "admin")
    .is("read_at", null);
  if (error) return 0;
  return count ?? 0;
}

/* ------------------------------------------------------------------ */
/*  Admin reads — service role, so every one is gated on requireAdmin. */
/* ------------------------------------------------------------------ */

export async function listClientSummaries(): Promise<ClientSummary[]> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: clientRows, error } = await admin
    .from("clients")
    .select(CLIENT_COLS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const clients = (clientRows as DbClient[] | null) ?? [];
  if (clients.length === 0) return [];

  const ids = clients.map((c) => c.id);

  const { data: regRows } = await admin
    .from("domain_registrations")
    .select("client_id, status")
    .in("client_id", ids);
  const statusByClient = new Map<string, ClientSummary["status"]>();
  for (const row of (regRows ?? []) as { client_id: string; status: ClientSummary["status"] }[]) {
    statusByClient.set(row.client_id, row.status);
  }

  const { data: msgRows } = await admin
    .from("messages")
    .select("client_id, sender, read_at, created_at")
    .in("client_id", ids)
    .order("created_at", { ascending: false });

  const lastAt = new Map<string, string>();
  const unread = new Map<string, number>();
  for (const row of (msgRows ?? []) as {
    client_id: string;
    sender: string;
    read_at: string | null;
    created_at: string;
  }[]) {
    if (!lastAt.has(row.client_id)) lastAt.set(row.client_id, row.created_at);
    if (row.sender === "client" && row.read_at === null) {
      unread.set(row.client_id, (unread.get(row.client_id) ?? 0) + 1);
    }
  }

  return clients.map((client) => ({
    client,
    status: statusByClient.get(client.id) ?? null,
    lastMessageAt: lastAt.get(client.id) ?? null,
    unreadFromClient: unread.get(client.id) ?? 0,
  }));
}

export async function getClientDetail(id: string): Promise<{
  client: DbClient;
  registration: DbDomainRegistration | null;
  messages: DbMessage[];
} | null> {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: client } = await admin
    .from("clients")
    .select(CLIENT_COLS)
    .eq("id", id)
    .maybeSingle();
  if (!client) return null;

  const { data: registration } = await admin
    .from("domain_registrations")
    .select(REG_COLS)
    .eq("client_id", id)
    .maybeSingle();

  const { data: messages } = await admin
    .from("messages")
    .select(MSG_COLS)
    .eq("client_id", id)
    .order("created_at", { ascending: true })
    .limit(500);

  return {
    client: client as DbClient,
    registration: (registration as DbDomainRegistration | null) ?? null,
    messages: ((messages as DbMessage[] | null) ?? []),
  };
}
