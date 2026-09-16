-- ===========================================================================
-- Riseup Solutions — Phase 7: two client forms
--
--   1. Domain Registration — six fields, ALL required.
--   2. SMS Lenz Approval   — all optional: sender ID, address, both sides of
--      the ID card, and a logo.
--
-- Both are presented as one form with two tabs and a single submit, so a
-- client fills them in one pass without losing what they typed.
--
-- NOTE ON THE DOMAIN REGISTRATION RESHAPE
-- The brief said to replace the `domain_registrations` table. It is NOT dropped
-- here: it already holds three real client submissions (including a live one
-- from Chandana Jayasinghe), and dropping the table would destroy them. The new
-- columns are added alongside, the old ones are backfilled into them where a
-- sensible mapping exists, and the legacy columns are kept so nothing is lost.
--
-- Both tables stay keyed on `link_id`, not `client_id`. The login-based client
-- portal was removed in 0011 in favour of admin-minted secret links, so there
-- is no `clients` table to reference.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Domain registration — the Phase 7 field set
-- ---------------------------------------------------------------------------
alter table public.domain_registrations
  add column if not exists business_name text,
  add column if not exists full_name     text,
  add column if not exists email         text,
  add column if not exists phone_number  text,
  add column if not exists address       text,
  add column if not exists id_number     text;

/*
 * Deliberately NO backfill.
 *
 * Copying the old owner_* values across would fill four of the six new columns
 * (full_name, email, phone_number, id_number) while leaving business_name and
 * address null — there is no source for those. That is a partial row, which
 * the all-or-nothing constraint below rejects, so the migration would fail on
 * the existing data.
 *
 * Legacy rows therefore keep all six new columns null (the "none" branch) and
 * their answers stay in the owner_* columns, where the admin detail page
 * already displays them and the client form already prefills from them.
 */

-- `domain_name` loses its NOT NULL: the Phase 7 form no longer collects it,
-- but the column and its existing values are kept for the legacy rows.
alter table public.domain_registrations
  alter column domain_name drop not null;

/*
 * All-or-nothing integrity.
 *
 * The six fields cannot be NOT NULL — that would reject the three rows that
 * predate this migration. What IS enforceable, and is the rule that actually
 * matters, is that a Phase 7 submission can never be partial: either all six
 * are present, or none of them are (a legacy row). A tampered request that
 * skips a field is rejected by the database, not just by zod.
 */
alter table public.domain_registrations
  drop constraint if exists domain_registration_fields_complete;

alter table public.domain_registrations
  add constraint domain_registration_fields_complete check (
    (
      business_name is not null and length(btrim(business_name)) > 0
      and full_name is not null and length(btrim(full_name)) > 0
      and email is not null and length(btrim(email)) > 0
      and phone_number is not null and length(btrim(phone_number)) > 0
      and address is not null and length(btrim(address)) > 0
      and id_number is not null and length(btrim(id_number)) > 0
    )
    or (
      business_name is null and full_name is null and email is null
      and phone_number is null and address is null and id_number is null
    )
  );

-- The old conditional-owner rule no longer applies: that branching is gone.
alter table public.domain_registrations
  drop constraint if exists owner_details_required;

-- ---------------------------------------------------------------------------
-- 2. SMS Lenz approval — every field optional by design
-- ---------------------------------------------------------------------------
create table if not exists public.sms_lenz_approvals (
  id                uuid primary key default gen_random_uuid(),

  -- One submission per link, editable in place, matching domain_registrations.
  link_id           uuid not null unique
                      references public.registration_links(id) on delete cascade,

  sender_id          text check (sender_id is null or length(sender_id) <= 80),
  address            text check (address is null or length(address) <= 400),
  -- Both sides of the ID card, plus the logo. All optional.
  id_card_front_url  text check (id_card_front_url is null or length(id_card_front_url) <= 1000),
  id_card_back_url   text check (id_card_back_url is null or length(id_card_back_url) <= 1000),
  logo_url           text check (logo_url is null or length(logo_url) <= 1000),

  status            text not null default 'submitted'
                      check (status in ('submitted', 'reviewed', 'needs_info')),
  submitted_at      timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.sms_lenz_approvals enable row level security;
-- Intentionally no policies — deny-all for anon and authenticated, exactly as
-- `domain_registrations` and `registration_links` are set up in 0011. All
-- access runs through server code holding the service role, and only after the
-- URL token has been validated.

create trigger sms_lenz_approvals_touch
  before update on public.sms_lenz_approvals
  for each row execute function public.touch_domain_registration();

-- ---------------------------------------------------------------------------
-- 3. Storage for the two optional uploads
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('sms-lenz-uploads', 'sms-lenz-uploads', true)
on conflict (id) do nothing;

/*
 * Same hardening as the other buckets (0006): public READ so the admin panel
 * can preview a submitted photo, never public WRITE. Uploads are performed
 * server-side with the service role after the link token has been checked, so
 * no storage policy grants insert to anon or authenticated here.
 *
 * SVG is excluded deliberately — it is XML and can carry <script>, which would
 * be stored XSS served from the Storage origin.
 */
update storage.buckets
set
  file_size_limit = 5242880, -- 5 MB
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ],
  public = true
where id = 'sms-lenz-uploads';
