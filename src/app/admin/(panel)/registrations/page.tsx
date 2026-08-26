import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listRegistrationLinks } from "@/lib/data/registrations";
import { linkState } from "@/lib/registrations";
import StatusBadge from "@/components/register/StatusBadge";
import NewLinkForm from "@/components/admin/NewLinkForm";

export const dynamic = "force-dynamic";

function dateLabel(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

const STATE_TONE = {
  active: "border-taupe bg-surface text-foreground/70",
  expired: "border-taupe bg-background text-muted",
  revoked: "border-red-200 bg-red-50 text-red-700",
} as const;

export default async function AdminRegistrationsPage() {
  const links = await listRegistrationLinks();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">
          Domain Registrations
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Create a private link and send it to a client. They fill in the form
          without an account — no login, no password.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
          New link
        </h2>
        <NewLinkForm />
      </section>

      <section>
        <h2 className="mb-3 text-[11px] font-bold tracking-[0.2em] text-muted uppercase">
          Issued links
        </h2>

        {links.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface/40 px-5 py-8 text-center text-sm text-muted">
            No links yet. Create one above to get started.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {links.map(({ link, registration }) => {
              const state = linkState(link);
              return (
                <li key={link.id}>
                  <Link
                    href={`/admin/registrations/${link.id}`}
                    className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/40 px-5 py-4 transition-colors hover:border-foreground"
                  >
                    <div className="min-w-0">
                      <p className="font-medium tracking-tight">
                        {link.client_name}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-muted">
                        {registration
                          ? registration.domain_name
                          : link.company_name ?? "No submission yet"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {registration ? (
                        <StatusBadge status={registration.status} />
                      ) : (
                        <span className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
                          Not submitted
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase ${STATE_TONE[state]}`}
                      >
                        {state === "active"
                          ? `Expires ${dateLabel(link.expires_at)}`
                          : state}
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-muted transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
