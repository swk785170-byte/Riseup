import type { Metadata } from "next";
import LegalDocument, { type LegalSection } from "@/components/LegalDocument";
import { getSiteSettings } from "@/lib/data/site";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — RISEUP SOLUTIONS",
  description:
    "The terms that apply to your use of the Riseup Solutions website, including enquiries, published pricing and intellectual property.",
};

/*
 * These terms cover use of the WEBSITE. They deliberately do not attempt to
 * set the terms of a client project — that belongs in a signed proposal or
 * services agreement, and section 5 says so explicitly.
 *
 * Draft for review by a qualified lawyer before launch — not legal advice.
 */
const SECTIONS: LegalSection[] = [
  {
    title: "About these terms",
    blocks: [
      {
        kind: "p",
        text: `These terms apply to your use of this website. By browsing the site or sending us an enquiry through it, you accept them. If you do not accept them, please do not use the site.`,
      },
      {
        kind: "p",
        text: `These terms cover the website itself. They do not set the terms of any project we carry out for you — those are agreed separately and in writing, as explained below.`,
      },
    ],
  },
  {
    title: "Who we are",
    blocks: [
      {
        kind: "p",
        text: `This site is operated by ${LEGAL.entity}, a web design and development studio. In these terms, "we", "us" and "our" mean ${LEGAL.entity}, and "you" means the person using the site.`,
      },
    ],
  },
  {
    title: "Using this website",
    blocks: [
      {
        kind: "p",
        text: `You may read, browse and print pages from this site for your own reference or to evaluate working with us. In using the site, you agree not to:`,
      },
      {
        kind: "ul",
        items: [
          "Use it for anything unlawful, or in a way that harms anyone else's use of it.",
          "Attempt to gain access to the admin area, our accounts, our databases or any part of the site not made public.",
          "Introduce malware, attempt to overload the site, or probe it for vulnerabilities without our written permission.",
          "Scrape, copy or republish substantial parts of the site for commercial purposes.",
          "Submit false information, impersonate someone else, or send bulk or automated messages through the contact form.",
        ],
      },
      {
        kind: "p",
        text: `We may restrict or withdraw access to the site, or to the contact form, if we reasonably believe it is being misused.`,
      },
    ],
  },
  {
    title: "Intellectual property",
    blocks: [
      {
        kind: "p",
        text: `The design, layout, text, graphics, code and branding of this site belong to us or are used with permission, and are protected by copyright and trade mark law. Nothing on this site transfers any of those rights to you.`,
      },
      {
        kind: "p",
        text: `Client names, logos, screenshots and case studies shown in our portfolio remain the property of the businesses and institutions concerned, and appear here to illustrate our work. Please do not reuse them.`,
      },
      {
        kind: "p",
        text: `Ownership of work we produce for a client is dealt with in that client's own agreement, not here.`,
      },
    ],
  },
  {
    title: "Enquiries are not a contract",
    blocks: [
      {
        kind: "p",
        text: `Sending an enquiry through this site does not create a contract between us, does not reserve capacity in our schedule, and does not oblige either of us to proceed.`,
      },
      {
        kind: "p",
        text: `A project only begins once we have agreed the scope in writing and both sides have accepted a written quotation or services agreement. That document, not this website, governs the work, its price, its timeline and what happens if either side wants to stop.`,
      },
    ],
  },
  {
    title: "Pricing information",
    blocks: [
      {
        kind: "p",
        text: `Any packages, prices or figures published on this site are indicative and are provided to give you a realistic sense of cost. They are not an offer capable of acceptance.`,
      },
      {
        kind: "p",
        text: `The final price for a project depends on its scope, and is confirmed in a written quotation. Published prices may change without notice, and unless we state otherwise they exclude taxes, third-party costs such as domains, hosting and licences, and anything outside the described scope.`,
      },
    ],
  },
  {
    title: "Accuracy of content",
    blocks: [
      {
        kind: "p",
        text: `We take care to keep this site accurate and up to date, but we make no promise that everything on it is complete or current at the moment you read it. Descriptions of our services, including systems still in development, describe what we intend to offer and may change.`,
      },
      {
        kind: "p",
        text: `Nothing on this site is professional advice. Do not rely on it alone when making a decision — talk to us, and we will give you something specific to your situation.`,
      },
    ],
  },
  {
    title: "Availability of the site",
    blocks: [
      {
        kind: "p",
        text: `We do not guarantee that this site will always be available or uninterrupted. We may suspend, withdraw or change any part of it — including taking it down for maintenance — without notice and without liability to you.`,
      },
      {
        kind: "p",
        text: `You are responsible for the arrangements you need to access the site, including your own device, connection and security software.`,
      },
    ],
  },
  {
    title: "Links to other sites",
    blocks: [
      {
        kind: "p",
        text: `Where this site links to a third party — a client's website, a social media profile, or a messaging service such as WhatsApp — that link is provided for convenience only. We do not control those sites, we do not endorse their content, and we are not responsible for anything on them. Their own terms and privacy policies apply once you leave this site.`,
      },
    ],
  },
  {
    title: "Our liability",
    blocks: [
      {
        kind: "p",
        text: `This site is provided as it is. To the fullest extent the law allows, we exclude any warranty or condition that is not expressly set out in these terms.`,
      },
      {
        kind: "p",
        text: `We are not liable for any loss of profit, loss of business, loss of data or any indirect or consequential loss arising from your use of this site, or from being unable to use it.`,
      },
      {
        kind: "p",
        text: `Nothing in these terms limits or excludes our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited or excluded.`,
      },
    ],
  },
  {
    title: "Privacy",
    blocks: [
      {
        kind: "p",
        text: `Our Privacy Policy explains what we do with any personal information you send us through this site. It forms part of these terms, and you should read it alongside them.`,
      },
    ],
  },
  {
    title: "Changes to these terms",
    blocks: [
      {
        kind: "p",
        text: `We may update these terms from time to time. The version published on this page is the one that applies, and the date at the top tells you when it last changed. Please check back if you use the site regularly.`,
      },
    ],
  },
  {
    title: "Governing law",
    blocks: [
      {
        kind: "p",
        text: `These terms, and any dispute arising out of them or your use of this site, are governed by the laws of ${LEGAL.jurisdiction}, and are subject to the exclusive jurisdiction of ${LEGAL.courts}.`,
      },
      {
        kind: "p",
        text: `If any part of these terms is found to be unenforceable, the rest of them continue to apply.`,
      },
    ],
  },
];

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <LegalDocument
      title="Terms & Conditions"
      intro={`These terms set out the rules for using the ${LEGAL.entity} website — what you can do with its content, how enquiries and published pricing work, and the limits of our responsibility.`}
      sections={SECTIONS}
      email={settings.email}
    />
  );
}
