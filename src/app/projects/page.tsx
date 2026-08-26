import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsHero from "@/components/ProjectsHero";
import ProjectsArchive from "@/components/ProjectsArchive";
import ProjectsCTA from "@/components/ProjectsCTA";
import { getAllProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projects — RISEUP SOLUTIONS",
  description:
    "The full Riseup Solutions portfolio — storefronts, web apps, brand sites and SEO rebuilds, each shipped with measurable results. Filter by discipline and explore the case studies.",
  openGraph: {
    title: "Projects — RISEUP SOLUTIONS",
    description:
      "The full portfolio of websites Riseup Solutions has designed, built and grown.",
    type: "website",
  },
};


/* Prerendered and refreshed every 5 minutes. Admin edits call
   revalidatePath(), so changes still appear immediately. */
export const revalidate = 300;

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <Navbar />
      <main>
        <ProjectsHero />
        <ProjectsArchive projects={projects} />
        <ProjectsCTA />
      </main>
      <Footer />
    </>
  );
}
