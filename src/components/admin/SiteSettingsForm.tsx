"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormInput,
  type SiteSettingsFormValues,
} from "@/lib/schemas/site";
import { updateSiteSettings } from "@/lib/actions/site";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export default function SiteSettingsForm({
  defaultValues,
}: {
  defaultValues: SiteSettingsFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormInput, unknown, SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: defaultValues as SiteSettingsFormInput,
  });

  const whatsapp = (watch("whatsapp_number") ?? "").toString();

  async function onSubmit(values: SiteSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const res = await updateSiteSettings(values);
    if (!res.ok) {
      setServerError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaved(true);
    router.refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      {serverError && (
        <p className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}
      {saved && (
        <p className="mb-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground">
          Settings saved — the site updates immediately.
        </p>
      )}

      <section className="rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-1 text-sm font-bold tracking-widest text-muted uppercase">
          Contact email
        </h2>
        <p className="mb-5 text-xs text-muted">
          Used everywhere the site shows an email — the footer, the homepage
          contact section, the About page and the mobile menu.
        </p>
        <div>
          <label htmlFor="email" className="admin-label">
            Email *
          </label>
          <input id="email" className="admin-input" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-1 text-sm font-bold tracking-widest text-muted uppercase">
          WhatsApp
        </h2>
        <p className="mb-5 text-xs text-muted">
          Powers the floating WhatsApp button in the bottom-right corner of
          every page, and the &ldquo;Chat on WhatsApp&rdquo; button on the About
          page. Leave blank to hide both.
        </p>
        <div className="max-w-xs">
          <label htmlFor="whatsapp_number" className="admin-label">
            Phone number
          </label>
          <input
            id="whatsapp_number"
            className="admin-input"
            placeholder="94771234567"
            inputMode="numeric"
            {...register("whatsapp_number")}
          />
          <FieldError message={errors.whatsapp_number?.message} />
          <p className="mt-1.5 text-xs text-muted">
            International format, digits only — no &ldquo;+&rdquo;, spaces or
            dashes.
          </p>
          {whatsapp && (
            <p className="mt-2 text-xs text-charcoal">
              Links to{" "}
              <code className="font-mono">https://wa.me/{whatsapp}</code>
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/30 p-6">
        <h2 className="mb-1 text-sm font-bold tracking-widest text-muted uppercase">
          Company socials
        </h2>
        <p className="mb-5 text-xs text-muted">
          Shown as the icon row in the footer. Leave any blank to hide that
          icon.
        </p>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="instagram_url" className="admin-label">
              Instagram URL
            </label>
            <input
              id="instagram_url"
              className="admin-input"
              placeholder="https://instagram.com/riseupmedia"
              {...register("instagram_url")}
            />
            <FieldError message={errors.instagram_url?.message} />
          </div>
          <div>
            <label htmlFor="facebook_url" className="admin-label">
              Facebook URL
            </label>
            <input
              id="facebook_url"
              className="admin-input"
              placeholder="https://facebook.com/riseupmedia"
              {...register("facebook_url")}
            />
            <FieldError message={errors.facebook_url?.message} />
          </div>
          <div>
            <label htmlFor="linkedin_url" className="admin-label">
              LinkedIn URL
            </label>
            <input
              id="linkedin_url"
              className="admin-input"
              placeholder="https://linkedin.com/company/riseupmedia"
              {...register("linkedin_url")}
            />
            <FieldError message={errors.linkedin_url?.message} />
          </div>
          <div>
            <label htmlFor="youtube_url" className="admin-label">
              YouTube URL
            </label>
            <input
              id="youtube_url"
              className="admin-input"
              placeholder="https://youtube.com/@riseupmedia"
              {...register("youtube_url")}
            />
            <FieldError message={errors.youtube_url?.message} />
          </div>
        </div>
      </section>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-foreground px-8 py-3.5 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors hover:bg-charcoal disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
