import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GalleryForm from "@/components/admin/GalleryForm";
import { getAdminGalleryImageById } from "@/lib/data/site";
import type { GalleryImageFormValues } from "@/lib/schemas/site";

export const dynamic = "force-dynamic";

export default async function EditGalleryImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminGalleryImageById(id);
  if (!row) notFound();

  const values: GalleryImageFormValues = {
    image_url: row.image_url,
    alt: row.alt ?? "",
    sort_order: row.sort_order,
  };

  return (
    <div>
      <Link
        href="/admin/gallery"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to gallery
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Edit photo</h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        {row.alt || "Gallery photo"}
      </p>
      <GalleryForm mode="edit" imageId={id} defaultValues={values} />
    </div>
  );
}
