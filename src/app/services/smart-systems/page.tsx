import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        {/* Hero and ecosystem are one component: the SMS logo is a single
            element that scrubs from the hero into the diagram's hub slot, so
            they cannot be separate sections. Full-bleed by design — the only
            part of this page that breaks out of the standard content width. */}
        <SmartSystemsDiagram />
        <SmartCardFeature />
        <FutureSystemsTeaser />
      </main>
      <Footer />
    </>
  );
}
