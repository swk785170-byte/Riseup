import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import Team from "@/components/Team";
import AboutDescription from "@/components/AboutDescription";
import AboutContact from "@/components/AboutContact";

export const metadata: Metadata = {
  title: "About — RISE UP MEDIA",
  description:
    "Meet the small, senior team behind Rise Up Media — designers and engineers building websites that grow businesses. Reach us by email or WhatsApp.",
  openGraph: {
    title: "About — RISE UP MEDIA",
    description:
      "The designers and engineers behind Rise Up Media, and how to reach us.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <Team />
        <AboutDescription />
        <AboutContact />
      </main>
      <Footer />
    </>
  );
}
