"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  testimonialFormSchema,
  type TestimonialFormInput,
  type TestimonialFormValues,
} from "@/lib/schemas/testimonial";
import {
  createTestimonial,
  updateTestimonial,
} from "@/lib/actions/testimonials";
import ImageUpload from "./ImageUpload";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function TestimonialForm({
  mode,
  testimonialId,
  defaultValues,
}: {
  mode: "create" | "edit";
  testimonialId?: string;
  defaultValues: TestimonialFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormInput, unknown, TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: defaultValues as TestimonialFormInput,
  });

  const quote = watch("quote") ?? "";

  async function onSubmit(values: TestimonialFormValues) {
    setServerError(null);
    const res =
      mode === "edit" && testimonialId
        ? await updateTestimonial(testimonialId, values)
        : await createTestimonial(values);
    if (!res.ok) {
      setServerError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/testimonials?saved=1");
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
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="admin-label">
              Name *
            </label>
            <input id="name" className="admin-input" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <label htmlFor="role" className="admin-label">
              Role / company
            </label>
            <input
              id="role"
              className="admin-input"
              placeholder="e.g. Founder, AR"
              {...register("role")}
            />
            <FieldError message={errors.role?.message} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Testimonial
        </h2>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="quote" className="admin-label">
              Quote *
            </label>
            <textarea
              id="quote"
              className="admin-textarea min-h-[9rem]"
              {...register("quote")}
            />
            <div className="mt-1.5 flex items-center justify-between">
              <FieldError message={errors.quote?.message} />
              <span
                className={`ml-auto text-xs ${
                  quote.length > 600 ? "text-red-600" : "text-muted"
                }`}
              >
                {quote.length}/600
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Around 150–250 characters keeps every card the same height in the
              marquee.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="rating" className="admin-label">
                Rating (1–5)
              </label>
              <select
                id="rating"
                className="admin-select"
                {...register("rating")}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
              <FieldError message={errors.rating?.message} />
            </div>
            <div>
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
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Client photo
        </h2>
        <Controller
          control={control}
          name="avatar_url"
          render={({ field }) => (
            <ImageUpload
              label="Avatar"
              multiple={false}
              bucket="client-logos"
              value={field.value ? [field.value] : []}
              onChange={(urls) => field.onChange(urls[0] ?? "")}
            />
          )}
        />
        <p className="mt-3 text-xs text-muted">
          Optional — leave empty to show the client&rsquo;s initials instead.
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
              ? "Add Testimonial"
              : "Save Testimonial"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/testimonials")}
          className="text-[12px] font-bold tracking-[0.14em] text-muted uppercase hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
