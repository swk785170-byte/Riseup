import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { listClientSummaries } from "@/lib/data/portal";
import StatusBadge from "@/components/portal/StatusBadge";

export const dynamic = "force-dynamic";

function timeLabel(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export default async function AdminClientsPage() {
  const clients = await listClientSummaries();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Clients</h1>
          <p className="mt-1.5 text-sm text-muted">
            Portal accounts, their domain submission and message activity.
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-bold tracking-[0.16em] text-background uppercase transition-colors hover:bg-charcoal"
        >
          <Plus size={14} strokeWidth={2.5} />
          New client
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface/40 px-5 py-8 text-center text-sm text-muted">
          No client accounts yet. Create one to send a portal invite.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {clients.map(({ client, status, lastMessageAt, unreadFromClient }) => (
            <li key={client.id}>
              <Link
                href={`/admin/clients/${client.id}`}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/40 px-5 py-4 transition-colors hover:border-foreground"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium tracking-tight">
                    {client.full_name}
                    {unreadFromClient > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
                        {unreadFromClient}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {client.company_name ?? client.email}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  {status ? (
                    <StatusBadge status={status} />
                  ) : (
                    <span className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
                      Not submitted
                    </span>
                  )}
                  <span className="hidden text-xs text-muted sm:block">
                    {timeLabel(lastMessageAt)}
                  </span>
                  <ArrowUpRight size={16} className="text-muted transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
