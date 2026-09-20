"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { submitClientForms } from "@/lib/actions/registrations";
import { domainRegistrationSchema } from "@/lib/schemas/portal";
import type {
  DbDomainRegistration,
  DbSmsLenzApproval,
} from "@/lib/registrations";
import { EASE_PREMIUM } from "@/lib/motion";
import IdCardUpload from "./IdCardUpload";

type Tab = "domain" | "sms";

const TABS = [
  { id: "domain", label: "Domain Registration", optional: false },
  { id: "sms", label: "SMS Lenz Approval", optional: true },
] as const;

type Field = {
  name: string;
  label: string;
  type?: string;
  inputMode?: "text" | "tel" | "email";
  autoComplete?: string;
};

/** All six are required — there is no conditional branching on this form. */
const DOMAIN_FIELDS: Field[] = [
  { name: "business_name", label: "Business", autoComplete: "organization" },
  { name: "full_name", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", inputMode: "email", autoComplete: "email" },
  { name: "phone_number", label: "Phone no.", inputMode: "tel", autoComplete: "tel" },
  { name: "address", label: "Address", autoComplete: "street-address" },
  { name: "id_number", label: "ID number" },
];

/**
 * Both client forms, as one form with two tabs and a single submit.
 *
 * Switching tabs hides a pane with CSS rather than unmounting it. That is the
 * whole point: the inputs stay in the DOM, so nothing typed on one tab is lost
 * by looking at the other, and one submit posts both forms together.
 */
export default function ClientForms({
  token,
  registration,
  smsLenz,
}: {
  token: string;
  registration: DbDomainRegistration | null;
  smsLenz: DbSmsLenzApproval | null;
}) {
  const [tab, setTab] = useState<Tab>("domain");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmSkip, setConfirmSkip] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  // A submission from before this form changed has no business name, but may
  // still carry a contact in the old owner columns — prefill from whichever is
  // present so the client is not retyping what we already hold.
  const initial: Record<string, string> = {
    business_name: registration?.business_name ?? "",
    full_name: registration?.full_name ?? registration?.owner_name ?? "",
    email: registration?.email ?? registration?.owner_email ?? "",
    phone_number:
      registration?.phone_number ?? registration?.owner_contact_number ?? "",
    address: registration?.address ?? "",
    id_number:
      registration?.id_number ?? registration?.owner_nic_or_passport ?? "",
  };

  /** True when the optional tab has nothing on it — typed or already saved. */
  function smsIsEmpty(data: FormData): boolean {
    const alreadyOnFile = Boolean(
      smsLenz?.sender_id ||
        smsLenz?.address ||
        smsLenz?.id_card_front_url ||
        smsLenz?.id_card_back_url ||
        smsLenz?.logo_url,
    );
    if (alreadyOnFile) return false;

    const text = (name: string) => String(data.get(name) ?? "").trim();
    if (text("sender_id") || text("sms_address")) return false;

    for (const name of ["id_card_front", "id_card_back", "logo"]) {
      const value = data.get(name);
      if (value instanceof File && value.size > 0) return false;
    }
    return true;
  }

  /** Validates the required tab. Returns the FormData when it is good. */
  function validated(): FormData | null {
    const form = formRef.current;
    if (!form) return null;
    const data = new FormData(form);

    const check = domainRegistrationSchema.safeParse({
      business_name: String(data.get("business_name") ?? ""),
      full_name: String(data.get("full_name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone_number: String(data.get("phone_number") ?? ""),
      address: String(data.get("address") ?? ""),
      id_number: String(data.get("id_number") ?? ""),
    });

    if (!check.success) {
      const next: Record<string, string> = {};
      for (const issue of check.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      // Required fields live on the first tab — show them the problem.
      setTab("domain");
      return null;
    }

    setFieldErrors({});
    return data;
  }

  function send(data: FormData) {
    setConfirmSkip(false);
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await submitClientForms(token, data);
      if (result.ok) {
        setSaved(true);
      } else {
        setError(result.error);
        if (result.field) {
          setFieldErrors({ [result.field]: result.error });
          setTab("domain");
        }
      }
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = validated();
    if (!data) return;

    // Leaving the optional form blank is allowed, but it is worth one check
    // that it was a choice rather than an oversight.
    if (smsIsEmpty(data)) {
      setConfirmSkip(true);
      return;
    }
    send(data);
  }

  // Escape dismisses the confirmation without submitting either way.
  useEffect(() => {
    if (!confirmSkip) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirmSkip(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmSkip]);

  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    setTab((current) => (current === "domain" ? "sms" : "domain"));
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        className="register-form flex flex-col gap-8"
      >
        {/* Tabs. The active one sits flush on the panel below — the shared
            bottom rule plus `-mb-px` is what makes them read as tabs rather
            than as two separate buttons. */}
        <div role="tablist" aria-label="Forms" className="flex border-b border-taupe">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={active}
                aria-controls={`panel-${item.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(item.id)}
                onKeyDown={onTabKeyDown}
                className={`-mb-px flex items-center gap-2 border-x border-t px-4 py-3 text-[11px] font-bold tracking-[0.14em] uppercase transition-colors duration-200 sm:px-5 ${
                  active
                    ? "border-taupe border-b border-b-background bg-background text-foreground"
                    : "border-transparent bg-surface/60 text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {item.optional && (
                  <span className="font-normal normal-case opacity-70">
                    optional
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* --- Domain registration (required) --- */}
        <div
          id="panel-domain"
          role="tabpanel"
          aria-labelledby="tab-domain"
          hidden={tab !== "domain"}
          className="flex flex-col gap-6"
        >
          {DOMAIN_FIELDS.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="admin-label">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete ?? "off"}
                defaultValue={initial[field.name]}
                aria-invalid={Boolean(fieldErrors[field.name])}
                className="admin-input"
              />
              {fieldErrors[field.name] && (
                <p className="mt-1.5 text-xs text-red-600">
                  {fieldErrors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* --- SMS Lenz (optional) --- */}
        <div
          id="panel-sms"
          role="tabpanel"
          aria-labelledby="tab-sms"
          hidden={tab !== "sms"}
          className="flex flex-col gap-6"
        >
          <p className="border border-border bg-surface/60 px-4 py-3 text-sm leading-relaxed">
            This form is optional — only complete it if you need a custom SMS
            Sender ID approved.
          </p>

          <div>
            <label htmlFor="sender_id" className="admin-label">
              Sender ID
            </label>
            <input
              id="sender_id"
              name="sender_id"
              autoComplete="off"
              defaultValue={smsLenz?.sender_id ?? ""}
              className="admin-input"
            />
          </div>

          <div>
            <label htmlFor="sms_address" className="admin-label">
              Address
            </label>
            <input
              id="sms_address"
              name="sms_address"
              autoComplete="off"
              defaultValue={smsLenz?.address ?? ""}
              className="admin-input"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <IdCardUpload
              name="id_card_front"
              label="ID card — front"
              hint="Tap the card to add a photo"
              existingUrl={smsLenz?.id_card_front_url ?? null}
            />
            <IdCardUpload
              name="id_card_back"
              label="ID card — back"
              hint="Tap the card to add a photo"
              existingUrl={smsLenz?.id_card_back_url ?? null}
            />
          </div>

          <IdCardUpload
            name="logo"
            label="Logo"
            shape="square"
            hint="Tap to add your logo"
            existingUrl={smsLenz?.logo_url ?? null}
          />
        </div>

        {/* Feedback and submit are shared — one button saves both forms. */}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {saved && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
          >
            <Check size={15} strokeWidth={2.5} />
            Saved.
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors duration-300 hover:bg-charcoal disabled:opacity-50"
          >
            {pending ? "Saving…" : registration ? "Update details" : "Submit"}
          </button>
          <p className="mt-3 text-xs text-muted">Submits both forms together.</p>
        </div>
      </form>

      {/* Skip confirmation — shown only when the optional tab is untouched. */}
      <AnimatePresence>
        {confirmSkip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="skip-title"
            className="fixed inset-0 z-[130] flex items-end justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:items-center"
            onClick={(event) => {
              if (event.target === event.currentTarget) setConfirmSkip(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE_PREMIUM }}
              className="w-full max-w-md border border-border bg-background p-6 shadow-[0_28px_60px_-24px_rgba(11,11,11,0.45)] sm:p-7"
            >
              <h2
                id="skip-title"
                className="text-lg font-medium tracking-tight"
              >
                Submit without the SMS Lenz form?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                You haven&rsquo;t filled in the SMS Lenz Approval form. It&rsquo;s
                optional — only needed if you want a custom SMS Sender ID
                approved. You can still add it later using this same link.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    setConfirmSkip(false);
                    setTab("sms");
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-[12px] font-bold tracking-[0.16em] text-background uppercase transition-colors duration-300 hover:bg-charcoal"
                >
                  Fill it in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const data = validated();
                    if (data) send(data);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-foreground/25 px-6 py-3 text-[12px] font-bold tracking-[0.16em] uppercase transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  No, submit anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
