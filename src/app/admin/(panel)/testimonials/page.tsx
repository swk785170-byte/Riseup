import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminTestimonials } from "@/lib/data/testimonials";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import TestimonialsTable from "@/components/admin/TestimonialsTable";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [testimonials, sp] = await Promise.all([
    getAdminTestimonials(),
    searchParams,
  ]);
  const configured = isSupabaseConfigured();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-muted">
            {testimonials.length} testimonial
            {testimonials.length === 1 ? "" : "s"} in the homepage marquee
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12px] font-bold tracking-[0.14em] text-background uppercase transition-colors hover:bg-charcoal"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Testimonial
        </Link>
      </div>

      {sp.saved === "1" && (
        <p className="mt-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground">
          Testimonial saved.
        </p>
      )}

      {!configured && (
        <p className="mt-6 rounded-xl border border-taupe bg-surface px-4 py-3 text-sm text-charcoal">
          Supabase isn&rsquo;t configured yet — add your keys and run{" "}
          <code className="font-mono text-[13px]">
            supabase/migrations/0004_testimonials.sql
          </code>
          . See <code className="font-mono text-[13px]">SUPABASE_SETUP.md</code>
          .
        </p>
      )}

      <div className="mt-8">
        <TestimonialsTable initialTestimonials={testimonials} />
      </div>
    </div>
  );
}
