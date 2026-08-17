"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Mail, X } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { setInquiryHandled } from "@/lib/actions/inquiries";
import type { DbInquiry } from "@/lib/inquiries";

const MAX_ITEMS = 10;
const TOAST_MS = 7000;

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/**
 * Live notification bell for the admin panel.
 *
 * Source of truth is the `inquiries` table: an enquiry that hasn't been marked
 * handled is an outstanding notification. The initial list is rendered on the
 * server; a Supabase Realtime subscription then keeps it current without
 * polling, so a form submission appears here within a second of being sent.
 *
 * Realtime inherits the table's RLS, so only signed-in admins receive events.
 */
export default function NotificationBell({
  initialItems,
}: {
  initialItems: DbInquiry[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<DbInquiry[]>(initialItems);
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState(false);
  const [toast, setToast] = useState<DbInquiry | null>(null);
  const [pending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // Server-rendered list wins on navigation between admin pages.
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const upsert = useCallback((row: DbInquiry) => {
    setItems((prev) => {
      const without = prev.filter((i) => i.id !== row.id);
      if (row.handled) return without; // handled → no longer outstanding
      return [row, ...without]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, MAX_ITEMS);
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  /* ---------------- Realtime subscription ---------------- */
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase
      .channel("admin:inquiries")
      .on<DbInquiry>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inquiries" },
        (payload) => {
          const row = payload.new;
          upsert(row);
          setToast(row);
          window.clearTimeout(toastTimer.current);
          toastTimer.current = window.setTimeout(
            () => setToast(null),
            TOAST_MS,
          );
          // Keep any open server-rendered list in step.
          router.refresh();
        },
      )
      .on<DbInquiry>(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "inquiries" },
        (payload) => upsert(payload.new),
      )
      .on<DbInquiry>(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "inquiries" },
        (payload) => {
          const old = payload.old;
          if (old && typeof old.id === "string") remove(old.id);
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      window.clearTimeout(toastTimer.current);
      supabase.removeChannel(channel);
    };
  }, [upsert, remove, router]);

  /* ---------------- Close on outside click / Escape ---------------- */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function markHandled(id: string) {
    remove(id); // optimistic
    startTransition(async () => {
      const res = await setInquiryHandled(id, true);
      if (!res.ok) router.refresh(); // failed → let the server correct us
    });
  }

  const count = items.length;

  return (
    <>
      <div ref={panelRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={
            count > 0 ? `Notifications (${count} unread)` : "Notifications"
          }
          aria-expanded={open}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
        >
          <Bell size={17} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
              {count > 9 ? "9+" : count}
            </span>
          )}
          {/* Quiet live-connection dot */}
          <span
            aria-hidden
            title={live ? "Live" : "Reconnecting…"}
            className={`absolute -bottom-0.5 -left-0.5 h-2 w-2 rounded-full ${
              live ? "bg-emerald-500" : "bg-taupe"
            }`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-xl border border-border bg-background shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-[11px] font-bold tracking-[0.16em] text-muted uppercase">
                  Notifications
                </p>
                <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">
                  {live ? "Live" : "Offline"}
                </span>
              </div>

              {count === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted">
                  You&rsquo;re all caught up.
                </p>
              ) : (
                <ul className="max-h-[22rem] divide-y divide-border overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.id} className="px-4 py-3 hover:bg-surface/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-sm font-semibold">
                            <Mail size={13} className="shrink-0 text-muted" />
                            <span className="truncate">{item.name}</span>
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {item.project_type} · {timeAgo(item.created_at)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-foreground/70">
                            {item.message}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => markHandled(item.id)}
                          disabled={pending}
                          title="Mark handled"
                          className="admin-icon-btn !h-7 !w-7 shrink-0"
                        >
                          <Check size={13} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/admin/inquiries"
                onClick={() => setOpen(false)}
                className="block border-t border-border px-4 py-3 text-center text-[11px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:bg-surface hover:text-foreground"
              >
                View all enquiries
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Arrival toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="fixed right-5 bottom-5 z-[70] w-[20rem] rounded-xl border border-border bg-background p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
                  New enquiry
                </p>
                <p className="mt-1 truncate text-sm font-semibold">
                  {toast.name} · {toast.project_type}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {toast.message}
                </p>
                <Link
                  href="/admin/inquiries"
                  onClick={() => setToast(null)}
                  className="mt-2 inline-block text-[11px] font-bold tracking-[0.14em] uppercase underline-offset-4 hover:underline"
                >
                  Read it
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Dismiss"
                className="shrink-0 text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
