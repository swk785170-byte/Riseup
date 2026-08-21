import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmsHero from "@/components/SmsHero";
import SmartSystemsDiagram from "@/components/SmartSystemsDiagram";
import SmartCardFeature from "@/components/SmartCardFeature";
import FutureSystemsTeaser from "@/components/FutureSystemsTeaser";

export const metadata: Metadata = {
  title: "Smart Systems — RISEUP SOLUTIONS",
  description:
    "SMS is the Riseup Solutions Smart Management System — the umbrella platform connecting LMS, Smart Card, Paper Class, Parent SMS and Income Management into one ecosystem.",
  openGraph: {
    title: "Smart Systems — RISEUP SOLUTIONS",
    description:
      "One ecosystem, every system connected — the Riseup Solutions Smart Management System.",
    type: "website",
  },
};

export default function SmartSystemsPage() {
  return (
    <>
      <Navbar />
      <main>
        <SmsHero />
        {/* Full-bleed by design — the only section on this page allowed to
            break out of the standard content width. */}
        <SmartSystemsDiagram />
        <SmartCardFeature />
        <FutureSystemsTeaser />
      </main>
      <Footer />
    </>
  );
}
