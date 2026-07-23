import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProjects } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import ProjectsTable from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [projects, sp] = await Promise.all([
    getAdminProjects(),
    searchParams,
  ]);
  const configured = isSupabaseConfigured();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12px] font-bold tracking-[0.14em] text-background uppercase transition-colors hover:bg-charcoal"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Project
        </Link>
      </div>

      {sp.saved === "1" && (
        <p className="mt-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground">
          Project saved.
        </p>
      )}

      {!configured && (
        <p className="mt-6 rounded-xl border border-taupe bg-surface px-4 py-3 text-sm text-charcoal">
          Supabase isn&rsquo;t configured yet — add your keys to{" "}
          <code className="font-mono text-[13px]">.env.local</code>, run the SQL
          migration, then seed. See{" "}
          <code className="font-mono text-[13px]">SUPABASE_SETUP.md</code>.
        </p>
      )}

      <div className="mt-8">
        <ProjectsTable initialProjects={projects} />
      </div>
    </div>
  );
}
