import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TestimonialForm from "@/components/admin/TestimonialForm";
import type { TestimonialFormValues } from "@/lib/schemas/testimonial";

const emptyTestimonial: TestimonialFormValues = {
  name: "",
  role: "",
  quote: "",
  rating: 5,
  avatar_url: "",
  sort_order: 0,
};

export default function NewTestimonialPage() {
  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to testimonials
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        New testimonial
      </h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        Add a client quote to the homepage.
      </p>
      <TestimonialForm mode="create" defaultValues={emptyTestimonial} />
    </div>
  );
}
