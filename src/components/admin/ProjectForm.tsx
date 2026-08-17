"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import {
  CATEGORY_OPTIONS,
  projectFormSchema,
  type ProjectFormInput,
  type ProjectFormValues,
} from "@/lib/schemas/project";
import { createProject, updateProject } from "@/lib/actions/projects";
import ImageUpload from "./ImageUpload";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function ProjectForm({
  mode,
  projectId,
  defaultValues,
}: {
  mode: "create" | "edit";
  projectId?: string;
  defaultValues: ProjectFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultValues as ProjectFormInput,
  });

  const results = useFieldArray({ control, name: "results" });
  const tags = watch("tags") ?? [];
  // Live swatch next to the hex input; falls back to the palette default.
  const accentPreview = (watch("accent_bg") || "").trim() || "#F1EEE6";

  async function onSubmit(values: ProjectFormValues) {
    setServerError(null);
    const res =
      mode === "edit" && projectId
        ? await updateProject(projectId, values)
        : await createProject(values);
    if (!res.ok) {
      setServerError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/projects?saved=1");
    router.refresh();
  }

  function addTag() {
    const value = tagInput.trim();
    if (value && !tags.includes(value) && tags.length < 8) {
      setValue("tags", [...tags, value], { shouldDirty: true });
    }
    setTagInput("");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
      {serverError && (
        <p className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      {/* Basics */}
      <section className="rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Basics
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="admin-label">
              Title *
            </label>
            <input id="title" className="admin-input" {...register("title")} />
            <FieldError message={errors.title?.message} />
          </div>
          <div>
            <label htmlFor="client_name" className="admin-label">
              Client name *
            </label>
            <input
              id="client_name"
              className="admin-input"
              {...register("client_name")}
            />
            <FieldError message={errors.client_name?.message} />
          </div>
          <div>
            <label htmlFor="tag" className="admin-label">
              Card label (tag)
            </label>
            <input
              id="tag"
              className="admin-input"
              placeholder="e.g. Corporate, D2C Brand"
              {...register("tag")}
            />
            <FieldError message={errors.tag?.message} />
          </div>
          <div>
            <label htmlFor="category" className="admin-label">
              Category *
            </label>
            <select
              id="category"
              className="admin-select"
              {...register("category")}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>
          <div>
            <label htmlFor="year" className="admin-label">
              Year *
            </label>
            <input
              id="year"
              type="number"
              className="admin-input"
              {...register("year")}
            />
            <FieldError message={errors.year?.message} />
          </div>
        </div>
      </section>

      {/* Case study content */}
      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Case study
        </h2>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="description" className="admin-label">
              Summary
            </label>
            <textarea
              id="description"
              className="admin-textarea"
              placeholder="One line shown on the card and modal intro."
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>
          <div>
            <label htmlFor="challenge" className="admin-label">
              Challenge
            </label>
            <textarea
              id="challenge"
              className="admin-textarea"
              {...register("challenge")}
            />
            <FieldError message={errors.challenge?.message} />
          </div>
          <div>
            <label htmlFor="solution" className="admin-label">
              Solution
            </label>
            <textarea
              id="solution"
              className="admin-textarea"
              {...register("solution")}
            />
            <FieldError message={errors.solution?.message} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-widest text-muted uppercase">
            Results (metrics)
          </h2>
          <button
            type="button"
            onClick={() => results.append({ value: "", label: "" })}
            disabled={results.fields.length >= 6}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-bold tracking-wider text-foreground/80 uppercase hover:border-foreground hover:text-foreground disabled:opacity-40"
          >
            <Plus size={13} /> Add
          </button>
        </div>
        {results.fields.length === 0 ? (
          <p className="text-sm text-muted">
            No metrics yet. These render as the big numbers in the case-study
            modal.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {results.fields.map((field, i) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="w-32 shrink-0">
                  <input
                    className="admin-input"
                    placeholder="+212%"
                    {...register(`results.${i}.value`)}
                  />
                  <FieldError message={errors.results?.[i]?.value?.message} />
                </div>
                <div className="flex-1">
                  <input
                    className="admin-input"
                    placeholder="Online revenue in 6 months"
                    {...register(`results.${i}.label`)}
                  />
                  <FieldError message={errors.results?.[i]?.label?.message} />
                </div>
                <button
                  type="button"
                  onClick={() => results.remove(i)}
                  className="admin-icon-btn mt-0.5"
                  title="Remove"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tags */}
      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Tags
        </h2>
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[12px] font-semibold"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "tags",
                      tags.filter((t) => t !== tag),
                      { shouldDirty: true },
                    )
                  }
                  className="text-muted hover:text-foreground"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            className="admin-input"
          />
          <button
            type="button"
            onClick={addTag}
            className="shrink-0 rounded-lg border border-border px-4 text-[12px] font-bold tracking-wider text-foreground/80 uppercase hover:border-foreground hover:text-foreground"
          >
            Add
          </button>
        </div>
      </section>

      {/* Images */}
      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Images
        </h2>
        <div className="flex flex-col gap-6">
          <div>
            <Controller
              control={control}
              name="card_preview_url"
              render={({ field }) => (
                <ImageUpload
                  label="Card preview"
                  multiple={false}
                  value={field.value ? [field.value] : []}
                  onChange={(urls) => field.onChange(urls[0] ?? "")}
                />
              )}
            />
            <p className="mt-2 max-w-md text-xs text-muted">
              <strong className="font-semibold text-charcoal">
                Card Preview:
              </strong>{" "}
              upload a focused crop of the best-looking section of this project
              (hero, standout component). Full page screenshots go in the
              gallery below. If left empty, the thumbnail is used instead.
            </p>
          </div>

          <div>
            <label htmlFor="accent_bg" className="admin-label">
              Card backdrop colour
            </label>
            <div className="flex items-center gap-3">
              <input
                id="accent_bg"
                className="admin-input max-w-[10rem]"
                placeholder="#F1EEE6"
                {...register("accent_bg")}
              />
              <span
                aria-hidden
                className="h-9 w-9 shrink-0 rounded-lg border border-border"
                style={{ backgroundColor: accentPreview }}
              />
            </div>
            <FieldError message={errors.accent_bg?.message} />
            <p className="mt-1.5 max-w-md text-xs text-muted">
              Sits behind the browser mockup on the card. Use a tint from the
              project&rsquo;s brand so dark and light screenshots each get an
              intentional backdrop. Defaults to{" "}
              <code className="font-mono">#F1EEE6</code>.
            </p>
          </div>

          <Controller
            control={control}
            name="thumbnail_url"
            render={({ field }) => (
              <ImageUpload
                label="Thumbnail (full screenshot)"
                multiple={false}
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? "")}
              />
            )}
          />
          <Controller
            control={control}
            name="gallery_urls"
            render={({ field }) => (
              <ImageUpload
                label="Gallery"
                multiple
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </section>

      {/* Placement */}
      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Placement
        </h2>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#0b0b0b]"
              {...register("featured")}
            />
            <span>
              <span className="font-semibold">Featured</span>
              <span className="text-muted"> — shown on the homepage row</span>
            </span>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#0b0b0b]"
              {...register("is_lms")}
            />
            <span>
              <span className="font-semibold">LMS</span>
              <span className="text-muted">
                {" "}
                — shown in the LMS page Customers section
              </span>
            </span>
          </label>
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
              ? "Create Project"
              : "Save Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="text-[12px] font-bold tracking-[0.14em] text-muted uppercase hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
