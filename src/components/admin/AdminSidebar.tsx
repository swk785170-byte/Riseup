"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  Quote,
  Users,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; label: string; icon: LucideIcon };

/**
 * Content sections, moved out of the top bar.
 *
 * The header keeps only the things needed from every screen — registrations,
 * settings, notifications, sign out — so it no longer wraps onto two lines as
 * sections are added.
 */
const ITEMS: Item[] = [
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/client-logos", label: "Client Logos", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/inquiries", label: "Enquiries", icon: Inbox },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  // Matches the section's nested routes too (/admin/projects/new, .../edit).
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: fixed rail beside the content. */}
      <aside className="hidden w-56 shrink-0 border-r border-border lg:block">
        <nav
          aria-label="Content sections"
          className="sticky top-16 flex flex-col gap-1 p-4"
        >
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-bold tracking-[0.12em] uppercase transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-surface hover:text-foreground"
                }`}
              >
                <Icon size={15} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Below lg there is no room for a rail, so the same links become a
          horizontally scrollable strip — every section stays one tap away
          rather than being hidden behind a menu. */}
      <nav
        aria-label="Content sections"
        className="sticky top-16 z-30 -mx-5 overflow-x-auto border-b border-border bg-background/95 px-5 backdrop-blur-sm lg:hidden"
      >
        <div className="flex items-center gap-2 py-3">
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold tracking-[0.12em] uppercase transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground/70 hover:border-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
