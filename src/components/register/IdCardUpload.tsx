"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw } from "lucide-react";

/**
 * A click-to-upload tile shaped like the thing it holds.
 *
 * ID card sides use the ID-1 ratio (85.6 × 54 mm — the same 1.586 as a bank
 * card), so the empty box already reads as "put a card here" before anything
 * is selected. The logo tile is square instead.
 *
 * The preview comes from an object URL created locally, so the client sees
 * their photo immediately without waiting for an upload round-trip — the file
 * itself is only sent when the form is submitted.
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

  // Object URLs hold the file in memory until explicitly released.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return file ? URL.createObjectURL(file) : null;
    });
    setFileName(file?.name ?? null);
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setFileName(null);
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
        {fileName ? (
          <>
            <span className="max-w-44 truncate">{fileName}</span>
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
