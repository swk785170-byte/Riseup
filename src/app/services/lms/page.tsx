import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LMSHero from "@/components/LMSHero";
import LMSServices from "@/components/LMSServices";
import LMSFeatures from "@/components/LMSFeatures";
import LMSWhyUs from "@/components/LMSWhyUs";
import LMSCustomers from "@/components/LMSCustomers";
import { getLMSProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "LMS — RISEUP SOLUTIONS",
  description:
    "The Riseup Solutions Learning Management System for modern institutions — courses, grading, smart-card attendance, paper-class digitisation and student registration in one connected platform.",
  openGraph: {
    title: "LMS — RISEUP SOLUTIONS",
    description:
      "A Learning Management System built for modern institutions — one connected platform for learning, records and admin.",
    type: "website",
  },
};


/* Prerendered and refreshed every 5 minutes. Admin edits call
   revalidatePath(), so changes still appear immediately. */
export const revalidate = 300;

export default async function LMSPage() {
  const projects = await getLMSProjects();

  return (
    <>
      <Navbar />
      <main>
        <LMSHero />
        <LMSServices />
        <LMSFeatures />
        <LMSWhyUs />
        <LMSCustomers projects={projects} />
      </main>
      <Footer />
    </>
  );
}
