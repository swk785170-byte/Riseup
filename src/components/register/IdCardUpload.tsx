"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { compressImage } from "@/lib/image-compress";
import { UPLOAD_MAX_BYTES } from "@/lib/schemas/portal";

function kb(bytes: number): string {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * A click-to-upload tile shaped like the thing it holds.
 *
 * ID card sides use the ID-1 ratio (85.6 × 54 mm — the same 1.586 as a bank
 * card), so the empty box reads as "put a card here" before anything is
 * chosen. The logo tile is square instead.
 *
 * The chosen file is downscaled in the browser and written back into the input
 * via DataTransfer, so the form posts the SMALL file. Without that the
 * original multi-megabyte photo would blow the Server Action body limit and
 * fail with an opaque server error.
 */
export default function IdCardUpload({
  name,
  label,
  hint,
  existingUrl,
  shape = "card",
}: {
  name: string;
  label: string;
  hint?: string;
  existingUrl: string | null;
  shape?: "card" | "square";
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Object URLs hold the file in memory until explicitly released.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function replacePreview(url: string | null) {
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  }

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const original = event.target.files?.[0] ?? null;
    setError(null);

    if (!original) {
      replacePreview(null);
      setFileName(null);
      setFileSize(null);
      return;
    }

    setBusy(true);
    const result = await compressImage(original);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      clear();
      return;
    }

    // Last line of defence: an image that resists compression (already small
    // dimensions but huge, say) is rejected here with a readable message
    // rather than becoming a server-side exception.
    if (result.file.size > UPLOAD_MAX_BYTES) {
      setError("That image is too large. Try a smaller photo.");
      clear();
      return;
    }

    /*
     * Write the compressed file back into the input. FormData reads from
     * `input.files`, so this is what makes the form post the small version
     * instead of the original the user picked.
     */
    const transfer = new DataTransfer();
    transfer.items.add(result.file);
    if (inputRef.current) inputRef.current.files = transfer.files;

    replacePreview(URL.createObjectURL(result.file));
    setFileName(original.name);
    setFileSize(result.file.size);
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    replacePreview(null);
    setFileName(null);
    setFileSize(null);
  }

  // A freshly chosen file wins; otherwise show whatever is already on file.
  const shown = preview ?? existingUrl;
  const ratio = shape === "card" ? "aspect-[1.586/1]" : "aspect-square";

  return (
    <div className="flex flex-col gap-2">
      <span className="admin-label">{label}</span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={`${label} — choose an image`}
        aria-busy={busy}
        className={`group relative w-full max-w-72 ${ratio} overflow-hidden border-2 border-dashed border-taupe bg-surface/60 transition-colors duration-300 hover:border-foreground`}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shown}
            alt={`${label} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted transition-colors duration-300 group-hover:text-foreground">
            <ImagePlus size={22} strokeWidth={1.75} />
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase">
              Tap to upload
            </span>
          </span>
        )}

        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 size={20} className="animate-spin" />
          </span>
        )}
      </button>

      {/* Visually hidden, but a real input so the file posts with the form. */}
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={onChange}
        className="sr-only"
      />

      <div className="flex min-h-5 flex-wrap items-center gap-2 text-xs text-muted">
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : busy ? (
          <span>Preparing image…</span>
        ) : fileName ? (
          <>
            <span className="max-w-40 truncate">{fileName}</span>
            {fileSize !== null && <span>({kb(fileSize)})</span>}
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4"
            >
              <RotateCcw size={11} strokeWidth={2.5} />
              Undo
            </button>
          </>
        ) : existingUrl ? (
          <span>Already uploaded — choose a file to replace it.</span>
        ) : (
          hint && <span>{hint}</span>
        )}
      </div>
    </div>
  );
}
