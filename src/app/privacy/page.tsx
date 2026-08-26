import type { Metadata } from "next";
import LegalDocument, { type LegalSection } from "@/components/LegalDocument";
import { getSiteSettings } from "@/lib/data/site";
import { LEGAL } from "@/lib/legal";


/* Prerendered and refreshed every 5 minutes. Admin edits call
   revalidatePath(), so changes still appear immediately. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Privacy Policy — RISEUP SOLUTIONS",
  alternates: { canonical: "/privacy" },
  description:
    "How Riseup Solutions collects, uses and protects personal information submitted through this website.",
};

/*
 * Written to describe what this site actually does: there is no analytics,
 * advertising or tracking of any kind, fonts are self-hosted at build time,
 * and the only cookies are the staff login session. If that ever changes,
 * this document must change with it.
 *
 * Draft for review by a qualified lawyer before launch — not legal advice.
 */
const SECTIONS: LegalSection[] = [
  {
    title: "The short version",
    blocks: [
      {
        kind: "p",
        text: `We collect as little as we can. This website carries no analytics, no advertising trackers and no third-party marketing scripts. The only personal information we hold about you is what you choose to send us — normally through the contact form.`,
      },
      {
        kind: "p",
        text: `We do not sell your information, and we do not share it with anyone except the service providers that help us run the site and reply to you.`,
      },
    ],
  },
  {
    title: "Who we are",
    blocks: [
      {
        kind: "p",
        text: `${LEGAL.entity} is a web design and development studio. In this policy, "we", "us" and "our" mean ${LEGAL.entity}. We are the controller of the personal information described below, which means we decide why and how it is used.`,
      },
    ],
  },
  {
    title: "Information you give us",
    blocks: [
      {
        kind: "p",
        text: `When you submit our contact form, we store exactly the following, and nothing more:`,
      },
      {
        kind: "ul",
        items: [
          "Your name.",
          "Your email address.",
          "The project type you selected from the dropdown.",
          "The message you wrote.",
          "The date and time you submitted it, and whether we have replied yet.",
        ],
      },
      {
        kind: "p",
        text: `The form also contains a hidden field that real visitors never see. It exists to catch automated spam bots, and anything entered into it is discarded rather than stored.`,
      },
      {
        kind: "p",
        text: `If you email us directly, or message us using the WhatsApp button, we hold whatever information is in that conversation. Messages sent over WhatsApp are delivered through WhatsApp itself, so they are also handled under WhatsApp's own privacy terms — we have no control over that part.`,
      },
    ],
  },
  {
    title: "Information collected automatically",
    blocks: [
      {
        kind: "p",
        text: `We do not run analytics software, and we do not build profiles of visitors. We do not record your IP address against anything you submit.`,
      },
      {
        kind: "p",
        text: `Like any website, the servers that deliver these pages keep short-lived technical logs — typically the requested address, a timestamp, your browser type and the IP address the request came from. These are generated and retained by our hosting provider for security and reliability, not used by us for marketing, and not linked to your enquiry.`,
      },
      {
        kind: "p",
        text: `The typefaces used on this site are served from our own domain. Loading a page does not send a request to Google Fonts or any other third-party font service.`,
      },
    ],
  },
  {
    title: "Cookies",
    blocks: [
      {
        kind: "p",
        text: `This website sets no advertising, analytics or tracking cookies. Browsing it as a visitor does not require you to accept any cookies, which is why you will not see a cookie banner.`,
      },
      {
        kind: "p",
        text: `The only cookies we set are session cookies for the private admin area, used by our own staff to sign in and manage the site's content. They are strictly necessary to keep that area secure, they are not readable by scripts in the browser, and they are never set for ordinary visitors.`,
      },
    ],
  },
  {
    title: "Why we use your information",
    blocks: [
      {
        kind: "p",
        text: `We use what you send us only to respond to your enquiry, to prepare a quotation or proposal if you have asked for one, and to keep a record of our correspondence with you. Our lawful basis for this is that you have asked us to take steps before entering into a contract, and our legitimate interest in answering people who get in touch.`,
      },
      {
        kind: "p",
        text: `We will not add you to a marketing list or send you unrelated promotional email on the basis of a project enquiry.`,
      },
    ],
  },
  {
    title: "Where your information is stored",
    blocks: [
      {
        kind: "p",
        text: `Contact form submissions are stored in a managed PostgreSQL database provided by Supabase, protected by row-level security rules so that submissions can be written by the public form but read only by authorised staff accounts.`,
      },
      {
        kind: "p",
        text: `Supabase and our hosting provider act as processors on our behalf: they store and transmit the data so that we can use it, under contract, and they are not permitted to use it for their own purposes. Their servers may be located outside your country, which means your information may be transferred and stored internationally.`,
      },
    ],
  },
  {
    title: "How long we keep it",
    blocks: [
      {
        kind: "p",
        text: `We keep enquiries for as long as they are useful to the working relationship — normally up to two years after our last contact with you, or longer where we need the records for an ongoing project, our accounts or a legal obligation. After that they are deleted.`,
      },
      {
        kind: "p",
        text: `You can ask us to delete an enquiry sooner at any time.`,
      },
    ],
  },
  {
    title: "Sharing your information",
    blocks: [
      {
        kind: "p",
        text: `We do not sell, rent or trade personal information. We share it only with:`,
      },
      {
        kind: "ul",
        items: [
          "The service providers described above, who host the site and store its data.",
          "Professional advisers, such as accountants or lawyers, where they need it and are bound by confidentiality.",
          "A public authority, where we are legally required to disclose it.",
        ],
      },
    ],
  },
  {
    title: "Your rights",
    blocks: [
      {
        kind: "p",
        text: `You can ask us to:`,
      },
      {
        kind: "ul",
        items: [
          "Tell you what personal information we hold about you, and give you a copy.",
          "Correct anything that is wrong or out of date.",
          "Delete what we hold, where we have no continuing reason to keep it.",
          "Stop using it for a particular purpose.",
        ],
      },
      {
        kind: "p",
        text: `Email us using the address below and we will action the request. We will not charge you for it, and we may ask a question or two to confirm who you are before we release anything.`,
      },
    ],
  },
  {
    title: "Security",
    blocks: [
      {
        kind: "p",
        text: `The site is served over an encrypted connection, the admin area is restricted to a fixed list of approved staff accounts, and database access rules prevent enquiry records from being read by anyone browsing the public site.`,
      },
      {
        kind: "p",
        text: `No system is perfectly secure, so please do not send us passwords, card numbers or other sensitive details through the contact form.`,
      },
    ],
  },
  {
    title: "Children",
    blocks: [
      {
        kind: "p",
        text: `This website is aimed at businesses and institutions rather than children, and we do not knowingly collect personal information from children. If you believe a child has sent us information, contact us and we will delete it.`,
      },
    ],
  },
  {
    title: "Changes to this policy",
    blocks: [
      {
        kind: "p",
        text: `If we change how we handle personal information, we will update this page and change the "last updated" date at the top. Material changes will be described here rather than made quietly.`,
      },
    ],
  },
];

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <LegalDocument
      title="Privacy Policy"
      intro={`This policy explains what personal information ${LEGAL.entity} collects through this website, why we collect it, how long we keep it and what you can ask us to do with it.`}
      sections={SECTIONS}
      email={settings.email}
    />
  );
}
