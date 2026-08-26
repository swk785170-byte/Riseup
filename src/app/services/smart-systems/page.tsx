import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd, { breadcrumbSchema, serviceSchema } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site-url";
import SmartSystemsDiagram from "@/components/SmartSystemsDiagram";
import SmartCardFeature from "@/components/SmartCardFeature";
import FutureSystemsTeaser from "@/components/FutureSystemsTeaser";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Smart Systems — RISEUP SOLUTIONS",
  alternates: { canonical: "/services/smart-systems" },
  description:
    "SMS is the Riseup Solutions Smart Management System — the umbrella platform connecting LMS, Smart Card, Paper Class, Parent SMS and Income Management into one ecosystem.",
  openGraph: {
    title: "Smart Systems — RISEUP SOLUTIONS",
    description:
      "One ecosystem, every system connected — the Riseup Solutions Smart Management System.",
    type: "website",
  },
};


/* Prerendered and refreshed every 5 minutes. Admin edits call
   revalidatePath(), so changes still appear immediately. */
export const revalidate = 300;

export default function SmartSystemsPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          siteUrl: siteUrl(),
          name: 'SMS — Smart Management System',
          description: 'The Riseup Solutions umbrella platform connecting LMS, Smart Card, Paper Class, Parent SMS and Income Management into one ecosystem.',
          path: '/services/smart-systems',
        })}
      />
      <JsonLd
        data={breadcrumbSchema(siteUrl(), [
          { name: "Home", path: "/" },
          { name: 'SMS — Smart Management System', path: '/services/smart-systems' },
        ])}
      />
      <Navbar />
      <main>
        {/* The hero is the SMS logo, so the page had no h1 at all — neither for
            search engines nor for screen readers. This supplies one without
            altering the visual design. */}
        <h1 className="sr-only">
          SMS — Smart Management System by Riseup Solutions
        </h1>
        {/* Hero and ecosystem are one component: the SMS logo is a single
            element that scrubs from the hero into the diagram's hub slot, so
            they cannot be separate sections. Full-bleed by design — the only
            part of this page that breaks out of the standard content width. */}
        <SmartSystemsDiagram />
        <SmartCardFeature />
        <FutureSystemsTeaser />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
