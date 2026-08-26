import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/admin/LogoutButton";
import NotificationBell from "@/components/admin/NotificationBell";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getUnhandledInquiries } from "@/lib/data/inquiries";

/* The whole admin tree is per-user and reads the session cookie, so it must
   never be statically prerendered. Declared once here rather than repeated on
   every page — the public site stays static. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Riseup Solutions",
  robots: { index: false, follow: false },
};

/** Header links: only what is needed from every screen. */
const HEADER_LINKS = [
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initial state for the bell; Realtime keeps it current from here.
  const outstanding = await getUnhandledInquiries();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              href="/admin/registrations"
              aria-label="Admin home"
              className="shrink-0"
            >
              <Logo className="h-6 w-auto" />
            </Link>
            <nav
              aria-label="Primary"
              className="flex items-center gap-4 sm:gap-6"
            >
              {HEADER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-bold tracking-[0.12em] text-foreground/70 uppercase transition-colors hover:text-foreground sm:text-[12px] sm:tracking-[0.14em]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <NotificationBell initialItems={outstanding} />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content sections live in the rail; the header stays uncluttered. */}
      <div className="mx-auto flex max-w-[1400px] flex-col px-5 lg:flex-row lg:gap-8 lg:px-0">
        <AdminSidebar />
        <main className="min-w-0 flex-1 py-10 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
