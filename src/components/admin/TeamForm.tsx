"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teamMemberFormSchema,
  type TeamMemberFormInput,
  type TeamMemberFormValues,
} from "@/lib/schemas/site";
import { createTeamMember, updateTeamMember } from "@/lib/actions/site";
import ImageUpload from "./ImageUpload";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function TeamForm({
  mode,
  memberId,
  defaultValues,
}: {
  mode: "create" | "edit";
  memberId?: string;
  defaultValues: TeamMemberFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormInput, unknown, TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: defaultValues as TeamMemberFormInput,
  });

  async function onSubmit(values: TeamMemberFormValues) {
    setServerError(null);
    const res =
      mode === "edit" && memberId
        ? await updateTeamMember(memberId, values)
        : await createTeamMember(values);
    if (!res.ok) {
      setServerError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/team?saved=1");
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
          Member
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
              Role
            </label>
            <input
              id="role"
              className="admin-input"
              placeholder="e.g. Co-Founder, Developer"
              {...register("role")}
            />
            <FieldError message={errors.role?.message} />
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
          Photo
        </h2>
        <Controller
          control={control}
          name="photo_url"
          render={({ field }) => (
            <ImageUpload
              label="Team photo"
              multiple={false}
              bucket="team-photos"
              value={field.value ? [field.value] : []}
              onChange={(urls) => field.onChange(urls[0] ?? "")}
            />
          )}
        />
        <p className="mt-3 text-xs text-muted">
          Portrait crops (4:5) work best. Leave empty to show the placeholder
          avatar.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-1 text-sm font-bold tracking-widest text-muted uppercase">
          Personal socials
        </h2>
        <p className="mb-5 text-xs text-muted">
          Shown as icon buttons when someone hovers this member&rsquo;s photo.
          Leave any blank to hide that icon.
        </p>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="instagram_url" className="admin-label">
              Instagram URL
            </label>
            <input
              id="instagram_url"
              className="admin-input"
              placeholder="https://instagram.com/username"
              {...register("instagram_url")}
            />
            <FieldError message={errors.instagram_url?.message} />
          </div>
          <div>
            <label htmlFor="linkedin_url" className="admin-label">
              LinkedIn URL
            </label>
            <input
              id="linkedin_url"
              className="admin-input"
              placeholder="https://linkedin.com/in/username"
              {...register("linkedin_url")}
            />
            <FieldError message={errors.linkedin_url?.message} />
          </div>
          <div>
            <label htmlFor="website_url" className="admin-label">
              Website / portfolio URL
            </label>
            <input
              id="website_url"
              className="admin-input"
              placeholder="https://example.com"
              {...register("website_url")}
            />
            <FieldError message={errors.website_url?.message} />
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
              ? "Add Member"
              : "Save Member"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/team")}
          className="text-[12px] font-bold tracking-[0.14em] text-muted uppercase hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
