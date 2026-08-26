/**
 * Pricing FAQ content.
 *
 * Lives outside the component because it is consumed by BOTH the client-side
 * accordion and the server-rendered FAQPage JSON-LD. Importing a plain value
 * from a `"use client"` module into a Server Component does not give you the
 * value — that is what broke the /pricing prerender.
 */
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Do you offer payment plans?",
    a: "Yes — most projects are split into a deposit and one or two milestone payments. LMS plans are billed annually, and we can arrange quarterly billing for institutions.",
  },
  {
    q: "What's included in a custom quote?",
    a: "A fixed scope, timeline and price after a short discovery call. You'll see exactly what's built, what it costs and when it ships — no hourly surprises.",
  },
  {
    q: "Can I upgrade my package later?",
    a: "Always. Packages are nested, so moving from Starter to Growth (or Essentials to Professional) only charges the difference plus the new work — nothing is rebuilt.",
  },
  {
    q: "Is hosting included?",
    a: "We set up fast, secure hosting for you and can manage it on a small monthly retainer, or hand over the keys if you'd rather run it yourself.",
  },
  {
    q: "How long does a project take?",
    a: "A Starter site is usually 1–2 weeks; Growth builds run 3–5 weeks; LMS rollouts depend on scale, but most go live within a month.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes. Every package includes a warranty window, and Growth / Professional and up include priority or dedicated support.",
  },
];
