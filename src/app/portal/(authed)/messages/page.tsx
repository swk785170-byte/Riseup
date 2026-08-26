import { redirect } from "next/navigation";
import { getCurrentClient } from "@/lib/auth/client-portal";
import { getMyMessages } from "@/lib/data/portal";
import MessageThread from "@/components/portal/MessageThread";

export const dynamic = "force-dynamic";

export default async function PortalMessagesPage() {
  const client = await getCurrentClient();
  if (!client) redirect("/portal/login");

  const messages = await getMyMessages(client.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
          Messages
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Direct line to the Riseup Solutions team.
        </p>
      </div>
      <MessageThread clientId={client.id} initialMessages={messages} />
    </div>
  );
}
