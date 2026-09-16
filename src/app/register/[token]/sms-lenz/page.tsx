import type { Metadata } from "next";
import SmsLenzApprovalForm from "@/components/register/SmsLenzApprovalForm";
import StatusBadge from "@/components/register/StatusBadge";
import { resolveLink } from "@/lib/registration-access";
import { getSmsLenzForLink } from "@/lib/data/registrations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SMS Lenz Approval — Riseup Solutions",
  robots: { index: false, follow: false },
};

export default async function SmsLenzApprovalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await resolveLink(token);
  if (!link) return null;

  const approval = await getSmsLenzForLink(link.id);

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold tracking-[0.3em] text-muted uppercase">
          SMS Lenz Approval
        </p>
        {approval && <StatusBadge status={approval.status} />}
      </div>
      <SmsLenzApprovalForm token={token} existing={approval} />
    </>
  );
}
