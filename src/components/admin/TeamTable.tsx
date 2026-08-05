"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Pencil, Trash2, User, X } from "lucide-react";
import { deleteTeamMember, moveTeamMember } from "@/lib/actions/site";
import type { DbTeamMember } from "@/lib/team";

export default function TeamTable({
  initialMembers,
}: {
  initialMembers: DbTeamMember[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<DbTeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  function move(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const res = await moveTeamMember(id, direction);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      const res = await deleteTeamMember(id);
      setToDelete(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  const socialCount = (m: DbTeamMember) =>
    [m.instagram_url, m.linkedin_url, m.website_url].filter(Boolean).length;

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {initialMembers.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface/40 px-4 py-12 text-center text-sm text-muted">
          No team members yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-border bg-surface/60 text-[11px] tracking-widest text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">Member</th>
                <th className="hidden px-4 py-3 font-bold sm:table-cell">
                  Socials
                </th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialMembers.map((m, i) => (
                <tr key={m.id} className="hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
                        {m.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.photo_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-muted" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-xs text-muted">{m.role ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {socialCount(m)} of 3 set
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => move(m.id, "up")}
                        disabled={pending || i === 0}
                        title="Move up"
                        className="admin-icon-btn"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(m.id, "down")}
                        disabled={pending || i === initialMembers.length - 1}
                        title="Move down"
                        className="admin-icon-btn"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <Link
                        href={`/admin/team/${m.id}/edit`}
                        title="Edit"
                        className="admin-icon-btn"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setToDelete(m)}
                        title="Delete"
                        className="admin-icon-btn hover:!border-red-400 hover:!text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                Remove team member?
              </h3>
              <p className="mt-2 text-sm text-muted">
                {toDelete.name} will be removed from the About page. This
                can&rsquo;t be undone.
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
                  {pending ? "Removing…" : "Remove"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
