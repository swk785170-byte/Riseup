-- ===========================================================================
-- Riseup Solutions — contact form submissions.
--
-- RLS differs from every other table here: the public must be able to WRITE
-- (that's the point of a contact form) but must never be able to READ, or
-- anyone could harvest every enquiry. So:
--   anon  → insert only
--   authenticated → select / update / delete (admin panel)
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  project_type text not null default 'Other',
  message      text not null,
  handled      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists inquiries_created_idx
  on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

-- Public submit: INSERT only. No select policy for anon, so submissions are
-- write-only from the outside world.
drop policy if exists "Anyone can submit an inquiry" on public.inquiries;
create policy "Anyone can submit an inquiry" on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

-- Reading/managing requires an authenticated session (admin panel only).
drop policy if exists "Authenticated users can read inquiries" on public.inquiries;
create policy "Authenticated users can read inquiries" on public.inquiries
  for select using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can manage inquiries" on public.inquiries;
create policy "Authenticated users can manage inquiries" on public.inquiries
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
