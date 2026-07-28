import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { CheckCircle2, Download, CalendarCheck, ArrowRight } from "lucide-react";

import { AuroraBloom } from "@/components/site/AuroraBloom";
import { Reveal } from "@/components/site/Reveal";
import { CtaLink } from "@/components/site/CtaLink";
import {
  STARTER_KIT_FILENAME,
  STARTER_KIT_PDF,
  starterKitContents,
} from "@/content/starter-kit";

const title = "Your Starter Kit is ready | Cybersentinels Consulting";
const description =
  "Thank you — your Security & Compliance Starter Kit download is ready, with the ISO 27001, SOC 2, GDPR and DPDPA checklists inside.";

export const Route = createFileRoute("/starter-kit/thank-you")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThankYou,
});

const nextSteps = [
  {
    label: "ISO 27001 certification assistance",
    slug: "iso-27001-implementation-certification-assistance",
  },
  { label: "SOC 2 compliance assistance", slug: "soc-2-compliance-assistance" },
  { label: "GDPR readiness & implementation", slug: "gdpr-readiness-implementation" },
  {
    label: "Virtual CISO (vCISO)",
    slug: "virtual-chief-information-security-officer-vciso",
  },
];


function ThankYou() {
  const started = useRef(false);

  // Kick off the download automatically once, so the visitor never has to hunt
  // for the file — the manual button below remains as the fallback.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const a = document.createElement("a");
    a.href = STARTER_KIT_PDF;
    a.download = STARTER_KIT_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  return (
    <>
      <section className="wash-warm relative overflow-hidden py-20 text-foreground sm:py-24">
        <AuroraBloom intensity={0.6} blur={84} direction="center" grain={0.6} fade={66} />
        <Doodle variant="shield" opacity={0.85} />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <Reveal>
            <span className="brand-gradient mx-auto inline-flex size-14 items-center justify-center rounded-full text-white">
              <CheckCircle2 className="size-7" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h1 className="mt-7 type-display">
              Your Starter Kit is on its way{" "}
              <span className="brand-gradient-text">down</span>
            </h1>
            <p className="mt-5 type-lead text-muted-foreground">
              The download should start automatically. If it does not, use the button below — the
              PDF is 4 pages and needs no sign-in.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href={STARTER_KIT_PDF}
                download={STARTER_KIT_FILENAME}
                className="brand-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 type-button text-white transition-all hover:brightness-110"
              >
                <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Download the PDF
              </a>
              <CtaLink to="/contact" variant="ghost-dark">
                Book a free consultation
              </CtaLink>
            </div>
            <p className="type-small mt-5 inline-flex items-center justify-center gap-2 text-muted-foreground">
              <CalendarCheck className="size-4 text-amber-ink" aria-hidden="true" />
              A consultant will follow up once to ask whether the kit was useful.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft wash-quiet py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="brand-rule mb-5" />
            <h2 className="type-h2">What is inside</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {starterKitContents.map((item, i) => (
              <Reveal
                as="article"
                key={item.title}
                delay={i * 60}
                className="card-lift rounded-xl border border-border bg-background p-6"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 type-h4">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-12">
            <h2 className="type-h3">Where teams usually go next</h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {nextSteps.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-coral hover:text-coral-ink"
                  >

                    {s.label}
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
