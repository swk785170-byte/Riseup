import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Team from "@/components/Team";
import AboutDescription from "@/components/AboutDescription";
import AboutGallery from "@/components/AboutGallery";
import AboutContact from "@/components/AboutContact";
import { getGalleryImages, getTeamMembers } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About — RISEUP SOLUTIONS",
  description:
    "Meet the small, senior team behind Riseup Solutions — designers and engineers building websites and systems that grow businesses. Reach us by email or WhatsApp.",
  openGraph: {
    title: "About — RISEUP SOLUTIONS",
    description:
      "The designers and engineers behind Riseup Solutions, and how to reach us.",
    type: "website",
  },
};

export default async function AboutPage() {
  const [team, gallery] = await Promise.all([
    getTeamMembers(),
    getGalleryImages(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Team members={team} />
        <AboutDescription />
        <AboutGallery images={gallery} />
        <AboutContact />
      </main>
      <Footer />
    </>
  );
}
