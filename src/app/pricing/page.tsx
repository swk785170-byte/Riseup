import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebPricing from "@/components/WebPricing";
import LMSPricing from "@/components/LMSPricing";
import PricingComparison from "@/components/PricingComparison";
import PricingFAQ from "@/components/PricingFAQ";
import GetQuoteCTA from "@/components/GetQuoteCTA";
import Contact from "@/components/Contact";
import { FAQS } from "@/lib/faqs";
import JsonLd, { breadcrumbSchema, faqSchema } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Pricing — RISEUP SOLUTIONS",
  alternates: { canonical: "/pricing" },
  description:
    "Transparent pricing for Riseup Solutions web packages and LMS / student management systems — or a custom quote for something bespoke.",
  openGraph: {
    title: "Pricing — RISEUP SOLUTIONS",
    description:
      "Transparent packages for websites and school systems, plus custom quotes.",
    type: "website",
  },
};


/* Prerendered and refreshed every 5 minutes. Admin edits call
   revalidatePath(), so changes still appear immediately. */
export const revalidate = 300;

export default function PricingPage() {
  return (
    <>
      {/* FAQPage markup makes these six answers eligible for featured
          snippets and People-Also-Ask, and gives AI engines a clean Q&A pair
          to quote. */}
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd
        data={breadcrumbSchema(siteUrl(), [
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <Navbar />
      <main>
        <WebPricing />
        <LMSPricing />
        <PricingComparison />
        <PricingFAQ />
        <GetQuoteCTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
