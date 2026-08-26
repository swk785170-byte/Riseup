import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLinkDetail } from "@/lib/data/registrations";
import { linkState } from "@/lib/registrations";
import StatusBadge from "@/components/register/StatusBadge";
import LinkActions from "@/components/admin/LinkActions";

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

function stamp(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getLinkDetail(id);
  if (!detail) notFound();

  const { link, registration } = detail;
  const state = linkState(link);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href="/admin/registrations"
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-muted uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Registrations
        </Link>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">
          {link.client_name}
        </h1>
        {link.company_name && (
          <p className="mt-1 text-sm text-muted">{link.company_name}</p>
        )}
      </div>

      <section>
        <h2 className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
          Link
        </h2>
        <dl className="mt-3">
          <Row label="State" value={state} />
          <Row label="Expires" value={stamp(link.expires_at)} />
          <Row label="Created" value={stamp(link.created_at)} />
          <Row
            label="Last opened"
            value={stamp(link.last_opened_at) ?? "Never opened"}
          />
          <Row label="Revoked" value={stamp(link.revoked_at)} />
          <Row label="Email on file" value={link.client_email} />
          <Row label="Note" value={link.note} />
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          The URL itself is stored only as a hash and cannot be displayed again.
          To re-issue access, revoke this link and create a new one.
        </p>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
            Submission
          </h2>
          {registration && <StatusBadge status={registration.status} />}
        </div>

        {registration ? (
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
            <Row label="Submitted" value={stamp(registration.submitted_at)} />
            <Row label="Last updated" value={stamp(registration.updated_at)} />
          </dl>
        ) : (
          <p className="mt-3 rounded-lg border border-border bg-surface/40 px-4 py-6 text-center text-sm text-muted">
            Nothing submitted through this link yet.
          </p>
        )}
      </section>

      <section>
        <LinkActions
          linkId={link.id}
          registrationId={registration?.id ?? null}
          revoked={Boolean(link.revoked_at)}
        />
      </section>
    </div>
  );
}
