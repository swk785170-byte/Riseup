"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Search, Trash2, X } from "lucide-react";
import { deletePost } from "@/lib/actions/posts";
import type { DbPost } from "@/lib/posts";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export default function PostsTable({
  initialPosts,
}: {
  initialPosts: DbPost[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<DbPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialPosts;
    return initialPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.author ?? "").toLowerCase().includes(q),
    );
  }, [initialPosts, query]);

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      const res = await deletePost(id);
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
          placeholder="Search posts…"
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
          No posts{query ? " match your search" : " yet"}.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-surface/60 text-[11px] tracking-widest text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-bold">Post</th>
                <th className="hidden px-4 py-3 font-bold md:table-cell">
                  Author
                </th>
                <th className="hidden px-4 py-3 font-bold sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
                        {post.cover_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.cover_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-xs text-muted">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">
                    {post.author ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="px-4 py-3">
                    {post.published ? (
                      <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold tracking-wider text-background uppercase">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full border border-taupe px-2 py-0.5 text-[10px] font-bold tracking-wider text-charcoal uppercase">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        title="Edit"
                        className="admin-icon-btn"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setToDelete(post)}
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
                Delete post?
              </h3>
              <p className="mt-2 text-sm text-muted">
                &ldquo;{toDelete.title}&rdquo; will be permanently removed. This
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
