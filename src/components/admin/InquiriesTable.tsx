"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, Trash2, Undo2, X } from "lucide-react";
import { deleteInquiry, setInquiryHandled } from "@/lib/actions/inquiries";
import type { DbInquiry } from "@/lib/inquiries";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function InquiriesTable({
  initialInquiries,
}: {
  initialInquiries: DbInquiry[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<DbInquiry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialInquiries;
    return initialInquiries.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.project_type.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q),
    );
  }, [initialInquiries, query]);

  function toggleHandled(inquiry: DbInquiry) {
    startTransition(async () => {
      const res = await setInquiryHandled(inquiry.id, !inquiry.handled);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      const res = await deleteInquiry(id);
      setToDelete(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search
          size={16}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search enquiries…"
          className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-9 text-sm outline-none focus:border-foreground"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface/40 px-4 py-12 text-center text-sm text-muted">
          No enquiries{query ? " match your search" : " yet"}.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((inquiry) => (
            <article
              key={inquiry.id}
              className={`rounded-xl border p-5 ${
                inquiry.handled
                  ? "border-border bg-surface/40 opacity-70"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {inquiry.name}{" "}
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="font-normal text-muted underline-offset-4 hover:text-foreground hover:underline"
                    >
                      &lt;{inquiry.email}&gt;
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {inquiry.project_type} · {formatDate(inquiry.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {inquiry.handled && (
                    <span className="mr-1 rounded-full border border-taupe px-2 py-0.5 text-[10px] font-bold tracking-wider text-charcoal uppercase">
                      Handled
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleHandled(inquiry)}
                    disabled={pending}
                    title={
                      inquiry.handled ? "Mark as unhandled" : "Mark as handled"
                    }
                    className="admin-icon-btn"
                  >
                    {inquiry.handled ? <Undo2 size={15} /> : <Check size={15} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(inquiry)}
                    title="Delete"
                    className="admin-icon-btn hover:!border-red-400 hover:!text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground/85">
                {inquiry.message}
              </p>
            </article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {toDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Cancel"
              onClick={() => setToDelete(null)}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setToDelete(null)}
                className="absolute top-4 right-4 text-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-semibold tracking-tight">
                Delete enquiry?
              </h3>
              <p className="mt-2 text-sm text-muted">
                The message from {toDelete.name} will be permanently removed.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setToDelete(null)}
                  className="rounded-full border border-border px-4 py-2 text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={pending}
                  className="rounded-full bg-red-600 px-4 py-2 text-[12px] font-bold tracking-[0.14em] text-white uppercase hover:bg-red-700 disabled:opacity-60"
                >
                  {pending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
