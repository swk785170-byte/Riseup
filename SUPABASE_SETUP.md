# Admin panel — Supabase setup

The public site works out of the box on the built-in `SEED_PROJECTS`. To turn on
the database + admin panel, do the following once.

## 1. Create the Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (server only)
3. Copy `.env.example` to `.env.local` and paste the three values in.

## 2. Create the schema + storage

In the Supabase dashboard → **SQL Editor**, paste and run the contents of
[`supabase/migrations/0001_projects.sql`](supabase/migrations/0001_projects.sql).
It creates the `projects` table, RLS policies, the `updated_at` trigger, and the
public `project-images` storage bucket with policies.

## 3. Enable email/password auth + create an admin user

1. **Authentication → Providers → Email**: enable it. Turn **off** "Enable sign
   ups" — this is an internal tool, accounts are created manually.
2. **Authentication → Users → Add user** → create your admin (email + password,
   mark "Auto Confirm").

There is intentionally **no public sign-up page**.

## 4. Seed the starter projects (optional but recommended)

With `.env.local` filled in, load the 11 built-in projects into the DB:

```bash
npx tsx scripts/seed-projects.ts
```

It skips if the table already has rows. After this the public site renders the
same portfolio, now from the database.

## 5. Use it

- Visit `/admin/login`, sign in with the user you created.
- Add / edit / delete / reorder projects at `/admin/projects`.
- Saving revalidates `/`, `/projects` and `/services/lms` immediately.

---

## Notes / decisions

- **Schema deviations** (to keep the public cards' CSS-mock artwork + structured
  metric results unchanged): `results` is `jsonb` (`[{ value, label }]`) not
  plain text, and `tags` is `text[]`. `category` is the discipline (drives the
  `/projects` filter + the derived mock/tint); `tag` is the small card sub-label.
- **Derived, not stored**: the card mock style, tint and filter tags are derived
  from `category` in `lib/projects.ts` (`mapRowToProject`) — the admin form
  doesn't edit them. `thumbnail_url` / `gallery_urls` are stored for future use
  but the public cards keep their CSS mocks (per the chosen reconciliation).
- **Security**: reads use the anon/public client (RLS: public can select). All
  writes run in server actions, gated by a session check, using the service-role
  key which never reaches the browser.
- **Fallback**: if the DB is unreachable or unconfigured, the public pages fall
  back to `SEED_PROJECTS` so the site never breaks.
