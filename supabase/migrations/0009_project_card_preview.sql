-- ===========================================================================
-- Riseup Solutions — curated card previews.
--
-- `card_preview_url` is a pre-cropped image used ONLY on card thumbnails
-- (homepage row + /projects grid). The full screenshots stay in
-- `gallery_urls` for the case-study modal. Both columns are nullable: a
-- project without them falls back to `thumbnail_url` and the default palette
-- tint, so nothing breaks while the team backfills curated crops.
--
-- `accent_bg` is the backdrop behind the framed mockup, so dark-UI and
-- light-UI screenshots each sit on an intentional surface instead of clashing
-- with the raw card fill.
-- ===========================================================================

alter table public.projects
  add column if not exists card_preview_url text,
  add column if not exists accent_bg text;

comment on column public.projects.card_preview_url is
  'Focused crop shown on card previews only. Falls back to thumbnail_url.';
comment on column public.projects.accent_bg is
  'Hex backdrop behind the card mockup, e.g. #F1EEE6. Falls back to the palette default.';
