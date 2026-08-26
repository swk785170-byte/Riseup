import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewClientForm from "@/components/admin/NewClientForm";

export default function NewClientPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-muted uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Clients
        </Link>
        <h1 className="mt-4 text-2xl font-medium tracking-tight">New client</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Creates the portal account and emails an invite link. Clients cannot
          sign themselves up.
        </p>
      </div>
      <NewClientForm />
    </div>
  );
}
