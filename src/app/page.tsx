import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBrands from "@/components/TrustedBrands";
import Services from "@/components/Services";
import FeaturedWork from "@/components/FeaturedWork";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Switch to variant="stats" for animated counters instead of logos */}
        <TrustedBrands variant="marquee" />
        <Services />
        <FeaturedWork />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
