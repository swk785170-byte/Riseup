import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartSystemsHero from "@/components/SmartSystemsHero";
import SmartSystemsDiagram from "@/components/SmartSystemsDiagram";
import SmartCardFeature from "@/components/SmartCardFeature";
import FutureSystemsTeaser from "@/components/FutureSystemsTeaser";

export const metadata: Metadata = {
  title: "Smart Systems — RISE UP MEDIA",
  description:
    "The Smart Management System (SMS) ecosystem from Rise Up Media — smart cards, LMS, paper class, parent SMS and income management connected through one core platform.",
  openGraph: {
    title: "Smart Systems — RISE UP MEDIA",
    description:
      "One connected ecosystem for learning, attendance, records and income.",
    type: "website",
  },
};

export default function SmartSystemsPage() {
  return (
    <>
      <Navbar />
      <main>
        <SmartSystemsHero />
        <SmartSystemsDiagram />
        <SmartCardFeature />
        <FutureSystemsTeaser />
      </main>
      <Footer />
    </>
  );
}
