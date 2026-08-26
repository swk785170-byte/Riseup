"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { markClientThreadRead, sendAdminMessage } from "@/lib/actions/clients";
import { isMessageSender, type DbMessage } from "@/lib/portal";

function timeLabel(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function toMessage(row: Record<string, unknown>): DbMessage | null {
  if (
    typeof row.id !== "string" ||
    typeof row.client_id !== "string" ||
    typeof row.body !== "string" ||
    typeof row.created_at !== "string" ||
    !isMessageSender(row.sender)
  ) {
    return null;
  }
  return {
    id: row.id,
    client_id: row.client_id,
    sender: row.sender,
    body: row.body,
    read_at: typeof row.read_at === "string" ? row.read_at : null,
    created_at: row.created_at,
  };
}

/**
 * Staff side of one client's thread.
 *
 * The Realtime socket runs under the admin's own session (anon key), so it is
 * governed by the `is_staff()` RLS policy rather than the service role — an
 * admin browser tab has no elevated database access.
 */
export default function AdminMessagePanel({
  clientId,
  clientName,
  initialMessages,
}: {
  clientId: string;
  clientName: string;
  initialMessages: DbMessage[];
}) {
  const [messages, setMessages] = useState<DbMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement | null>(null);

  const upsert = useCallback((row: DbMessage) => {
    setMessages((prev) =>
      prev.some((m) => m.id === row.id)
        ? prev.map((m) => (m.id === row.id ? row : m))
        : [...prev, row],
    );
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    if (initialMessages.some((m) => m.sender === "client" && !m.read_at)) {
      void markClientThreadRead(clientId);
    }
  }, [clientId, initialMessages]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`admin-thread-${clientId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          const row = toMessage(payload.new as Record<string, unknown>);
          if (row) upsert(row);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [clientId, upsert]);

  function send() {
    const body = draft.trim();
    if (!body || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await sendAdminMessage(clientId, { body });
      if (result.ok) setDraft("");
      else setError(result.error);
    });
  }

  return (
    <div className="flex h-[28rem] flex-col rounded-xl border border-border bg-surface/30">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted">
            No messages with {clientName} yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((m) => {
              const fromTeam = m.sender === "admin";
              return (
                <li key={m.id} className={`flex ${fromTeam ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap ${
                        fromTeam
                          ? "bg-foreground text-background"
                          : "border border-border bg-surface text-foreground"
                      }`}
                    >
                      {m.body}
                    </div>
                    <p className={`mt-1 text-[10px] text-muted ${fromTeam ? "text-right" : ""}`}>
                      {fromTeam ? "You" : clientName} · {timeLabel(m.created_at)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-3">
        {error && (
          <p role="alert" className="mb-2 text-xs text-red-600">
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
          <label htmlFor="admin-reply" className="sr-only">
            Reply
          </label>
          <textarea
            id="admin-reply"
            rows={2}
            value={draft}
            maxLength={4000}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={`Reply to ${clientName}…`}
            className="admin-textarea flex-1 resize-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={pending || draft.trim().length === 0}
            aria-label="Send reply"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-charcoal disabled:opacity-40"
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
