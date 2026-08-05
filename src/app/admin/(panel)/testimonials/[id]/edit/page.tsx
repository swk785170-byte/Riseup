import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { getAdminTestimonialById } from "@/lib/data/testimonials";
import type { TestimonialFormValues } from "@/lib/schemas/testimonial";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminTestimonialById(id);
  if (!row) notFound();

  const values: TestimonialFormValues = {
    name: row.name,
    role: row.role ?? "",
    quote: row.quote,
    rating: row.rating,
    avatar_url: row.avatar_url ?? "",
    sort_order: row.sort_order,
  };

  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to testimonials
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        Edit testimonial
      </h1>
      <p className="mt-1 mb-8 text-sm text-muted">{row.name}</p>
      <TestimonialForm
        mode="edit"
        testimonialId={id}
        defaultValues={values}
      />
    </div>
  );
}
