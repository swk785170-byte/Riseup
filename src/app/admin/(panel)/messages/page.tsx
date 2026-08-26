import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listClientSummaries } from "@/lib/data/portal";

export const dynamic = "force-dynamic";

function timeLabel(iso: string | null): string {
  if (!iso) return "No messages";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "No messages"
    : d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

export default async function AdminMessagesPage() {
  const all = await listClientSummaries();

  // Most recent activity first; clients who have never written sink to the end.
  const threads = [...all].sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return b.lastMessageAt.localeCompare(a.lastMessageAt);
  });
  const totalUnread = threads.reduce((n, t) => n + t.unreadFromClient, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-medium tracking-tight">
          Inbox
          {totalUnread > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-foreground px-2 text-[11px] font-bold text-background">
              {totalUnread}
            </span>
          )}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Every client thread, most recent first.
        </p>
      </div>

      {threads.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface/40 px-5 py-8 text-center text-sm text-muted">
          No client accounts yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {threads.map(({ client, lastMessageAt, unreadFromClient }) => (
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
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted">
                    {timeLabel(lastMessageAt)}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-muted transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
