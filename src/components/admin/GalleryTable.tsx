"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Pencil, Trash2, X } from "lucide-react";
import { deleteGalleryImage, moveGalleryImage } from "@/lib/actions/site";
import type { DbGalleryImage } from "@/lib/gallery";

export default function GalleryTable({
  initialImages,
}: {
  initialImages: DbGalleryImage[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<DbGalleryImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  function move(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const res = await moveGalleryImage(id, direction);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      const res = await deleteGalleryImage(id);
      setToDelete(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {initialImages.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface/40 px-4 py-12 text-center text-sm text-muted">
          No gallery photos yet — the &ldquo;Life at Rise Up&rdquo; section is
          hidden on the About page until you add one.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {initialImages.map((img, i) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt={img.alt ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-border p-2">
                <span className="truncate px-1 text-xs text-muted">
                  {img.alt || "—"}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(img.id, "up")}
                    disabled={pending || i === 0}
                    title="Move earlier"
                    className="admin-icon-btn !h-7 !w-7"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(img.id, "down")}
                    disabled={pending || i === initialImages.length - 1}
                    title="Move later"
                    className="admin-icon-btn !h-7 !w-7"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <Link
                    href={`/admin/gallery/${img.id}/edit`}
                    title="Edit"
                    className="admin-icon-btn !h-7 !w-7"
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(img)}
                    title="Delete"
                    className="admin-icon-btn !h-7 !w-7 hover:!border-red-400 hover:!text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
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
                Delete photo?
              </h3>
              <p className="mt-2 text-sm text-muted">
                This photo will be removed from the About gallery. This
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
