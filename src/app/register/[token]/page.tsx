import type { Metadata } from "next";
import ClientForms from "@/components/register/ClientForms";
import StatusBadge from "@/components/register/StatusBadge";
import { resolveLink } from "@/lib/registration-access";
import {
  getRegistrationForLink,
  getSmsLenzForLink,
} from "@/lib/data/registrations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Forms — Riseup Solutions",
  robots: { index: false, follow: false },
};

export default async function RegisterFormsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // The layout already rejected an invalid token; this is the same lookup
  // again so the page never trusts a value it did not verify itself.
  const link = await resolveLink(token);
  if (!link) return null;

  const [registration, smsLenz] = await Promise.all([
    getRegistrationForLink(link.id),
    getSmsLenzForLink(link.id),
  ]);

  return (
    <>
      {registration && (
        <div className="mb-6 flex justify-end">
          <StatusBadge status={registration.status} />
        </div>
      )}
      <ClientForms
        token={token}
        registration={registration}
        smsLenz={smsLenz}
      />
    </>
  );
}
