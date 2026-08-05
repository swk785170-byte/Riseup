import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminTeamMembers } from "@/lib/data/site";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import TeamTable from "@/components/admin/TeamTable";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [members, sp] = await Promise.all([
    getAdminTeamMembers(),
    searchParams,
  ]);
  const configured = isSupabaseConfigured();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-muted">
            {members.length} member{members.length === 1 ? "" : "s"} on the
            About page
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12px] font-bold tracking-[0.14em] text-background uppercase transition-colors hover:bg-charcoal"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Member
        </Link>
      </div>

      {sp.saved === "1" && (
        <p className="mt-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground">
          Team member saved.
        </p>
      )}

      {!configured && (
        <p className="mt-6 rounded-xl border border-taupe bg-surface px-4 py-3 text-sm text-charcoal">
          Supabase isn&rsquo;t configured yet — add your keys and run{" "}
          <code className="font-mono text-[13px]">
            supabase/migrations/0005_team_gallery_settings.sql
          </code>
          .
        </p>
      )}

      <div className="mt-8">
        <TeamTable initialMembers={members} />
      </div>
    </div>
  );
}
