-- ===========================================================================
-- Rise Up Media — blog posts table + RLS. Run after 0001_projects.sql.
-- Cover images reuse the existing `project-images` storage bucket.
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  cover_url    text,
  body         text,
  author       text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published, published_at desc);

-- reuse (or (re)create) the shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts" on public.posts
  for select using (published = true);

drop policy if exists "Authenticated users can manage posts" on public.posts;
create policy "Authenticated users can manage posts" on public.posts
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
