import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getClientDetail } from "@/lib/data/portal";
import StatusBadge from "@/components/portal/StatusBadge";
import RegistrationStatusActions from "@/components/admin/RegistrationStatusActions";
import AdminMessagePanel from "@/components/admin/AdminMessagePanel";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="w-56 shrink-0 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
        {label}
      </dt>
      <dd className="text-sm break-words">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getClientDetail(id);
  if (!detail) notFound();

  const { client, registration, messages } = detail;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-muted uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Clients
        </Link>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">
          {client.full_name}
        </h1>
        {client.company_name && (
          <p className="mt-1 text-sm text-muted">{client.company_name}</p>
        )}
      </div>

      <section>
        <h2 className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
          Contact
        </h2>
        <dl className="mt-3">
          <Row label="Email" value={client.email} />
          <Row label="Phone" value={client.phone} />
        </dl>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
            Domain registration
          </h2>
          {registration && <StatusBadge status={registration.status} />}
        </div>

        {registration ? (
          <>
            <dl className="mt-3">
              <Row label="Domain name" value={registration.domain_name} />
              <Row
                label="Client is the owner"
                value={registration.is_owner ? "Yes" : "No"}
              />
              {!registration.is_owner && (
                <>
                  <Row label="Owner name" value={registration.owner_name} />
                  <Row
                    label="Owner NIC/PP number"
                    value={registration.owner_nic_or_passport}
                  />
                  <Row label="Owner email" value={registration.owner_email} />
                  <Row
                    label="Owner contact number"
                    value={registration.owner_contact_number}
                  />
                </>
              )}
            </dl>
            <div className="mt-5">
              <RegistrationStatusActions registrationId={registration.id} />
            </div>
          </>
        ) : (
          <p className="mt-3 rounded-lg border border-border bg-surface/40 px-4 py-6 text-center text-sm text-muted">
            This client hasn&rsquo;t submitted a domain registration yet.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
          Messages
        </h2>
        <AdminMessagePanel
          clientId={client.id}
          clientName={client.full_name}
          initialMessages={messages}
        />
      </section>
    </div>
  );
}
