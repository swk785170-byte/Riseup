"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientAccount } from "@/lib/actions/clients";
import {
  newClientSchema,
  type NewClientInput,
  type NewClientValues,
} from "@/lib/schemas/portal";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

export default function NewClientForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewClientInput, unknown, NewClientValues>({
    resolver: zodResolver(newClientSchema),
    defaultValues: { full_name: "", company_name: "", email: "", phone: "" },
  });

  function onSubmit(values: NewClientValues) {
    setError(null);
    startTransition(async () => {
      const result = await createClientAccount(values);
      if (result.ok) router.push("/admin/clients");
      else setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="full_name" className="admin-label">
          Full name
        </label>
        <input id="full_name" className="admin-input" {...register("full_name")} />
        <FieldError message={errors.full_name?.message} />
      </div>

      <div>
        <label htmlFor="company_name" className="admin-label">
          Company <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="company_name" className="admin-input" {...register("company_name")} />
        <FieldError message={errors.company_name?.message} />
      </div>

      <div>
        <label htmlFor="email" className="admin-label">
          Email
        </label>
        <input id="email" type="email" className="admin-input" {...register("email")} />
        <p className="mt-1.5 text-xs text-muted">
          The invite and every future sign-in link go to this address.
        </p>
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="phone" className="admin-label">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="phone" inputMode="tel" className="admin-input" {...register("phone")} />
        <FieldError message={errors.phone?.message} />
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
          {pending ? "Sending invite…" : "Create & send invite"}
        </button>
      </div>
    </form>
  );
}
