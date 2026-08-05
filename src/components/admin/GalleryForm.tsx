"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  galleryImageFormSchema,
  type GalleryImageFormInput,
  type GalleryImageFormValues,
} from "@/lib/schemas/site";
import { createGalleryImage, updateGalleryImage } from "@/lib/actions/site";
import ImageUpload from "./ImageUpload";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function GalleryForm({
  mode,
  imageId,
  defaultValues,
}: {
  mode: "create" | "edit";
  imageId?: string;
  defaultValues: GalleryImageFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GalleryImageFormInput, unknown, GalleryImageFormValues>({
    resolver: zodResolver(galleryImageFormSchema),
    defaultValues: defaultValues as GalleryImageFormInput,
  });

  async function onSubmit(values: GalleryImageFormValues) {
    setServerError(null);
    const res =
      mode === "edit" && imageId
        ? await updateGalleryImage(imageId, values)
        : await createGalleryImage(values);
    if (!res.ok) {
      setServerError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/gallery?saved=1");
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
          Photo
        </h2>
        <Controller
          control={control}
          name="image_url"
          render={({ field }) => (
            <ImageUpload
              label="Gallery photo *"
              multiple={false}
              bucket="gallery-images"
              value={field.value ? [field.value] : []}
              onChange={(urls) => field.onChange(urls[0] ?? "")}
            />
          )}
        />
        <FieldError message={errors.image_url?.message} />

        <div className="mt-6 flex flex-col gap-5">
          <div>
            <label htmlFor="alt" className="admin-label">
              Description (alt text)
            </label>
            <input
              id="alt"
              className="admin-input"
              placeholder="e.g. The team at the 2026 launch day"
              {...register("alt")}
            />
            <FieldError message={errors.alt?.message} />
            <p className="mt-1.5 text-xs text-muted">
              Not shown on the page — used by screen readers and search engines.
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

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-foreground px-8 py-3.5 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors hover:bg-charcoal disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Add Photo"
              : "Save Photo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/gallery")}
          className="text-[12px] font-bold tracking-[0.14em] text-muted uppercase hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
