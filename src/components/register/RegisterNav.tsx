"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The two forms a client is asked to complete through their link. */
export default function RegisterNav({ token }: { token: string }) {
  const pathname = usePathname();
  const base = `/register/${token}`;

  const items = [
    { href: base, label: "Domain Registration" },
    { href: `${base}/sms-lenz`, label: "SMS Lenz Approval", optional: true },
  ];

  return (
    <nav aria-label="Forms" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`border px-4 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-colors duration-300 ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-taupe bg-surface text-foreground/70 hover:border-foreground"
            }`}
          >
            {item.label}
            {item.optional && (
              <span
                className={`ml-2 font-normal normal-case ${active ? "text-background/60" : "text-muted"}`}
              >
                optional
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
