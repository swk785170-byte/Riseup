-- ===========================================================================
-- Riseup Solutions — Client Portal
--
-- Clients sign in with a magic link and see ONLY their own data. RLS is the
-- real security boundary here, not the UI: every policy below is written so
-- that even a client holding the public anon key and crafting raw PostgREST
-- requests cannot read or write another client's rows.
--
-- Two helper functions carry the identity checks. Both are SECURITY DEFINER
-- with a pinned search_path — without the pin, a caller who can create objects
-- in a schema earlier on the path could shadow `public.clients` and subvert
-- the check.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Staff: the database-side notion of "admin".
--
-- The app gates /admin on the ADMIN_EMAILS env allowlist, but Postgres cannot
-- read env vars, so RLS needs its own list. This table is what admin-side
-- Realtime subscriptions authenticate against. Rows are inserted manually or
-- by a service-role action — never by the client.
-- ---------------------------------------------------------------------------
create table if not exists public.staff (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  created_at   timestamptz not null default now()
);

alter table public.staff enable row level security;

-- Nobody reaches this table through the API; only service-role and the
-- SECURITY DEFINER function below touch it. No policies = deny all.

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.staff s where s.auth_user_id = auth.uid()
  );
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid not null unique references auth.users(id) on delete cascade,
  full_name     text not null check (length(btrim(full_name)) between 1 and 120),
  company_name  text check (company_name is null or length(company_name) <= 160),
  email         text not null check (length(email) between 3 and 200),
  phone         text check (phone is null or length(phone) <= 40),
  created_at    timestamptz not null default now()
);

alter table public.clients enable row level security;

create or replace function public.current_client_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select c.id from public.clients c where c.auth_user_id = auth.uid() limit 1;
$$;

revoke all on function public.current_client_id() from public;
grant execute on function public.current_client_id() to authenticated;

drop policy if exists "Clients read own row" on public.clients;
create policy "Clients read own row" on public.clients
  for select to authenticated
  using (auth_user_id = auth.uid() or public.is_staff());

drop policy if exists "Clients update own row" on public.clients;
create policy "Clients update own row" on public.clients
  for update to authenticated
  using (auth_user_id = auth.uid() or public.is_staff())
  with check (auth_user_id = auth.uid() or public.is_staff());

drop policy if exists "Staff insert clients" on public.clients;
create policy "Staff insert clients" on public.clients
  for insert to authenticated
  with check (public.is_staff());

-- RLS cannot restrict individual columns, so a client updating their own row
-- could otherwise re-point `auth_user_id` at someone else's account — an
-- account-takeover primitive. Freeze the identity columns instead.
create or replace function public.clients_freeze_identity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_staff() then
    if new.auth_user_id is distinct from old.auth_user_id
       or new.id is distinct from old.id
       or new.email is distinct from old.email then
      raise exception 'Identity columns are not editable.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists clients_freeze_identity on public.clients;
create trigger clients_freeze_identity
  before update on public.clients
  for each row execute function public.clients_freeze_identity();

-- ---------------------------------------------------------------------------
-- Domain registrations — one active submission per client, editable in place.
-- ---------------------------------------------------------------------------
create table if not exists public.domain_registrations (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid not null references public.clients(id) on delete cascade,
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

  -- Third-party owner details are mandatory when the client is not the owner.
  -- Enforced here as well as in zod so a raw API call cannot skip them.
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

-- "One active submission at a time" is a data rule, so the database enforces
-- it. This is also what makes the portal's upsert safe against double-submit.
create unique index if not exists domain_registrations_client_uniq
  on public.domain_registrations (client_id);

alter table public.domain_registrations enable row level security;

drop policy if exists "Clients read own registration" on public.domain_registrations;
create policy "Clients read own registration" on public.domain_registrations
  for select to authenticated
  using (client_id = public.current_client_id() or public.is_staff());

drop policy if exists "Clients create own registration" on public.domain_registrations;
create policy "Clients create own registration" on public.domain_registrations
  for insert to authenticated
  with check (client_id = public.current_client_id() or public.is_staff());

drop policy if exists "Clients update own registration" on public.domain_registrations;
create policy "Clients update own registration" on public.domain_registrations
  for update to authenticated
  using (client_id = public.current_client_id() or public.is_staff())
  with check (client_id = public.current_client_id() or public.is_staff());

-- `status` is a staff decision. A client editing their own submission must not
-- be able to mark it "reviewed", so freeze it for non-staff.
create or replace function public.domain_registrations_guard()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_staff() then
    if new.client_id is distinct from old.client_id then
      raise exception 'client_id is not editable.';
    end if;
    -- A client edit re-opens the submission for review rather than keeping a
    -- stale "reviewed" badge on changed details.
    new.status := case when old.status = 'submitted' then old.status else 'submitted' end;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists domain_registrations_guard on public.domain_registrations;
create trigger domain_registrations_guard
  before update on public.domain_registrations
  for each row execute function public.domain_registrations_guard();

-- ---------------------------------------------------------------------------
-- Messages — one thread per client, client <-> team.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients(id) on delete cascade,
  sender     text not null check (sender in ('client', 'admin')),
  body       text not null check (length(btrim(body)) between 1 and 4000),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_client_created_idx
  on public.messages (client_id, created_at);

alter table public.messages enable row level security;

drop policy if exists "Read own thread" on public.messages;
create policy "Read own thread" on public.messages
  for select to authenticated
  using (client_id = public.current_client_id() or public.is_staff());

-- The WITH CHECK on `sender` is the important half: without it a client could
-- insert a row with sender = 'admin' and forge a reply from the team.
drop policy if exists "Clients send as client" on public.messages;
create policy "Clients send as client" on public.messages
  for insert to authenticated
  with check (client_id = public.current_client_id() and sender = 'client');

drop policy if exists "Staff send as admin" on public.messages;
create policy "Staff send as admin" on public.messages
  for insert to authenticated
  with check (public.is_staff() and sender = 'admin');

drop policy if exists "Update read receipts" on public.messages;
create policy "Update read receipts" on public.messages
  for update to authenticated
  using (client_id = public.current_client_id() or public.is_staff())
  with check (client_id = public.current_client_id() or public.is_staff());

-- The UPDATE policy exists only so a reader can stamp `read_at`. Editing the
-- content of a delivered message — or rewriting who sent it — is not allowed.
create or replace function public.messages_read_receipt_only()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.body is distinct from old.body
     or new.sender is distinct from old.sender
     or new.client_id is distinct from old.client_id
     or new.created_at is distinct from old.created_at then
    raise exception 'Only read_at may be updated.';
  end if;
  return new;
end;
$$;

drop trigger if exists messages_read_receipt_only on public.messages;
create trigger messages_read_receipt_only
  before update on public.messages
  for each row execute function public.messages_read_receipt_only();

-- ---------------------------------------------------------------------------
-- Realtime. Subscribers receive only the rows their RLS policies allow, so a
-- client's socket cannot be made to leak another client's thread by tampering
-- with the client-side filter.
-- ---------------------------------------------------------------------------
alter table public.messages replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
