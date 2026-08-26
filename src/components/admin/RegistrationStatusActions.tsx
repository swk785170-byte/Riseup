"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setRegistrationStatus } from "@/lib/actions/clients";

/** Staff-only review decision. `status` is validated again server-side. */
export default function RegistrationStatusActions({
  registrationId,
}: {
  registrationId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function apply(status: "reviewed" | "needs_info") {
    setError(null);
    startTransition(async () => {
      const result = await setRegistrationStatus(registrationId, status);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => apply("reviewed")}
          className="rounded-full bg-foreground px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-background uppercase transition-colors hover:bg-charcoal disabled:opacity-50"
        >
          Mark as reviewed
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => apply("needs_info")}
          className="rounded-full border border-foreground/25 px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          Request more info
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
