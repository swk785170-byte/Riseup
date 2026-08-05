-- ===========================================================================
-- Rise Up Media — team members, About gallery, and site-wide settings.
-- Same policy pattern as every other table: public read, authenticated write.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Team members (About page)
-- ---------------------------------------------------------------------------
create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text,
  photo_url     text,
  instagram_url text,
  linkedin_url  text,
  website_url   text,
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists team_members_sort_idx
  on public.team_members (sort_order asc);

alter table public.team_members enable row level security;

drop policy if exists "Public can read team members" on public.team_members;
create policy "Public can read team members" on public.team_members
  for select using (true);

drop policy if exists "Authenticated users can manage team members" on public.team_members;
create policy "Authenticated users can manage team members" on public.team_members
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Gallery images (About page)
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  alt        text,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_sort_idx
  on public.gallery_images (sort_order asc);

alter table public.gallery_images enable row level security;

drop policy if exists "Public can read gallery images" on public.gallery_images;
create policy "Public can read gallery images" on public.gallery_images
  for select using (true);

drop policy if exists "Authenticated users can manage gallery images" on public.gallery_images;
create policy "Authenticated users can manage gallery images" on public.gallery_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Site settings — a single row (id is pinned to 1) holding the contact email,
-- WhatsApp number and company social links used across the whole site.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id              int primary key default 1 check (id = 1),
  email           text not null default 'hello@riseupmedia.com',
  -- International format, digits only, no "+" (e.g. 94771234567).
  whatsapp_number text default '',
  instagram_url   text default '',
  facebook_url    text default '',
  linkedin_url    text default '',
  youtube_url     text default '',
  updated_at      timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings
  for select using (true);

drop policy if exists "Authenticated users can manage site settings" on public.site_settings;
create policy "Authenticated users can manage site settings" on public.site_settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage buckets (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('team-photos', 'team-photos', true),
  ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read team photos" on storage.objects;
create policy "Public read team photos" on storage.objects
  for select using (bucket_id = 'team-photos');

drop policy if exists "Authenticated manage team photos" on storage.objects;
create policy "Authenticated manage team photos" on storage.objects
  for all using (bucket_id = 'team-photos' and auth.role() = 'authenticated')
  with check (bucket_id = 'team-photos' and auth.role() = 'authenticated');

drop policy if exists "Public read gallery images" on storage.objects;
create policy "Public read gallery images" on storage.objects
  for select using (bucket_id = 'gallery-images');

drop policy if exists "Authenticated manage gallery images" on storage.objects;
create policy "Authenticated manage gallery images" on storage.objects
  for all using (bucket_id = 'gallery-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Seeds (safe to re-run)
-- ---------------------------------------------------------------------------
insert into public.team_members (name, role, photo_url, sort_order)
select * from (values
  ('Nejan',   'Co-Founder, Developer',          '/team/nejm.jpg',   0),
  ('Bathila', 'Backend Developer, Tech Lead',   '/team/bakhta.jpg', 1),
  ('Sudam',   'UI Designer, Co-Founder',        '/team/sida.jpg',   2)
) as seed(name, role, photo_url, sort_order)
where not exists (select 1 from public.team_members);

insert into public.site_settings (id, email, instagram_url, facebook_url, linkedin_url, youtube_url)
values (
  1,
  'hello@riseupmedia.com',
  'https://instagram.com/riseupmedia',
  'https://facebook.com/riseupmedia',
  'https://linkedin.com/company/riseupmedia',
  'https://youtube.com/@riseupmedia'
)
on conflict (id) do nothing;
