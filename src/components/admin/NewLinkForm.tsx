"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, TriangleAlert } from "lucide-react";
import { createRegistrationLink } from "@/lib/actions/registrations";
import {
  newLinkSchema,
  type NewLinkInput,
  type NewLinkValues,
} from "@/lib/schemas/portal";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

/**
 * Mints a registration link.
 *
 * The generated URL is displayed once and cannot be retrieved afterwards —
 * only its hash is stored — so the success state makes copying it the obvious
 * next action.
 */
export default function NewLinkForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewLinkInput, unknown, NewLinkValues>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: {
      client_name: "",
      company_name: "",
      client_email: "",
      note: "",
      expires_in_days: 14,
    },
  });

  function onSubmit(values: NewLinkValues) {
    setError(null);
    startTransition(async () => {
      const result = await createRegistrationLink(values);
      if (result.ok) {
        setUrl(result.url);
        setCopied(false);
        reset();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked by permissions — the field is selectable.
      setCopied(false);
    }
  }

  if (url) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface/40 p-5">
        <p className="flex items-start gap-2 text-sm">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" strokeWidth={2} />
          <span>
            Copy this link now — it is stored hashed and{" "}
            <strong className="font-medium">cannot be shown again</strong>. If
            you lose it, revoke the link and create a new one.
          </span>
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Registration link"
            className="admin-input flex-1 font-mono text-xs"
          />
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-background uppercase transition-colors hover:bg-charcoal"
          >
            {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.5} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setUrl(null)}
          className="self-start text-[11px] font-bold tracking-[0.16em] text-muted uppercase underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Create another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5 rounded-xl border border-border bg-surface/40 p-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="client_name" className="admin-label">
            Client name
          </label>
          <input id="client_name" className="admin-input" {...register("client_name")} />
          <FieldError message={errors.client_name?.message} />
        </div>

        <div>
          <label htmlFor="company_name" className="admin-label">
            Company <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="company_name" className="admin-input" {...register("company_name")} />
          <FieldError message={errors.company_name?.message} />
        </div>

        <div>
          <label htmlFor="client_email" className="admin-label">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="client_email" type="email" className="admin-input" {...register("client_email")} />
          <p className="mt-1.5 text-xs text-muted">
            For your records — the link is not emailed automatically.
          </p>
          <FieldError message={errors.client_email?.message} />
        </div>

        <div>
          <label htmlFor="expires_in_days" className="admin-label">
            Expires in (days)
          </label>
          <input
            id="expires_in_days"
            type="number"
            min={1}
            max={90}
            className="admin-input"
            {...register("expires_in_days")}
          />
          <FieldError message={errors.expires_in_days?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="note" className="admin-label">
          Note <span className="font-normal text-muted">(optional, internal)</span>
        </label>
        <input id="note" className="admin-input" {...register("note")} />
        <FieldError message={errors.note?.message} />
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors hover:bg-charcoal disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create link"}
        </button>
      </div>
    </form>
  );
}
