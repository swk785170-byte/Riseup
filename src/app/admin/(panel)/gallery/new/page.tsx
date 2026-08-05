import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GalleryForm from "@/components/admin/GalleryForm";
import type { GalleryImageFormValues } from "@/lib/schemas/site";

const emptyImage: GalleryImageFormValues = {
  image_url: "",
  alt: "",
  sort_order: 0,
};

export default function NewGalleryImagePage() {
  return (
    <div>
      <Link
        href="/admin/gallery"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to gallery
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New photo</h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        Add a behind-the-scenes photo to the About page.
      </p>
      <GalleryForm mode="create" defaultValues={emptyImage} />
    </div>
  );
}
