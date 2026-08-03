import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LMSHero from "@/components/LMSHero";
import LMSServices from "@/components/LMSServices";
import LMSTechStack from "@/components/LMSTechStack";
import LMSCustomers from "@/components/LMSCustomers";
import { getLMSProjects } from "@/lib/data/projects";

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

export default async function LMSPage() {
  const projects = await getLMSProjects();

  return (
    <>
      <Navbar />
      <main>
        <LMSHero />
        <LMSServices />
        <LMSTechStack />
        <LMSCustomers projects={projects} />
      </main>
      <Footer />
    </>
  );
}
