-- ===========================================================================
-- Rise Up Media — projects table, RLS policies and image storage bucket.
-- Run this in the Supabase SQL editor (or via the CLI) once.
--
-- Deviations from the original spec (intentional, to keep the public site's
-- CSS mock artwork + structured metric results rendering unchanged):
--   * `results` is jsonb (array of { value, label }) instead of plain text.
--   * `tags`   is text[] (tech chips shown in the case-study modal).
--   * `tag`    is the card sub-label (e.g. "Corporate", "D2C Brand");
--     `category` is the discipline that drives filtering + derived artwork.
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  client_name   text not null,
  category      text not null,                       -- Web Design | Web Development | E-Commerce | SEO & Growth | LMS
  tag           text,                                -- card sub-label, e.g. "Corporate"
  year          int  not null,
  description   text,                                -- short summary
  challenge     text,
  solution      text,
  results       jsonb not null default '[]'::jsonb,  -- [{ "value": "+212%", "label": "Online revenue" }]
  tags          text[] not null default '{}',        -- ["Next.js", "CRO", ...]
  thumbnail_url text,                                 -- Supabase Storage public URL
  gallery_urls  text[] not null default '{}',
  featured      boolean not null default false,      -- homepage FeaturedWork row
  is_lms        boolean not null default false,      -- LMS page Customers section
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists projects_sort_idx on public.projects (sort_order asc, year desc);

-- keep updated_at fresh on every update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects
  for select using (true);

drop policy if exists "Authenticated users can manage projects" on public.projects;
create policy "Authenticated users can manage projects" on public.projects
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage bucket for thumbnails + gallery images (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images" on storage.objects
  for select using (bucket_id = 'project-images');

drop policy if exists "Authenticated manage project images" on storage.objects;
create policy "Authenticated manage project images" on storage.objects
  for all
  using (bucket_id = 'project-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');
