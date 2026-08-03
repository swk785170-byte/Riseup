"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientLogoFormSchema,
  type ClientLogoFormInput,
  type ClientLogoFormValues,
} from "@/lib/schemas/client-logo";
import {
  createClientLogo,
  updateClientLogo,
} from "@/lib/actions/client-logos";
import ImageUpload from "./ImageUpload";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function ClientLogoForm({
  mode,
  logoId,
  defaultValues,
}: {
  mode: "create" | "edit";
  logoId?: string;
  defaultValues: ClientLogoFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ClientLogoFormInput, unknown, ClientLogoFormValues>({
    resolver: zodResolver(clientLogoFormSchema),
    defaultValues: defaultValues as ClientLogoFormInput,
  });

  async function onSubmit(values: ClientLogoFormValues) {
    setServerError(null);
    const res =
      mode === "edit" && logoId
        ? await updateClientLogo(logoId, values)
        : await createClientLogo(values);
    if (!res.ok) {
      setServerError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/client-logos?saved=1");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      {serverError && (
        <p className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <section className="rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Client
        </h2>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="name" className="admin-label">
              Name *
            </label>
            <input id="name" className="admin-input" {...register("name")} />
            <FieldError message={errors.name?.message} />
            <p className="mt-1.5 text-xs text-muted">
              Shown as a text wordmark in the marquee if no logo image is
              uploaded.
            </p>
          </div>

          <div className="max-w-[8rem]">
            <label htmlFor="sort_order" className="admin-label">
              Sort order
            </label>
            <input
              id="sort_order"
              type="number"
              className="admin-input"
              {...register("sort_order")}
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Logo image
        </h2>
        <Controller
          control={control}
          name="logo_url"
          render={({ field }) => (
            <ImageUpload
              label="Logo"
              multiple={false}
              bucket="client-logos"
              value={field.value ? [field.value] : []}
              onChange={(urls) => field.onChange(urls[0] ?? "")}
            />
          )}
        />
        <p className="mt-3 text-xs text-muted">
          Optional — leave empty to render the client name as text instead.
        </p>
      </section>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-foreground px-8 py-3.5 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors hover:bg-charcoal disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Add Logo"
              : "Save Logo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/client-logos")}
          className="text-[12px] font-bold tracking-[0.14em] text-muted uppercase hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
