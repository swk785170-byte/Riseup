import Link from "next/link";
import { ArrowRight, Globe, MessageSquare } from "lucide-react";
import { getCurrentClient } from "@/lib/auth/client-portal";
import { getMyRegistration, getMyUnreadCount } from "@/lib/data/portal";
import { redirect } from "next/navigation";
import StatusBadge from "@/components/portal/StatusBadge";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  const client = await getCurrentClient();
  if (!client) redirect("/portal/login");

  const [registration, unread] = await Promise.all([
    getMyRegistration(client.id),
    getMyUnreadCount(client.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
          Welcome, {client.full_name}
        </h1>
        {client.company_name && (
          <p className="mt-1.5 text-sm text-muted">{client.company_name}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/portal/domain-registration"
          className="group rounded-xl border border-border bg-surface/40 p-6 transition-colors duration-300 hover:border-foreground"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
            <Globe size={18} strokeWidth={1.75} />
          </span>
          <h2 className="mt-4 text-base font-medium tracking-tight">
            Domain Registration
          </h2>
          {registration ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">{registration.domain_name}</span>
              <StatusBadge status={registration.status} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Not submitted yet — tell us about your domain.
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase">
            {registration ? "Review or edit" : "Get started"}
            <ArrowRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/portal/messages"
          className="group rounded-xl border border-border bg-surface/40 p-6 transition-colors duration-300 hover:border-foreground"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
            <MessageSquare size={18} strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
                {unread}
              </span>
            )}
          </span>
          <h2 className="mt-4 text-base font-medium tracking-tight">Messages</h2>
          <p className="mt-3 text-sm text-muted">
            {unread > 0
              ? `${unread} new ${unread === 1 ? "reply" : "replies"} from the team.`
              : "Talk to the Riseup Solutions team directly."}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase">
            Open thread
            <ArrowRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
