import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd, { breadcrumbSchema, serviceSchema } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/site-url";
import LMSHero from "@/components/LMSHero";
import LMSServices from "@/components/LMSServices";
import LMSFeatures from "@/components/LMSFeatures";
import LMSWhyUs from "@/components/LMSWhyUs";
import LMSCustomers from "@/components/LMSCustomers";
import { getLMSProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "LMS — RISEUP SOLUTIONS",
  alternates: { canonical: "/services/lms" },
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
      <JsonLd
        data={serviceSchema({
          siteUrl: siteUrl(),
          name: 'Learning Management System',
          description: 'A Learning Management System for modern institutions — courses, grading, attendance, smart-card integration and admin dashboards.',
          path: '/services/lms',
        })}
      />
      <JsonLd
        data={breadcrumbSchema(siteUrl(), [
          { name: "Home", path: "/" },
          { name: 'Learning Management System', path: '/services/lms' },
        ])}
      />
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
