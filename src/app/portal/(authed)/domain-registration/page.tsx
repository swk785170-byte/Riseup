import { redirect } from "next/navigation";
import { getCurrentClient } from "@/lib/auth/client-portal";
import { getMyRegistration } from "@/lib/data/portal";
import DomainRegistrationForm from "@/components/portal/DomainRegistrationForm";
import StatusBadge from "@/components/portal/StatusBadge";

export const dynamic = "force-dynamic";

export default async function DomainRegistrationPage() {
  const client = await getCurrentClient();
  if (!client) redirect("/portal/login");

  const registration = await getMyRegistration(client.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
            Domain Registration
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Tell us the domain to register and who owns it.
          </p>
        </div>
        {registration && <StatusBadge status={registration.status} />}
      </div>

      {registration?.status === "needs_info" && (
        <p className="rounded-lg border border-foreground/30 bg-surface px-4 py-3 text-sm">
          We need a little more information before we can proceed — please check
          the details below and update them.
        </p>
      )}

      <DomainRegistrationForm existing={registration} />
    </div>
  );
}
