import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsHero from "@/components/ProjectsHero";
import ProjectsArchive from "@/components/ProjectsArchive";
import ProjectsCTA from "@/components/ProjectsCTA";
import { getAllProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projects — RISE UP MEDIA",
  description:
    "The full Rise Up Media portfolio — storefronts, web apps, brand sites and SEO rebuilds, each shipped with measurable results. Filter by discipline and explore the case studies.",
  openGraph: {
    title: "Projects — RISE UP MEDIA",
    description:
      "The full portfolio of websites Rise Up Media has designed, built and grown.",
    type: "website",
  },
};

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
