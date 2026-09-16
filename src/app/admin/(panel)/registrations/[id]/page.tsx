import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLinkDetail } from "@/lib/data/registrations";
import { isLegacyRegistration, linkState } from "@/lib/registrations";
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

/** Thumbnail for an uploaded file, or a note that none was attached. */
function UploadPreview({
  label,
  url,
}: {
  label: string;
  url: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
        {label}
      </p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block h-40 w-full max-w-64 overflow-hidden border border-border bg-surface transition-colors hover:border-foreground"
        >
          <Image
            src={url}
            alt={label}
            fill
            sizes="256px"
            className="object-contain p-2"
          />
        </a>
      ) : (
        <p className="text-sm text-muted">Not uploaded</p>
      )}
    </div>
  );
}

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getLinkDetail(id);
  if (!detail) notFound();

  const { link, registration, smsLenz } = detail;
  const state = linkState(link);

  // A submission from before the form was reshaped has no business name; its
  // data lives in the legacy columns instead.
  const legacy = registration ? isLegacyRegistration(registration) : false;

  const requiredComplete = Boolean(
    registration &&
      registration.business_name &&
      registration.full_name &&
      registration.email &&
      registration.phone_number &&
      registration.address &&
      registration.id_number,
  );

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

      {/* ---------------- Domain Registration (required) ---------------- */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
            Domain Registration
            <span className="ml-2 font-normal normal-case text-muted">
              required
            </span>
          </h2>
          <div className="flex items-center gap-2">
            {registration && (
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase ${
                  requiredComplete
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/40 bg-background text-foreground"
                }`}
              >
                {requiredComplete ? "Complete" : "Incomplete"}
              </span>
            )}
            {registration && <StatusBadge status={registration.status} />}
          </div>
        </div>

        {registration ? (
          <>
            <dl className="mt-3">
              <Row label="Business" value={registration.business_name} />
              <Row label="Full name" value={registration.full_name} />
              <Row label="Email" value={registration.email} />
              <Row label="Phone no." value={registration.phone_number} />
              <Row label="Address" value={registration.address} />
              <Row label="ID number" value={registration.id_number} />
              <Row label="Submitted" value={stamp(registration.submitted_at)} />
              <Row label="Last updated" value={stamp(registration.updated_at)} />
            </dl>

            {legacy && (
              <div className="mt-4 rounded-lg border border-foreground/30 bg-surface px-4 py-3">
                <p className="text-sm">
                  Submitted on the previous version of this form, which asked
                  different questions. The original answers are kept below —
                  ask the client to reopen their link to complete the current
                  fields.
                </p>
                <dl className="mt-3">
                  <Row label="Domain name" value={registration.domain_name} />
                  <Row
                    label="Client was the owner"
                    value={registration.is_owner ? "Yes" : "No"}
                  />
                  <Row label="Owner name" value={registration.owner_name} />
                  <Row
                    label="Owner NIC/PP"
                    value={registration.owner_nic_or_passport}
                  />
                  <Row label="Owner email" value={registration.owner_email} />
                  <Row
                    label="Owner contact"
                    value={registration.owner_contact_number}
                  />
                </dl>
              </div>
            )}
          </>
        ) : (
          <p className="mt-3 rounded-lg border border-border bg-surface/40 px-4 py-6 text-center text-sm text-muted">
            Nothing submitted through this link yet.
          </p>
        )}
      </section>

      {/* ---------------- SMS Lenz Approval (optional) ---------------- */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
            SMS Lenz Approval
            <span className="ml-2 font-normal normal-case text-muted">
              optional
            </span>
          </h2>
          {smsLenz && <StatusBadge status={smsLenz.status} />}
        </div>

        {smsLenz ? (
          <>
            <dl className="mt-3">
              <Row label="Sender ID" value={smsLenz.sender_id} />
              <Row label="Address" value={smsLenz.address} />
              <Row label="Submitted" value={stamp(smsLenz.submitted_at)} />
              <Row label="Last updated" value={stamp(smsLenz.updated_at)} />
            </dl>
            <div className="mt-5 flex flex-wrap gap-8">
              <UploadPreview
                label="ID card — front"
                url={smsLenz.id_card_front_url}
              />
              <UploadPreview
                label="ID card — back"
                url={smsLenz.id_card_back_url}
              />
              <UploadPreview label="Logo" url={smsLenz.logo_url} />
            </div>
          </>
        ) : (
          <p className="mt-3 rounded-lg border border-border bg-surface/40 px-4 py-6 text-center text-sm text-muted">
            Not submitted — this form is optional, so the client may have
            skipped it deliberately.
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
