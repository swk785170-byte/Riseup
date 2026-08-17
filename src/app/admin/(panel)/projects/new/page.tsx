import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import type { ProjectFormValues } from "@/lib/schemas/project";

const emptyProject: ProjectFormValues = {
  title: "",
  client_name: "",
  category: "Web Development",
  tag: "",
  year: new Date().getFullYear(),
  description: "",
  challenge: "",
  solution: "",
  results: [],
  tags: [],
  thumbnail_url: "",
  card_preview_url: "",
  accent_bg: "",
  gallery_urls: [],
  featured: false,
  is_lms: false,
  sort_order: 0,
};

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to projects
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        Add a project to the portfolio.
      </p>
      <ProjectForm mode="create" defaultValues={emptyProject} />
    </div>
  );
}
