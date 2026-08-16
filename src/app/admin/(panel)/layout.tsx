import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Admin — Riseup Solutions",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/projects"
              aria-label="Admin home"
              className="shrink-0"
            >
              <Logo className="h-6 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 sm:flex">
              <Link
                href="/admin/projects"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Projects
              </Link>
              <Link
                href="/admin/posts"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Posts
              </Link>
              <Link
                href="/admin/client-logos"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Client Logos
              </Link>
              <Link
                href="/admin/testimonials"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Testimonials
              </Link>
              <Link
                href="/admin/team"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Team
              </Link>
              <Link
                href="/admin/gallery"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Gallery
              </Link>
              <Link
                href="/admin/inquiries"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Enquiries
              </Link>
              <Link
                href="/admin/settings"
                className="text-[12px] font-bold tracking-[0.14em] text-foreground/70 uppercase transition-colors hover:text-foreground"
              >
                Settings
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
