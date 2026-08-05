import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TeamForm from "@/components/admin/TeamForm";
import type { TeamMemberFormValues } from "@/lib/schemas/site";

const emptyMember: TeamMemberFormValues = {
  name: "",
  role: "",
  photo_url: "",
  instagram_url: "",
  linkedin_url: "",
  website_url: "",
  sort_order: 0,
};

export default function NewTeamMemberPage() {
  return (
    <div>
      <Link
        href="/admin/team"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to team
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New team member</h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        Add someone to the About page.
      </p>
      <TeamForm mode="create" defaultValues={emptyMember} />
    </div>
  );
}
