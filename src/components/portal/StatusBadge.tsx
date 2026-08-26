import { DOMAIN_STATUS_LABEL, type DomainStatus } from "@/lib/portal";

const TONE: Record<DomainStatus, string> = {
  submitted: "border-taupe bg-surface text-foreground/70",
  reviewed: "border-foreground bg-foreground text-background",
  needs_info: "border-foreground/40 bg-background text-foreground",
};

export default function StatusBadge({ status }: { status: DomainStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase ${TONE[status]}`}
    >
      {DOMAIN_STATUS_LABEL[status]}
    </span>
  );
}
