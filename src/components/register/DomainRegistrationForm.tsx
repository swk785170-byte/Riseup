"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { submitDomainRegistration } from "@/lib/actions/registrations";
import {
  domainRegistrationSchema,
  type DomainRegistrationInput,
  type DomainRegistrationValues,
} from "@/lib/schemas/portal";
import type { DbDomainRegistration } from "@/lib/registrations";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

type Field = {
  name: keyof DomainRegistrationValues;
  label: string;
  type?: string;
  inputMode?: "text" | "tel" | "email";
  autoComplete?: string;
};

/** All six are required — there is no conditional branching on this form. */
const FIELDS: Field[] = [
  { name: "business_name", label: "Business", autoComplete: "organization" },
  { name: "full_name", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", inputMode: "email", autoComplete: "email" },
  { name: "phone_number", label: "Phone no.", inputMode: "tel", autoComplete: "tel" },
  { name: "address", label: "Address", autoComplete: "street-address" },
  { name: "id_number", label: "ID number" },
];

/**
 * Domain registration, reached through a secret link.
 *
 * The token is passed straight back to the server action, which re-resolves it
 * — including re-checking expiry and revocation — on every submit, so holding
 * this page open after a link is revoked does not let a submission through.
 */
export default function DomainRegistrationForm({
  token,
  existing,
}: {
  token: string;
  existing: DbDomainRegistration | null;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DomainRegistrationInput, unknown, DomainRegistrationValues>({
    resolver: zodResolver(domainRegistrationSchema),
    defaultValues: {
      business_name: existing?.business_name ?? "",
      // A submission from before this form changed has no business name, but
      // may still carry a contact from the old owner fields — prefill from
      // whichever is present so the client is not retyping what we already have.
      full_name: existing?.full_name ?? existing?.owner_name ?? "",
      email: existing?.email ?? existing?.owner_email ?? "",
      phone_number:
        existing?.phone_number ?? existing?.owner_contact_number ?? "",
      address: existing?.address ?? "",
      id_number: existing?.id_number ?? existing?.owner_nic_or_passport ?? "",
    },
  });

  function onSubmit(values: DomainRegistrationValues) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await submitDomainRegistration(token, values);
      if (result.ok) setSaved(true);
      else setError(result.error);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="register-form flex flex-col gap-6"
    >
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="admin-label">
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type ?? "text"}
            inputMode={field.inputMode}
            autoComplete={field.autoComplete ?? "off"}
            className="admin-input"
            aria-invalid={Boolean(errors[field.name])}
            {...register(field.name)}
          />
          <FieldError message={errors[field.name]?.message} />
        </div>
      ))}

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
