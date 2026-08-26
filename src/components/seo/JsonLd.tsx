/**
 * JSON-LD structured data.
 *
 * This is what lets Google build a rich result and what AI search engines
 * (Perplexity, ChatGPT Search, AI Overviews) use to recognise the brand as an
 * entity and quote it accurately. The site previously shipped none at all.
 *
 * The payload is built server-side from typed objects — never from user input —
 * and serialised with `<` escaped, so a stray character in admin-entered
 * content cannot break out of the script tag.
 */

type Json = Record<string, unknown>;

function serialise(data: Json): string {
  // JSON.stringify cannot emit "</script>", but escaping "<" removes any doubt
  // and is what Next's own docs recommend for inline JSON-LD.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLd({ data }: { data: Json }) {
  return (
    <script
      type="application/ld+json"
      // Content is generated on the server from typed values, not user HTML.
      dangerouslySetInnerHTML={{ __html: serialise(data) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Builders — one per schema type actually used on this site.         */
/* ------------------------------------------------------------------ */

export function organisationSchema(opts: {
  siteUrl: string;
  email: string;
  socials: string[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${opts.siteUrl}/#organization`,
    name: "Riseup Solutions",
    url: opts.siteUrl,
    logo: `${opts.siteUrl}/logo/riseup-logo.png`,
    image: `${opts.siteUrl}/opengraph-image`,
    description:
      "Web design and development studio building high-performance websites, e-commerce experiences and school management systems.",
    email: opts.email,
    areaServed: "LK",
    // sameAs is the entity-graph signal: it ties this site to the brand's
    // profiles elsewhere so engines resolve them to one organisation.
    sameAs: opts.socials.filter(Boolean),
    knowsAbout: [
      "Web design",
      "Web development",
      "E-commerce development",
      "Search engine optimisation",
      "Learning management systems",
      "School management systems",
    ],
  };
}

export function websiteSchema(siteUrl: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Riseup Solutions",
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };
}

/** Featured-snippet and People-Also-Ask eligibility for the pricing FAQ. */
export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function serviceSchema(opts: {
  siteUrl: string;
  name: string;
  description: string;
  path: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${opts.siteUrl}${opts.path}`,
    provider: { "@id": `${opts.siteUrl}/#organization` },
    areaServed: "LK",
  };
}

export function articleSchema(opts: {
  siteUrl: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string | null;
  image?: string | null;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: `${opts.siteUrl}/blog/${opts.slug}`,
    mainEntityOfPage: `${opts.siteUrl}/blog/${opts.slug}`,
    datePublished: opts.publishedAt ?? undefined,
    dateModified: opts.publishedAt ?? undefined,
    image: opts.image ?? `${opts.siteUrl}/opengraph-image`,
    author: { "@id": `${opts.siteUrl}/#organization` },
    publisher: { "@id": `${opts.siteUrl}/#organization` },
  };
}

/** Helps engines render the site hierarchy under a result. */
export function breadcrumbSchema(
  siteUrl: string,
  trail: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}
