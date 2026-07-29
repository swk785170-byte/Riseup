"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postFormSchema,
  slugify,
  type PostFormInput,
  type PostFormValues,
} from "@/lib/schemas/post";
import { createPost, updatePost } from "@/lib/actions/posts";
import ImageUpload from "./ImageUpload";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function PostForm({
  mode,
  postId,
  defaultValues,
}: {
  mode: "create" | "edit";
  postId?: string;
  defaultValues: PostFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInput, unknown, PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: defaultValues as PostFormInput,
  });

  async function onSubmit(values: PostFormValues) {
    setServerError(null);
    const res =
      mode === "edit" && postId
        ? await updatePost(postId, values)
        : await createPost(values);
    if (!res.ok) {
      setServerError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/posts?saved=1");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
      {serverError && (
        <p className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <section className="rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Post
        </h2>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="title" className="admin-label">
              Title *
            </label>
            <input id="title" className="admin-input" {...register("title")} />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <label htmlFor="slug" className="admin-label">
              Slug *
            </label>
            <div className="flex gap-2">
              <input id="slug" className="admin-input" {...register("slug")} />
              <button
                type="button"
                onClick={() =>
                  setValue("slug", slugify(watch("title") ?? ""), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="shrink-0 rounded-lg border border-border px-4 text-[11px] font-bold tracking-wider text-foreground/80 uppercase hover:border-foreground hover:text-foreground"
              >
                From title
              </button>
            </div>
            <FieldError message={errors.slug?.message} />
          </div>

          <div>
            <label htmlFor="excerpt" className="admin-label">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              className="admin-textarea"
              placeholder="One or two lines shown on the blog list card."
              {...register("excerpt")}
            />
            <FieldError message={errors.excerpt?.message} />
          </div>

          <div>
            <label htmlFor="author" className="admin-label">
              Author
            </label>
            <input
              id="author"
              className="admin-input"
              {...register("author")}
            />
            <FieldError message={errors.author?.message} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Cover image
        </h2>
        <Controller
          control={control}
          name="cover_url"
          render={({ field }) => (
            <ImageUpload
              label="Cover"
              multiple={false}
              value={field.value ? [field.value] : []}
              onChange={(urls) => field.onChange(urls[0] ?? "")}
            />
          )}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Body
        </h2>
        <textarea
          className="admin-textarea min-h-[18rem] font-mono text-[13px]"
          placeholder="Write the post body. Leave a blank line between paragraphs."
          {...register("body")}
        />
        <FieldError message={errors.body?.message} />
        <p className="mt-2 text-xs text-muted">
          Plain text — a blank line starts a new paragraph.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-muted uppercase">
          Publishing
        </h2>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#0b0b0b]"
              {...register("published")}
            />
            <span>
              <span className="font-semibold">Published</span>
              <span className="text-muted"> — visible on the public blog</span>
            </span>
          </label>
          <div className="max-w-[12rem]">
            <label htmlFor="published_at" className="admin-label">
              Publish date
            </label>
            <input
              id="published_at"
              type="date"
              className="admin-input"
              {...register("published_at")}
            />
            <p className="mt-1 text-xs text-muted">
              Leave blank to use today when published.
            </p>
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
              ? "Create Post"
              : "Save Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="text-[12px] font-bold tracking-[0.14em] text-muted uppercase hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
