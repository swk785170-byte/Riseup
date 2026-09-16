"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { submitSmsLenzApproval } from "@/lib/actions/registrations";
import type { DbSmsLenzApproval } from "@/lib/registrations";

/**
 * SMS Lenz (sender ID) approval — every field optional.
 *
 * Deliberately a plain uncontrolled form posting FormData rather than
 * react-hook-form: nothing here is required, so there is no client-side
 * validation to run, and FormData is what carries the two file inputs to the
 * Server Action without a separate browser-side upload step.
 *
 * Files never go to Storage from the browser. The `sms-lenz-uploads` bucket
 * grants no public write — the action validates the link token, checks the
 * file's real magic bytes, and uploads with the service role.
 */
export default function SmsLenzApprovalForm({
  token,
  existing,
}: {
  token: string;
  existing: DbSmsLenzApproval | null;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await submitSmsLenzApproval(token, data);
      if (result.ok) setSaved(true);
      else setError(result.error);
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="register-form flex flex-col gap-6"
    >
      <p className="border border-border bg-surface/60 px-4 py-3 text-sm leading-relaxed">
        This form is optional — only complete it if you need a custom SMS Sender
        ID approved.
      </p>

      <div>
        <label htmlFor="sender_id" className="admin-label">
          Sender ID
        </label>
        <input
          id="sender_id"
          name="sender_id"
          autoComplete="off"
          defaultValue={existing?.sender_id ?? ""}
          className="admin-input"
        />
      </div>

      <div>
        <label htmlFor="sms_address" className="admin-label">
          Address
        </label>
        <input
          id="sms_address"
          name="address"
          autoComplete="off"
          defaultValue={existing?.address ?? ""}
          className="admin-input"
        />
      </div>

      <UploadField
        id="id_card_photo"
        label="ID card photo"
        existingUrl={existing?.id_card_photo_url ?? null}
      />
      <UploadField
        id="logo"
        label="Logo"
        existingUrl={existing?.logo_url ?? null}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {saved && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
        >
          <Check size={15} strokeWidth={2.5} />
          Saved.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors duration-300 hover:bg-charcoal disabled:opacity-50"
        >
          {pending ? "Saving…" : existing ? "Update details" : "Submit"}
        </button>
      </div>
    </form>
  );
}

/** File input that shows what is already on file, so a re-submit is informed. */
function UploadField({
  id,
  label,
  existingUrl,
}: {
  id: string;
  label: string;
  existingUrl: string | null;
}) {
  return (
    <div>
      <label htmlFor={id} className="admin-label">
        {label}
      </label>

      {existingUrl && (
        <div className="mt-2 mb-3 flex items-center gap-3">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden border border-border bg-surface">
            <Image
              src={existingUrl}
              alt={`${label} already uploaded`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <span className="text-xs text-muted">
            Already uploaded. Choosing a new file replaces it; leaving this
            empty keeps it.
          </span>
        </div>
      )}

      <input
        id={id}
        name={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="admin-input file:mr-3 file:border-0 file:bg-transparent file:text-xs file:font-bold file:tracking-[0.1em] file:uppercase"
      />
    </div>
  );
}
