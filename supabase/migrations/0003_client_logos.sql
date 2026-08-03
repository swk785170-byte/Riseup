-- ===========================================================================
-- Rise Up Media — client logos (homepage "Trusted by" marquee) + RLS.
-- Run after 0001_projects.sql. Same policy pattern as `projects`:
-- public read, authenticated-only write.
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists public.client_logos (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  -- Supabase Storage public URL. Nullable so a text-only wordmark renders
  -- while real logo images are still being collected.
  logo_url   text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists client_logos_sort_idx
  on public.client_logos (sort_order asc);

alter table public.client_logos enable row level security;

drop policy if exists "Public can read client logos" on public.client_logos;
create policy "Public can read client logos" on public.client_logos
  for select using (true);

drop policy if exists "Authenticated users can manage client logos" on public.client_logos;
create policy "Authenticated users can manage client logos" on public.client_logos
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage bucket for client logo images (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('client-logos', 'client-logos', true)
on conflict (id) do nothing;

drop policy if exists "Public read client logos" on storage.objects;
create policy "Public read client logos" on storage.objects
  for select using (bucket_id = 'client-logos');

drop policy if exists "Authenticated manage client logos" on storage.objects;
create policy "Authenticated manage client logos" on storage.objects
  for all
  using (bucket_id = 'client-logos' and auth.role() = 'authenticated')
  with check (bucket_id = 'client-logos' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Seed with the current hardcoded marquee set (safe to re-run)
-- ---------------------------------------------------------------------------
insert into public.client_logos (name, logo_url, sort_order)
select * from (values
  ('AR',         '/clients/ar.svg',      0),
  ('Sispira',    '/clients/sispira.svg', 1),
  ('Mathdoc',    '/clients/mathdoc.svg', 2),
  ('Wasula Sir', '/clients/wasula.svg',  3),
  ('Sagara Sir', '/clients/sagara.svg',  4),
  ('Biozone',    '/clients/biozone.svg', 5)
) as seed(name, logo_url, sort_order)
where not exists (select 1 from public.client_logos);
