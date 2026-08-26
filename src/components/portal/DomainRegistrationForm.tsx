"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { saveDomainRegistration } from "@/lib/actions/portal";
import {
  domainRegistrationSchema,
  type DomainRegistrationInput,
  type DomainRegistrationValues,
} from "@/lib/schemas/portal";
import type { DbDomainRegistration } from "@/lib/portal";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

/**
 * Create-or-edit form for the client's single domain submission.
 *
 * Note the payload: no client id, no status. Both are decided server-side from
 * the session, so there is nothing here for a tampered request to point at.
 */
export default function DomainRegistrationForm({
  existing,
}: {
  existing: DbDomainRegistration | null;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DomainRegistrationInput, unknown, DomainRegistrationValues>({
    resolver: zodResolver(domainRegistrationSchema),
    defaultValues: {
      domain_name: existing?.domain_name ?? "",
      is_owner: existing?.is_owner ?? true,
      owner_name: existing?.owner_name ?? "",
      owner_nic_or_passport: existing?.owner_nic_or_passport ?? "",
      owner_email: existing?.owner_email ?? "",
      owner_contact_number: existing?.owner_contact_number ?? "",
    },
  });

  const isOwner = watch("is_owner");

  function onSubmit(values: DomainRegistrationValues) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveDomainRegistration(values);
      if (result.ok) setSaved(true);
      else setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div>
        <label htmlFor="domain_name" className="admin-label">
          Domain name
        </label>
        <input
          id="domain_name"
          inputMode="url"
          autoComplete="off"
          placeholder="example.com"
          className="admin-input"
          aria-invalid={Boolean(errors.domain_name)}
          {...register("domain_name")}
        />
        <FieldError message={errors.domain_name?.message} />
      </div>

      <fieldset>
        <legend className="admin-label">
          Are you the owner of this domain/business?
        </legend>
        <div className="mt-2 flex gap-3">
          {[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={isOwner === option.value}
              onClick={() =>
                setValue("is_owner", option.value, { shouldValidate: true })
              }
              className={`min-w-24 rounded-full border px-6 py-2.5 text-[12px] font-bold tracking-[0.14em] uppercase transition-colors duration-300 ${
                isOwner === option.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-taupe bg-surface text-foreground/70 hover:border-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Owner details — required only when the client is not the owner. */}
      {!isOwner && (
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface/40 p-5">
          <p className="text-xs leading-relaxed text-muted">
            Because you&rsquo;re not the owner, we need the owner&rsquo;s
            details to complete the registration.
          </p>

          <div>
            <label htmlFor="owner_name" className="admin-label">
              Owner name
            </label>
            <input
              id="owner_name"
              autoComplete="off"
              className="admin-input"
              aria-invalid={Boolean(errors.owner_name)}
              {...register("owner_name")}
            />
            <FieldError message={errors.owner_name?.message} />
          </div>

          <div>
            <label htmlFor="owner_nic_or_passport" className="admin-label">
              Owner NIC/PP number
            </label>
            <input
              id="owner_nic_or_passport"
              autoComplete="off"
              className="admin-input"
              aria-describedby="nic-help"
              aria-invalid={Boolean(errors.owner_nic_or_passport)}
              {...register("owner_nic_or_passport")}
            />
            <p id="nic-help" className="mt-1.5 text-xs text-muted">
              NIC number or Passport Number of domain owner
            </p>
            <FieldError message={errors.owner_nic_or_passport?.message} />
          </div>

          <div>
            <label htmlFor="owner_email" className="admin-label">
              Owner email
            </label>
            <input
              id="owner_email"
              type="email"
              autoComplete="off"
              className="admin-input"
              aria-invalid={Boolean(errors.owner_email)}
              {...register("owner_email")}
            />
            <FieldError message={errors.owner_email?.message} />
          </div>

          <div>
            <label htmlFor="owner_contact_number" className="admin-label">
              Contact number
            </label>
            <input
              id="owner_contact_number"
              inputMode="tel"
              autoComplete="off"
              className="admin-input"
              aria-invalid={Boolean(errors.owner_contact_number)}
              {...register("owner_contact_number")}
            />
            <FieldError message={errors.owner_contact_number?.message} />
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
          <Check size={15} strokeWidth={2.5} />
          Saved. We&rsquo;ll review your submission and get back to you.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors duration-300 hover:bg-charcoal disabled:opacity-50"
        >
          {pending ? "Saving…" : existing ? "Update submission" : "Submit"}
        </button>
      </div>
    </form>
  );
}
