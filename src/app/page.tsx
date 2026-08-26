import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBrands from "@/components/TrustedBrands";
import Services from "@/components/Services";
import FeaturedWork from "@/components/FeaturedWork";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getTestimonials } from "@/lib/data/testimonials";
import { getClientLogos } from "@/lib/data/client-logos";

/* Prerendered and refreshed every 5 minutes. Admin edits call
   revalidatePath(), so changes still appear immediately. */
export const revalidate = 300;

export default async function Home() {
  const [featured, clientLogos, testimonials] = await Promise.all([
    getFeaturedProjects(3),
    getClientLogos(),
    getTestimonials(),
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
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
