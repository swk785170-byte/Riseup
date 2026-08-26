"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  revokeRegistrationLink,
  setRegistrationStatus,
} from "@/lib/actions/registrations";

/**
 * Staff-only controls: review decision on a submission, and link revocation.
 * Every value is re-validated server-side behind `requireAdmin`.
 */
export default function LinkActions({
  linkId,
  registrationId,
  revoked,
}: {
  linkId: string;
  registrationId: string | null;
  revoked: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function applyStatus(status: "reviewed" | "needs_info") {
    if (!registrationId) return;
    setError(null);
    startTransition(async () => {
      const result = await setRegistrationStatus(registrationId, status);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  function revoke() {
    setError(null);
    startTransition(async () => {
      const result = await revokeRegistrationLink(linkId);
      if (result.ok) {
        setConfirming(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {registrationId && (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() => applyStatus("reviewed")}
              className="rounded-full bg-foreground px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-background uppercase transition-colors hover:bg-charcoal disabled:opacity-50"
            >
              Mark as reviewed
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => applyStatus("needs_info")}
              className="rounded-full border border-foreground/25 px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              Request more info
            </button>
          </>
        )}

        {!revoked &&
          (confirming ? (
            <span className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={revoke}
                className="rounded-full bg-red-600 px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                Confirm revoke
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase underline underline-offset-4"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-full border border-red-300 px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-red-700 uppercase transition-colors hover:bg-red-50"
            >
              Revoke link
            </button>
          ))}
      </div>

      {confirming && (
        <p className="text-xs leading-relaxed text-muted">
          Revoking takes effect immediately — the client&rsquo;s link stops
          working, even if they already have the page open. Their submitted
          details are kept.
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
