-- ===========================================================================
-- Rise Up Media — testimonials (homepage "Client Stories" marquee) + RLS.
-- Same policy pattern as `projects` / `client_logos`: public read,
-- authenticated-only write. Avatar photos reuse the `client-logos` bucket.
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  quote      text not null,
  rating     int  not null default 5 check (rating between 1 and 5),
  -- Optional client photo; falls back to initials when null.
  avatar_url text,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_sort_idx
  on public.testimonials (sort_order asc);

alter table public.testimonials enable row level security;

drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials" on public.testimonials
  for select using (true);

drop policy if exists "Authenticated users can manage testimonials" on public.testimonials;
create policy "Authenticated users can manage testimonials" on public.testimonials
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Seed with the four real client testimonials (safe to re-run)
-- ---------------------------------------------------------------------------
insert into public.testimonials (name, role, quote, rating, sort_order)
select * from (values
  ('Asela Ranasingha', 'Founder, AR',
   'Rise Up Media rebuilt our site from the ground up and it finally looks like the business we actually are. Inquiries picked up within the first month and it hasn''t slowed down since.', 5, 0),
  ('Rajika Wimalarathne', 'Director, Biozone',
   'What stood out was how little hand-holding it took — they understood what we needed almost immediately and delivered a site that''s fast, clean, and easy for our own team to update.', 5, 1),
  ('Wasula Kumarasiri', 'Principal, Wasula Institute',
   'Moving our classes onto their LMS cut our admin workload dramatically. Attendance, notices, and payments used to eat up hours every week — now it''s mostly automatic.', 5, 2),
  ('Sagara Balasooriya', 'Founder, Sagara Academy',
   'The Smart Card system alone was worth it — attendance that used to take fifteen minutes at the start of every class now takes seconds, and parents get notified instantly.', 5, 3)
) as seed(name, role, quote, rating, sort_order)
where not exists (select 1 from public.testimonials);
