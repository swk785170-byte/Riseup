-- ===========================================================================
-- Riseup Solutions — Domain registration by secret link (replaces 0010)
--
-- The client portal's login system is removed. Instead an admin mints a
-- single-purpose, expiring URL and sends it to the client, who fills in the
-- domain registration form without an account.
--
-- SECURITY MODEL — read before changing anything here:
--
--   * The token is the ONLY credential, so it is treated like a password:
--     32 bytes of CSPRNG entropy, and only its SHA-256 hash is stored. A dump
--     of this table therefore yields no working links.
--   * Every link expires, and can be revoked at any time.
--   * NEITHER table grants a single policy to `anon` or `authenticated`. RLS
--     is on with zero policies, which denies everything: the public anon key
--     cannot read or write these rows at all. All access runs through
--     server-side code holding the service role, and only after the token has
--     been validated. There is no user identity to key RLS on here, so the
--     trust boundary is moved into trusted server code rather than faked.
--
-- 0010's tables are dropped: they modelled logged-in client accounts, which no
-- longer exist. NOTE: the Supabase Auth users created by earlier invites are
-- NOT touched by this migration — delete them from the Auth dashboard if you
-- no longer want them to be able to sign in anywhere.
-- ===========================================================================

-- --- Tear down the account-based model from 0010 -------------------------
drop table if exists public.messages cascade;
drop table if exists public.domain_registrations cascade;
drop table if exists public.clients cascade;
drop table if exists public.staff cascade;

drop function if exists public.is_staff() cascade;
drop function if exists public.current_client_id() cascade;
drop function if exists public.clients_freeze_identity() cascade;
drop function if exists public.domain_registrations_guard() cascade;
drop function if exists public.messages_read_receipt_only() cascade;

-- --- Registration links ---------------------------------------------------
create table public.registration_links (
  id             uuid primary key default gen_random_uuid(),

  -- SHA-256 hex of the token. The raw token is shown to the admin once, at
  -- creation, and is never persisted anywhere.
  token_hash     text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),

  -- Who the link was issued to. Admin-entered labels, not an account.
  client_name    text not null check (length(btrim(client_name)) between 1 and 120),
  company_name   text check (company_name is null or length(company_name) <= 160),
  client_email   text check (client_email is null or length(client_email) <= 200),
  note           text check (note is null or length(note) <= 500),

  expires_at     timestamptz not null,
  revoked_at     timestamptz,
  last_opened_at timestamptz,
  created_at     timestamptz not null default now()
);

create index registration_links_created_idx
  on public.registration_links (created_at desc);

alter table public.registration_links enable row level security;
-- Intentionally no policies: deny-all for anon and authenticated.

-- --- Submissions ----------------------------------------------------------
create table public.domain_registrations (
  id                    uuid primary key default gen_random_uuid(),

  -- One submission per link, editable in place while the link is valid.
  link_id               uuid not null unique
                          references public.registration_links(id) on delete cascade,

  domain_name           text not null check (length(btrim(domain_name)) between 3 and 253),
  is_owner              boolean not null default true,
  owner_name            text check (owner_name is null or length(owner_name) <= 120),
  owner_nic_or_passport text check (owner_nic_or_passport is null or length(owner_nic_or_passport) <= 40),
  owner_email           text check (owner_email is null or length(owner_email) <= 200),
  owner_contact_number  text check (owner_contact_number is null or length(owner_contact_number) <= 40),

  status                text not null default 'submitted'
                          check (status in ('submitted', 'reviewed', 'needs_info')),
  submitted_at          timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- Owner details are mandatory when the client is not the owner. Enforced
  -- here as well as in zod, so the rule holds even if the form is bypassed.
  constraint owner_details_required check (
    is_owner
    or (
      owner_name is not null and length(btrim(owner_name)) > 0
      and owner_nic_or_passport is not null and length(btrim(owner_nic_or_passport)) > 0
      and owner_email is not null and length(btrim(owner_email)) > 0
      and owner_contact_number is not null and length(btrim(owner_contact_number)) > 0
    )
  )
);

alter table public.domain_registrations enable row level security;
-- Intentionally no policies: deny-all for anon and authenticated.

create or replace function public.touch_domain_registration()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger domain_registrations_touch
  before update on public.domain_registrations
  for each row execute function public.touch_domain_registration();
