import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClientLogoForm from "@/components/admin/ClientLogoForm";
import type { ClientLogoFormValues } from "@/lib/schemas/client-logo";

const emptyLogo: ClientLogoFormValues = {
  name: "",
  logo_url: "",
  sort_order: 0,
};

export default function NewClientLogoPage() {
  return (
    <div>
      <Link
        href="/admin/client-logos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to client logos
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">New client logo</h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        Add a client to the homepage marquee.
      </p>
      <ClientLogoForm mode="create" defaultValues={emptyLogo} />
    </div>
  );
}
