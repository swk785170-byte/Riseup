import { getAdminInquiries } from "@/lib/data/inquiries";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import InquiriesTable from "@/components/admin/InquiriesTable";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();
  const configured = isSupabaseConfigured();
  const unhandled = inquiries.filter((i) => !i.handled).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Enquiries</h1>
      <p className="mt-1 text-sm text-muted">
        {inquiries.length} total
        {inquiries.length > 0 && ` · ${unhandled} awaiting reply`}
      </p>

      {!configured && (
        <p className="mt-6 rounded-xl border border-taupe bg-surface px-4 py-3 text-sm text-charcoal">
          Supabase isn&rsquo;t configured yet — add your keys and run{" "}
          <code className="font-mono text-[13px]">
            supabase/migrations/0007_inquiries.sql
          </code>
          .
        </p>
      )}

      <div className="mt-8">
        <InquiriesTable initialInquiries={inquiries} />
      </div>
    </div>
  );
}
