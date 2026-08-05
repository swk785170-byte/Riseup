-- ===========================================================================
-- Rise Up Media — server-side upload restrictions.
--
-- The admin panel validates file type and size in the browser, but uploads go
-- directly from the browser to Supabase Storage, so a modified client can skip
-- those checks entirely. These bucket-level limits are enforced by Storage
-- itself and cannot be bypassed from the client.
--
-- SVG is deliberately excluded from every bucket: SVG is XML and can carry
-- <script>, which would be stored XSS served from the Storage origin.
-- ===========================================================================

update storage.buckets
set
  file_size_limit = 5242880, -- 5 MB, matching IMAGE_MAX_BYTES in the app
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ]
where id in ('project-images', 'client-logos', 'team-photos', 'gallery-images');

-- Confirm the buckets are public-read only (never public-write). Writes remain
-- gated by the "Authenticated manage …" policies created in earlier migrations.
update storage.buckets
set public = true
where id in ('project-images', 'client-logos', 'team-photos', 'gallery-images');
