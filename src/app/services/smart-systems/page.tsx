import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmsLogo from "@/components/SmsLogo";

export const metadata: Metadata = {
  title: "Smart Systems — RISEUP SOLUTIONS",
  description:
    "The Smart Management System (SMS) from Riseup Solutions — coming soon.",
  openGraph: {
    title: "Smart Systems — RISEUP SOLUTIONS",
    description: "Something new from Riseup Solutions — coming soon.",
    type: "website",
  },
};

export default function SmartSystemsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="flex min-h-screen flex-col items-center justify-center px-5 py-32 text-center md:px-10">
          <SmsLogo className="text-[44px] md:text-[60px]" />

          <h1 className="mt-12 text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.03em]">
            Coming Soon.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            We&rsquo;re building something new here — check back soon.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
