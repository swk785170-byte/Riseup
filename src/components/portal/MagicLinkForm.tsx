"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { requestMagicLink } from "@/lib/actions/portal";
import { magicLinkSchema, type MagicLinkValues } from "@/lib/schemas/portal";

/**
 * Email-only sign-in request.
 *
 * The success state is shown for every submission the server accepts, whether
 * or not the address has an account — the UI must not become the account
 * enumeration oracle the server action deliberately avoids being.
 */
export default function MagicLinkForm() {
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: MagicLinkValues) {
    startTransition(async () => {
      const result = await requestMagicLink(values);
      setNotice(result.ok ? (result.message ?? null) : result.error);
      if (result.ok) setSent(true);
    });
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-xl border border-border bg-surface px-5 py-6 text-center"
      >
        <p className="text-sm font-medium tracking-tight">Check your inbox</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{notice}</p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setNotice(null);
          }}
          className="mt-5 text-xs font-bold tracking-[0.16em] text-foreground uppercase underline underline-offset-4"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="admin-label">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          className="admin-input"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors duration-300 hover:bg-charcoal disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send login link"}
        <Send size={14} strokeWidth={2.5} />
      </button>
    </form>
  );
}
