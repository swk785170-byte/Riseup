import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebPricing from "@/components/WebPricing";
import LMSPricing from "@/components/LMSPricing";
import PricingComparison from "@/components/PricingComparison";
import PricingFAQ from "@/components/PricingFAQ";
import GetQuoteCTA from "@/components/GetQuoteCTA";

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
      </main>
      <Footer />
    </>
  );
}
