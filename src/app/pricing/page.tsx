import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WebPricing from "@/components/WebPricing";
import LMSPricing from "@/components/LMSPricing";
import PricingComparison from "@/components/PricingComparison";
import PricingFAQ from "@/components/PricingFAQ";
import GetQuoteCTA from "@/components/GetQuoteCTA";

export const metadata: Metadata = {
  title: "Pricing — RISE UP MEDIA",
  description:
    "Transparent pricing for Rise Up Media web packages and LMS / student management systems — or a custom quote for something bespoke.",
  openGraph: {
    title: "Pricing — RISE UP MEDIA",
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
