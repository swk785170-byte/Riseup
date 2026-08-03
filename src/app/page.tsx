import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBrands from "@/components/TrustedBrands";
import Services from "@/components/Services";
import FeaturedWork from "@/components/FeaturedWork";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getClientLogos } from "@/lib/data/client-logos";

export default async function Home() {
  const [featured, clientLogos] = await Promise.all([
    getFeaturedProjects(3),
    getClientLogos(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Switch to variant="stats" for animated counters instead of logos */}
        <TrustedBrands variant="marquee" logos={clientLogos} />
        <Services />
        <FeaturedWork projects={featured} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
