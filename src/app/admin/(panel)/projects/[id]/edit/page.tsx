import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminProjectById } from "@/lib/data/projects";
import { CATEGORY_OPTIONS, type ProjectFormValues } from "@/lib/schemas/project";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminProjectById(id);
  if (!row) notFound();

  const isValidCategory = (CATEGORY_OPTIONS as readonly string[]).includes(
    row.category,
  );
  const category = isValidCategory
    ? (row.category as (typeof CATEGORY_OPTIONS)[number])
    : "Web Development";

  const values: ProjectFormValues = {
    title: row.title,
    client_name: row.client_name,
    category,
    tag: row.tag ?? "",
    year: row.year,
    description: row.description ?? "",
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    results: row.results ?? [],
    tags: row.tags ?? [],
    thumbnail_url: row.thumbnail_url ?? "",
    card_preview_url: row.card_preview_url ?? "",
    accent_bg: row.accent_bg ?? "",
    gallery_urls: row.gallery_urls ?? [],
    featured: row.featured,
    is_lms: row.is_lms,
    sort_order: row.sort_order,
  };

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to projects
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
      <p className="mt-1 mb-8 text-sm text-muted">{row.title}</p>
      <ProjectForm mode="edit" projectId={id} defaultValues={values} />
    </div>
  );
}
