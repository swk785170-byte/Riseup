import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Team from "@/components/Team";
import AboutDescription from "@/components/AboutDescription";
import AboutGallery from "@/components/AboutGallery";
import AboutContact from "@/components/AboutContact";

export const metadata: Metadata = {
  title: "About — RISE UP MEDIA",
  description:
    "Meet the small, senior team behind Rise Up Media — designers and engineers building websites and systems that grow businesses. Reach us by email or WhatsApp.",
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
        <Team />
        <AboutDescription />
        <AboutGallery />
        <AboutContact />
      </main>
      <Footer />
    </>
  );
}
