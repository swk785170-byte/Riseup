"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { submitInquiry } from "@/lib/actions/inquiries";
import { PROJECT_TYPES, type ProjectType } from "@/lib/inquiries";
import { inquiryFormSchema } from "@/lib/schemas/inquiry";
import { EASE_PREMIUM } from "@/lib/motion";

type Values = {
  name: string;
  email: string;
  project_type: ProjectType;
  message: string;
  company: string; // honeypot
};

const EMPTY: Values = {
  name: "",
  email: "",
  project_type: "Web Package",
  message: "",
  company: "",
};

const field =
  "w-full rounded-xl border border-taupe bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted focus:border-foreground";
const label =
  "mb-2 block text-[11px] font-bold tracking-[0.16em] text-muted uppercase";

export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = inquiryFormSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof Values, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          next[key as keyof Values] = issue.message;
        }
      }
      setErrors(next);
      return;
    }

    setSending(true);
    try {
      const res = await submitInquiry(parsed.data);
      if (!res.ok) {
        // Keep everything the visitor typed so nothing is lost on failure.
        setFormError(res.error);
        return;
      }
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-taupe bg-surface px-6 py-14 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
          <Check size={22} strokeWidth={2.5} />
        </span>
        <p className="text-lg font-medium tracking-tight">
          Thanks — we&rsquo;ll be in touch soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input
            id="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={field}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={field}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="project_type" className={label}>
            Project type
          </label>
          <select
            id="project_type"
            value={values.project_type}
            onChange={(e) =>
              update("project_type", e.target.value as ProjectType)
            }
            className={field}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${field} resize-y leading-relaxed`}
            placeholder="Tell us what you're building and roughly when you need it."
          />
          {errors.message && (
            <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      {formError && (
        <p className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="mt-7 flex justify-center">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-10 py-4 text-[13px] font-bold tracking-[0.18em] text-background uppercase transition-colors duration-300 hover:bg-charcoal disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send Message"}
          {!sending && <ArrowUpRight size={16} strokeWidth={2.5} />}
        </button>
      </div>
    </form>
  );
}
