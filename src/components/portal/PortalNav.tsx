"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOutClient } from "@/lib/actions/portal";

const LINKS = [
  { href: "/portal/domain-registration", label: "Domain" },
  { href: "/portal/messages", label: "Messages" },
];

export default function PortalNav({
  name,
  company,
}: {
  name: string;
  company: string | null;
}) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <nav className="flex items-center gap-4 sm:gap-6">
        {LINKS.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`text-[12px] font-bold tracking-[0.14em] uppercase transition-colors ${
                active ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <span className="hidden text-right text-xs leading-tight text-muted md:block">
        <span className="block font-medium text-foreground">{name}</span>
        {company && <span className="block">{company}</span>}
      </span>

      <form action={() => startTransition(() => void signOutClient())}>
        <button
          type="submit"
          disabled={pending}
          aria-label="Sign out"
          className="admin-icon-btn"
        >
          <LogOut size={15} />
        </button>
      </form>
    </div>
  );
}
