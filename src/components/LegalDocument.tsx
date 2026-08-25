import Navbar from "./Navbar";
import Footer from "./Footer";
import { LEGAL, registeredDetails } from "@/lib/legal";

/**
 * Shared shell for /privacy and /terms.
 *
 * Content arrives as data rather than JSX so both documents stay plain prose
 * that a non-developer can edit without touching markup, and so apostrophes
 * and quotes need no HTML escaping.
 */
export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.kind === "p" ? (
          <p key={i} className="mt-4 leading-relaxed text-foreground/85">
            {block.text}
          </p>
        ) : (
          <ul key={i} className="mt-4 flex flex-col gap-2.5">
            {block.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 leading-relaxed text-foreground/85"
              >
                <span
                  aria-hidden
                  className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-taupe"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

export default function LegalDocument({
  title,
  intro,
  sections,
  email,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  /** Live contact address from site settings, so it never drifts. */
  email: string;
}) {
  const details = registeredDetails();

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-5 pt-36 pb-16 md:px-10 md:pt-52 md:pb-20">
            <p className="mb-7 flex items-center gap-4 text-[13px] font-bold tracking-[0.4em] text-muted uppercase">
              <span className="inline-block h-px w-12 bg-foreground" />
              Legal
            </p>
            <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance">
              {title}
            </h1>
            <p className="mt-8 leading-relaxed text-muted">{intro}</p>
            <p className="mt-6 text-[11px] font-bold tracking-[0.25em] text-muted uppercase">
              Last updated {LEGAL.lastUpdated}
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-28">
            <div className="flex flex-col gap-14">
              {sections.map((section, i) => (
                <section key={section.title}>
                  <h2 className="flex items-baseline gap-4 text-xl font-medium tracking-tight md:text-2xl">
                    <span className="text-[13px] font-bold text-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <div className="mt-2 pl-0 md:pl-10">
                    <Blocks blocks={section.blocks} />
                  </div>
                </section>
              ))}

              {/* Contact is common to both documents and pulls the live
                  address from site settings rather than hard-coding one. */}
              <section>
                <h2 className="flex items-baseline gap-4 text-xl font-medium tracking-tight md:text-2xl">
                  <span className="text-[13px] font-bold text-muted tabular-nums">
                    {String(sections.length + 1).padStart(2, "0")}
                  </span>
                  Contact us
                </h2>
                <div className="mt-2 pl-0 md:pl-10">
                  <p className="mt-4 leading-relaxed text-foreground/85">
                    If you have any questions about this document, or you want
                    to exercise any of the rights described in it, email us at{" "}
                    <a
                      href={`mailto:${email}`}
                      className="font-medium text-foreground underline underline-offset-4 transition-colors duration-300 hover:text-accent"
                    >
                      {email}
                    </a>
                    . We aim to reply within five working days.
                  </p>
                  {details && (
                    <p className="mt-4 leading-relaxed text-muted">{details}</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
