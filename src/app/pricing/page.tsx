import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebPricing from "@/components/WebPricing";
import LMSPricing from "@/components/LMSPricing";
import PricingComparison from "@/components/PricingComparison";
import PricingFAQ from "@/components/PricingFAQ";
import GetQuoteCTA from "@/components/GetQuoteCTA";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Pricing — RISEUP SOLUTIONS",
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
