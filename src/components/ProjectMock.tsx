"use client";

import type { MockVariant, Tint } from "@/lib/projects";

/* ------------------------------------------------------------------ */
/*  Pure-CSS website mockup used as project artwork (no image assets)  */
/* ------------------------------------------------------------------ */

function MockBlocks({ variant, tint }: { variant: MockVariant; tint: Tint }) {
  if (variant === "commerce") {
    return (
      <div className="grid flex-1 grid-cols-3 gap-[4%] p-[6%]">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col gap-[8%]">
            <div
              className="w-full flex-1 rounded-[4px]"
              style={{ background: i % 2 === 0 ? tint.soft : tint.bg }}
            />
            <div
              className="h-[7%] w-4/5 rounded-full"
              style={{ background: tint.deep, opacity: 0.55 }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="flex flex-1 gap-[4%] p-[6%]">
        <div
          className="h-full w-[22%] rounded-[4px]"
          style={{ background: tint.deep, opacity: 0.85 }}
        />
        <div className="flex flex-1 flex-col justify-end gap-[6%]">
          <div className="flex flex-1 items-end gap-[5%]">
            {[38, 62, 46, 82, 58, 95, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[3px]"
                style={{
                  height: `${h}%`,
                  background: i === 5 ? tint.deep : tint.soft,
                }}
              />
            ))}
          </div>
          <div
            className="h-[9%] w-2/3 rounded-full"
            style={{ background: tint.deep, opacity: 0.5 }}
          />
        </div>
      </div>
    );
  }

  if (variant === "editorial") {
    return (
      <div className="flex flex-1 flex-col gap-[5%] p-[7%]">
        <div
          className="h-[16%] w-3/4 rounded-[3px]"
          style={{ background: tint.deep, opacity: 0.8 }}
        />
        <div
          className="h-[6%] w-1/2 rounded-full"
          style={{ background: tint.deep, opacity: 0.35 }}
        />
        <div className="mt-auto flex h-[46%] gap-[4%]">
          <div
            className="h-full flex-1 rounded-[4px]"
            style={{ background: tint.soft }}
          />
          <div className="flex h-full flex-1 flex-col gap-[8%]">
            {[0.5, 0.38, 0.44, 0.3].map((o, i) => (
              <div
                key={i}
                className="h-[12%] w-full rounded-full"
                style={{ background: tint.deep, opacity: o }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // landing
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[5%] p-[7%]">
      <div
        className="h-[14%] w-4/5 rounded-[3px]"
        style={{ background: tint.deep, opacity: 0.8 }}
      />
      <div
        className="h-[14%] w-3/5 rounded-[3px]"
        style={{ background: tint.deep, opacity: 0.8 }}
      />
      <div
        className="h-[6%] w-2/5 rounded-full"
        style={{ background: tint.deep, opacity: 0.35 }}
      />
      <div className="h-[11%] w-[26%] rounded-full bg-foreground" />
      <div className="mt-[3%] flex h-[22%] w-full gap-[4%]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-full flex-1 rounded-[4px]"
            style={{ background: i === 1 ? tint.soft : tint.bg }}
          />
        ))}
      </div>
    </div>
  );
}

export function BrowserMock({
  tint,
  variant,
  className = "",
}: {
  tint: Tint;
  variant: MockVariant;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(150deg, ${tint.bg} 0%, ${tint.soft} 130%)`,
      }}
    >
      <div className="absolute inset-x-[9%] top-[10%] bottom-0 flex flex-col overflow-hidden rounded-t-lg bg-[#fbfaf8] shadow-[0_18px_44px_-18px_rgba(10,10,10,0.4)]">
        {/* Browser chrome */}
        <div className="flex h-[8%] min-h-6 items-center gap-1.5 border-b border-black/5 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
          <span className="ml-2 h-2 w-2/5 rounded-full bg-black/[0.06]" />
        </div>
        <MockBlocks variant={variant} tint={tint} />
      </div>
    </div>
  );
}
