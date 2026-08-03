import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ClientLogoForm from "@/components/admin/ClientLogoForm";
import { getAdminClientLogoById } from "@/lib/data/client-logos";
import type { ClientLogoFormValues } from "@/lib/schemas/client-logo";

export const dynamic = "force-dynamic";

export default async function EditClientLogoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminClientLogoById(id);
  if (!row) notFound();

  const values: ClientLogoFormValues = {
    name: row.name,
    logo_url: row.logo_url ?? "",
    sort_order: row.sort_order,
  };

  return (
    <div>
      <Link
        href="/admin/client-logos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to client logos
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        Edit client logo
      </h1>
      <p className="mt-1 mb-8 text-sm text-muted">{row.name}</p>
      <ClientLogoForm mode="edit" logoId={id} defaultValues={values} />
    </div>
  );
}
