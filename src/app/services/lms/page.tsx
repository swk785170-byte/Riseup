import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LMSHero from "@/components/LMSHero";
import SmartCardFeature from "@/components/SmartCardFeature";
import LMSServices from "@/components/LMSServices";
import LMSTechStack from "@/components/LMSTechStack";
import LMSCustomers from "@/components/LMSCustomers";

export const metadata: Metadata = {
  title: "LMS — RISE UP MEDIA",
  description:
    "Rise Up Media's Learning Management System for modern institutions — courses, grading, smart-card attendance, paper-class digitisation and student registration in one connected platform.",
  openGraph: {
    title: "LMS — RISE UP MEDIA",
    description:
      "A Learning Management System built for modern institutions — one connected platform for learning, records and admin.",
    type: "website",
  },
};

export default function LMSPage() {
  return (
    <>
      <Navbar />
      <main>
        <LMSHero />
        <SmartCardFeature />
        <LMSServices />
        <LMSTechStack />
        <LMSCustomers />
      </main>
      <Footer />
    </>
  );
}
