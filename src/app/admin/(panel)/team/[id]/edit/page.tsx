import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TeamForm from "@/components/admin/TeamForm";
import { getAdminTeamMemberById } from "@/lib/data/site";
import type { TeamMemberFormValues } from "@/lib/schemas/site";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminTeamMemberById(id);
  if (!row) notFound();

  const values: TeamMemberFormValues = {
    name: row.name,
    role: row.role ?? "",
    photo_url: row.photo_url ?? "",
    instagram_url: row.instagram_url ?? "",
    linkedin_url: row.linkedin_url ?? "",
    website_url: row.website_url ?? "",
    sort_order: row.sort_order,
  };

  return (
    <div>
      <Link
        href="/admin/team"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to team
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        Edit team member
      </h1>
      <p className="mt-1 mb-8 text-sm text-muted">{row.name}</p>
      <TeamForm mode="edit" memberId={id} defaultValues={values} />
    </div>
  );
}
