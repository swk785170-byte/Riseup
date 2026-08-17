-- ===========================================================================
-- Riseup Solutions — enable Supabase Realtime for the admin notification bell.
--
-- Realtime honours RLS: the `inquiries` select policy already requires an
-- authenticated session, so change events are only delivered to signed-in
-- admins. Anonymous visitors can still INSERT (submit the form) but receive
-- nothing back on the socket.
-- ===========================================================================

-- Add the table to the realtime publication (idempotent).
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'inquiries'
  ) then
    alter publication supabase_realtime add table public.inquiries;
  end if;
end
$$;

-- UPDATE/DELETE payloads carry only the primary key unless replica identity is
-- FULL. The bell needs the `handled` flag on updates to add/remove items
-- correctly, so send the whole row. Volume here is tiny, so the extra WAL is
-- negligible.
alter table public.inquiries replica identity full;
