import { lazy } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  ScrollText,
  Lock,
  Users,
  Quote,
  Gauge,
  FileCheck2,
  Handshake,
  Radar,
  CalendarCheck,
  Award,
  Fingerprint,
  UserCog,
  Landmark,
  CloudCog,
  Truck,
  Briefcase,
} from "lucide-react";
import { getSection, heroOf, pillars, industries, frameworkMarks, shortServiceTitle, type PageContent } from "@/content/site";

import homeData from "@/content/pages/home.json";
import { headFor } from "@/components/site/ContentPage";
import { CtaLink, routeForLabel } from "@/components/site/CtaLink";
import { Reveal, CountUp } from "@/components/site/Reveal";
import { IconTile } from "@/components/site/IconTile";
import { AuroraBloom } from "@/components/site/AuroraBloom";
import { Doodle } from "@/components/site/Doodle";

import { ApproachSteps } from "@/components/site/ApproachSteps";

import { BrandMark, Logo } from "@/components/site/Logo";


import { SectionRenderer } from "@/components/site/SectionRenderer";
import { type Testimonial } from "@/components/site/TestimonialCarousel";
import { Deferred } from "@/components/site/Deferred";
import { TrustedBy } from "@/components/site/TrustedBy";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { homeFaqs, faqSchema } from "@/content/faqs";

// Below-the-fold, network-heavy blocks load only when they scroll into view.
const TestimonialCarousel = lazy(() =>
  import("@/components/site/TestimonialCarousel").then((m) => ({ default: m.TestimonialCarousel })),
);
const ThreatMap = lazy(() =>
  import("@/components/site/ThreatMap").then((m) => ({ default: m.ThreatMap })),
);
const NewsRotator = lazy(() =>
  import("@/components/site/NewsRotator").then((m) => ({ default: m.NewsRotator })),
);




const page = homeData as PageContent;

export const Route = createFileRoute("/")({
  head: () => ({
    ...headFor(page, "Cybersecurity, Compliance & VAPT Services"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqSchema(homeFaqs)),
      },
    ],
  }),
  component: Home,
});


const pillarIcons = [ShieldCheck, ScrollText, Lock, Users];
const industryIcons = [Landmark, CloudCog, Truck, Briefcase];

const heroProof = [
  { label: "CERT-In aligned testing", icon: ShieldCheck },
  { label: "ISO 27001 & SOC 2 readiness", icon: Award },
  { label: "DPDPA & GDPR privacy", icon: Fingerprint },
  { label: "vCISO on demand", icon: UserCog },
];

/** Trims boilerplate suffixes so service lists read uniformly in cards. */
function shortServiceTitle(title: string) {
  return title
    .replace(/\s*(and|&)\s*Implementation\s*Services?$/i, "")
    .replace(/\s*Implementation\s*(and|&)\s*Certification\s*Assistance$/i, "")
    .replace(/\s*Guidelines\s*Implementation\s*Assistance$/i, " Guidelines")
    .replace(/\s*Compliance\s*Assistance$/i, " Compliance")
    .replace(/\s*Readiness\s*(and|&)\s*Implementation\s*Services?$/i, " Readiness")
    .replace(/\s*—\s*/g, " · ")
    .trim();
}


/** High-intent compliance destinations linked from the hero and service band. */
const complianceLinks = [
  {
    label: "ISO 27001 certification",
    slug: "iso-27001-implementation-certification-assistance",
  },
  { label: "SOC 1 readiness", slug: "soc-1-compliance-assistance" },
  { label: "SOC 2 readiness", slug: "soc-2-compliance-assistance" },
  {
    label: "VAPT",
    slug: "vulnerability-assessment-penetration-testing",
  },
] as const;




const valueProps = [
  {
    icon: Radar,
    title: "Findings you can act on",
    body: "Every assessment ends with prioritised, exploit-verified findings mapped to business impact — not a raw scanner dump.",
  },
  {
    icon: FileCheck2,
    title: "Audit-ready evidence",
    body: "Policies, controls and artefacts are produced in the format auditors, regulators and enterprise customers expect.",
  },
  {
    icon: Gauge,
    title: "Speed without shortcuts",
    body: "Scoped in days, not weeks. Clear timelines, fixed deliverables and retesting included so remediation actually closes.",
  },
  {
    icon: Handshake,
    title: "One accountable team",
    body: "Testing, GRC, privacy and advisory delivered by the same team, so nothing is lost between vendors and hand-offs.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "The team turned a scattered set of audit gaps into a single roadmap. We cleared our ISO 27001 stage 2 without a major non-conformity.",
    author: "Head of IT",
    detail: "BFSI lender, India",
    rating: 5,
    logo: "Northbridge Finance",
    logoNote: "BFSI • India",
  },
  {
    quote:
      "Their VAPT report was the first one our engineers actually enjoyed reading — reproducible steps, real impact, and a retest that confirmed every fix.",
    author: "VP Engineering",
    detail: "SaaS platform, UAE",
    rating: 5,
    logo: "Averio Cloud",
    logoNote: "SaaS • UAE",
  },
  {
    quote:
      "The vCISO engagement gave our board the security reporting it had been asking for, at a fraction of a full-time hire.",
    author: "Chief Operating Officer",
    detail: "Healthcare group",
    rating: 5,
    logo: "Medira Health",
    logoNote: "Healthcare • India",
  },
  {
    quote:
      "DPDPA readiness felt overwhelming until we had a mapped inventory, notices and consent flows we could actually operate day to day.",
    author: "Data Protection Lead",
    detail: "E-commerce marketplace",
    rating: 5,
    logo: "Kartway Retail",
    logoNote: "Retail • India",
  },
  {
    quote:
      "Third-party risk reviews used to block every enterprise deal. Now we hand over an evidence pack and the security questionnaire closes in days.",
    author: "Director, Information Security",
    detail: "Manufacturing exporter",
    rating: 4,
    logo: "Volten Industries",
    logoNote: "Manufacturing • Global",
  },
];



function Home() {
  const hero = heroOf(page);
  const heroTail = page?.sections
    .find((s) => s.heading === "Hero")
    ?.blocks.filter((b) => b.type === "p")
    .at(-1);
  const credibility = getSection(page, "Credibility Snapshot");
  const challenge = getSection(page, "What Security or Compliance Challenge Are You Solving?");
  const approach = getSection(page, "A Structured Approach from Readiness to Resilience");
  const why = getSection(page, "Practical Expertise. Integrated Delivery. Sustainable Outcomes.");
  const insights = getSection(page, "Practical Insights for Security, Privacy and Compliance Leaders");
  const start = getSection(page, "Not Sure Where to Start?");

  const credCards = extractCards(credibility);
  const challengeCards = extractCards(challenge);
  const approachSteps = extractCards(approach);

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="wash-warm relative overflow-hidden text-ink-foreground">
        {/* drifting ambient gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="anim-drift-a absolute -left-40 top-[-18%] size-[42rem] rounded-full opacity-[0.28] blur-[110px] will-change-transform"
            style={{
              background: "radial-gradient(circle, var(--magenta) 0%, transparent 68%)",
            }}
          />
          <div
            className="anim-drift-b absolute right-[-14%] top-[-24%] size-[46rem] rounded-full opacity-[0.3] blur-[120px] will-change-transform"
            style={{
              background: "radial-gradient(circle, var(--coral) 0%, transparent 70%)",
            }}
          />
          <div
            className="anim-drift-c absolute bottom-[-30%] left-[30%] size-[38rem] rounded-full opacity-[0.22] blur-[130px] will-change-transform"
            style={{
              background: "radial-gradient(circle, var(--rose, var(--magenta)) 0%, transparent 68%)",
            }}
          />

        </div>
        <AuroraBloom intensity={0.8} blur={82} spread={24} grain={0.6} />
        <div className="hero-noise pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="ink-grid hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:py-28 lg:px-8 lg:py-36">
          <Reveal>
            <div className="mb-7 flex justify-center sm:mb-9 lg:mb-10">
              <Logo halo="lg" reveal priority className="h-10 w-auto sm:h-14 lg:h-16" />
            </div>



            <p className="type-eyebrow mb-6 text-amber-ink sm:mb-7">
              SERVING CLIENTS ACROSS INDIA & GLOBAL CUSTOMER
            </p>

            <h1 className="type-display">
              Get a clear, costed path to{" "}
              <span className="brand-gradient-text">ISO 27001, SOC 2 and privacy compliance</span>{" "}
              — before you spend on controls.
            </h1>
            <div className="mt-8 space-y-5">
              <p className="type-lead mx-auto max-w-2xl text-ink-muted">
                Start with a free 30-minute consultation. We map your deadline, customer requirement
                and current gaps into a sequenced plan with owners, effort and evidence — then you
                decide whether to run it with us or in-house.
              </p>
              <p className="type-lead mx-auto max-w-2xl text-ink-muted">
                {hero.paragraphs[0]}
              </p>
            </div>
            <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
              {heroProof.map((item) => (
                <li
                  key={item.label}
                  className="type-small inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-soft/60 px-3.5 py-1.5 font-medium text-ink-foreground/85"
                >
                  <item.icon className="size-3.5 text-amber-ink" strokeWidth={1.75} aria-hidden="true" />
                  {item.label}
                </li>

              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <CtaLink to="/contact">Book your free consultation</CtaLink>
              <CtaLink to="/starter-kit" variant="ghost-dark">
                Get the Starter Kit (PDF)
              </CtaLink>
            </div>
            <p className="type-small mt-5 inline-flex items-center justify-center gap-2 text-ink-muted">
              <CalendarCheck className="size-4 text-amber-ink" aria-hidden="true" />
              No obligation, no sales script — a consultant, not a form-filler
            </p>

            <div className="mt-11">
              <p className="type-small text-ink-muted">Or go straight to what you need:</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
                {complianceLinks.map((l) => (
                  <li key={l.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: l.slug }}
                      className="group inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-soft/40 px-4 py-2 text-sm font-medium text-ink-foreground/90 transition-all hover:border-coral hover:text-ink-foreground"
                    >

                      {l.label}
                      <ArrowRight
                        className="size-3.5 text-amber-ink transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {heroTail ? (
              <p className="type-body mx-auto mt-12 max-w-2xl border-l-2 border-coral pl-5 text-left italic text-ink-muted">
                {heroTail.type === "p" ? heroTail.text : null}
              </p>
            ) : null}
          </Reveal>
        </div>



        {/* Framework marquee */}
        <div className="relative border-t border-ink-border py-5">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="anim-marquee flex shrink-0 items-center gap-12 pr-12">

              {[...frameworkMarks, ...frameworkMarks].map((mark, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-ink-muted"
                >
                  {mark}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Trusted by */}
      <TrustedBy className="band-soft wash-quiet py-12 sm:py-14" />

      {/* -------------------------------------------------- Credibility */}
      <section className="band-soft wash-quiet py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {credCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 70} className="section-card card-lift bg-card/80 p-7 backdrop-blur-sm">
                <p className="brand-gradient-text font-display text-3xl font-bold">
                  <StatValue title={c.title} />
                </p>
                <h2 className="mt-2 type-h4">{statLabel(c.title)}</h2>
                <p className="mt-3 type-small text-muted-foreground">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Value props */}
      <section className="band-soft wash-soft relative overflow-hidden py-16 sm:py-24">
        <AuroraBloom intensity={0.38} blur={88} direction="center" grain={0.6} fade={74} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="brand-rule mb-5" />
              <p className="type-eyebrow text-coral-ink">
                Why teams choose CyberSentinels
              </p>
              <h2 className="mt-3 type-h2">
                Security work that survives contact with auditors, boards and attackers
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((v, i) => (
              <Reveal
                as="article"
                key={v.title}
                delay={i * 70}
                className="group card-lift sheen rounded-xl border border-border bg-background p-6"
              >
                <IconTile icon={v.icon} />

                <h3 className="mt-5 type-h4">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Challenge grid */}
      <section className="band-soft wash-quiet py-16 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="brand-rule mb-5" />
              <h2 className="type-h2">
                {challenge?.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {challenge?.blocks.find((b) => b.type === "p")?.text}
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {challengeCards.map((c, i) => {
              const Icon = pillarIcons[i] ?? ShieldCheck;
              const pillar = pillars[i];
              return (
                <Reveal
                  as="article"
                  key={c.title}
                  delay={i * 60}
                  className="group card-lift sheen relative overflow-hidden rounded-xl border border-border bg-surface p-7"
                >
                  <div className="brand-gradient absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                  <IconTile icon={Icon} />
                  <h3 className="mt-5 type-h3">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  {pillar ? (
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {pillar.services.slice(0, 4).map((s) => (
                        <li
                          key={s.url}
                          className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                        >
                          {s.title}
                        </li>
                      ))}
                      <li className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                        +{Math.max(0, pillar.services.length - 4)} more
                      </li>
                    </ul>
                  ) : null}
                  {c.button ? (
                    <Link
                      to={pillar?.url ?? routeForLabel(c.button)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-coral-ink transition-all group-hover:gap-3"
                    >
                      {c.button}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Approach */}
      <section className="wash-warm band-soft relative overflow-hidden py-16 text-ink-foreground sm:py-24">
        <AuroraBloom intensity={0.4} blur={90} direction="left" grain={0.6} fade={70} />
        <Doodle variant="compliance" opacity={0.85} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="brand-rule mb-5" />
              <h2 className="type-h2">
                {approach?.heading}
              </h2>
            </div>
          </Reveal>
          <ApproachSteps steps={approachSteps} />


        </div>
      </section>

      {/* -------------------------------------------------- Mid-page CTA */}
      <section className="band-soft wash-soft relative overflow-hidden py-14">
        <AuroraBloom intensity={0.32} blur={96} direction="right" grain={0.6} fade={72} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="flex flex-col gap-6 rounded-xl border border-border bg-background p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="type-h2">
                Not sure whether you need a test, an audit or a roadmap?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Share your goal, deadline or customer requirement. We will recommend the right scope
                — even when it is smaller than you expected.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CtaLink to="/contact">Request an Assessment</CtaLink>
              <CtaLink to="/case-studies" variant="outline">
                See Client Outcomes
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ----------------------------------------------------- Practices */}
      <section className="band-soft wash-quiet relative overflow-hidden py-16 sm:py-24">
        <AuroraBloom intensity={0.34} blur={92} direction="top" grain={0.6} fade={68} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="brand-rule mb-5" />
                <h2 className="type-h2">
                  One Partner Across Your Security, Compliance and Privacy Journey
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Four connected practice areas, delivered by one team with a single view of your
                  risk, obligations and evidence.
                </p>
              </div>
              <CtaLink to="/services" variant="outline">
                View all 36 services
              </CtaLink>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Most requested
              </span>
              {complianceLinks.map((l) => (
                <Link
                  key={l.slug}
                  to="/services/$slug"
                  params={{ slug: l.slug }}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-coral hover:text-coral-ink"
                >

                  {l.label}
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal
                as="article"
                key={p.url}
                delay={i * 60}
                className="group card-lift sheen flex h-full flex-col rounded-xl border border-border bg-background p-6"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 type-h4 lg:min-h-[3.5rem]">
                  {p.title}
                </h3>
                <div className="brand-rule mt-3 mb-4 w-6 transition-all duration-300 group-hover:w-12" />
                <p className="text-sm leading-relaxed text-muted-foreground lg:min-h-[5rem]">
                  {p.intent}
                </p>
                <ul className="mt-5 space-y-2 border-t border-border pt-4">
                  {p.services.slice(0, 5).map((s) => (
                    <li key={s.url}>
                      <Link
                        to={s.url}
                        className="block truncate text-[13px] leading-snug text-muted-foreground transition-colors hover:text-coral-ink"
                        title={s.title}
                      >
                        {shortServiceTitle(s.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={p.url}
                  className="mt-auto pt-5 text-sm font-semibold text-coral-ink transition-all hover:tracking-wide"
                >
                  Explore {p.short} →
                </Link>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------- Why us */}
      {why ? <SectionRenderer section={why} index={1} /> : null}

      {/* -------------------------------------------- Live threat map */}
      <Deferred minHeight={520}>
        <ThreatMap />
      </Deferred>

      {/* ---------------------------------------------------- Industries */}
      <section className="band-soft wash-quiet relative overflow-hidden py-16 sm:py-24">
        <AuroraBloom intensity={0.34} blur={92} direction="top" grain={0.6} fade={68} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="brand-rule mb-5" />
            <h2 className="max-w-3xl type-h2">
              Security and Compliance Designed Around Your Industry
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <Reveal key={ind.url} delay={i * 60} className="section-card card-lift bg-card/80 backdrop-blur-sm">
                <Link to={ind.url} className="group block h-full p-7">
                  <IconTile icon={industryIcons[i] ?? Briefcase} size="sm" className="mb-5" />
                  <h3 className="type-h4 transition-colors group-hover:text-coral-ink">
                    {ind.title}
                  </h3>
                  <div className="brand-rule mt-3 w-6 transition-all duration-300 group-hover:w-14" />
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-all group-hover:gap-3 group-hover:text-coral-ink">
                    Industry approach <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </Link>

              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Testimonials */}
      <section className="band-soft wash-soft py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="brand-rule mb-5" />
              <h2 className="type-h2">
                What Security and Compliance Leaders Say
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Client names are withheld under engagement confidentiality. Outcomes are shared with
                permission.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80} className="mt-12">
            <Deferred minHeight={320}>
              <TestimonialCarousel items={testimonials} />
            </Deferred>
          </Reveal>

        </div>
      </section>


      {/* ------------------------------------------------------- News */}
      <Deferred minHeight={460}>
        <NewsRotator />
      </Deferred>

      {/* ------------------------------------------------- Lead magnet */}
      <section className="band-soft wash-soft relative overflow-hidden py-16 sm:py-20">
        <AuroraBloom intensity={0.36} blur={92} direction="right" grain={0.6} fade={72} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="flex flex-col gap-8 rounded-xl border border-border bg-background p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="type-eyebrow text-coral-ink">Free download</p>
              <h2 className="mt-3 type-h2">Security &amp; Compliance Starter Kit</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A 4-page practitioner guide: the 12-week readiness roadmap, the ISO 27001:2022
                mandatory documentation checklist, a SOC 2 evidence matrix, GDPR and DPDPA privacy
                checklists, and nine board metrics that survive scrutiny.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <CtaLink to="/starter-kit">Download the Starter Kit</CtaLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ Insights */}
      {insights ? <SectionRenderer section={insights} index={1} /> : null}

      {/* -------------------------------------------------- Compliance FAQ */}
      <FaqAccordion
        faqs={homeFaqs}
        eyebrow="ISO 27001 & SOC 2"
        title="Compliance questions we answer on every first call"
      />



      {/* ------------------------------------------------- Where to start */}
      <section className="wash-warm relative overflow-hidden py-16 text-ink-foreground sm:py-24">
        <AuroraBloom intensity={0.55} blur={84} direction="bottom" grain={0.6} fade={62} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="brand-rule mb-5" />
            <h2 className="type-h2">
              {start?.heading ?? "Not Sure Where to Start?"}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
              {start?.blocks.find((b) => b.type === "p")?.text}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink to="/contact">Book a Consultation</CtaLink>
              <CtaLink to="/services" variant="ghost-dark">
                Find the Right Service
              </CtaLink>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="space-y-3 rounded-xl border border-ink-border bg-ink-soft/50 p-7">
              {(start?.blocks.find((b) => b.type === "ul")?.items ?? []).map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** Turns an h3-led section into simple title/body/button cards. */
function extractCards(section?: { blocks: { type: string; text?: string; items?: string[] }[] }) {
  const cards: { title: string; body: string; button?: string }[] = [];
  if (!section) return cards;
  for (const block of section.blocks) {
    if (block.type === "h3" && block.text) {
      cards.push({ title: block.text.replace(/^\d+\.\s*/, ""), body: "" });
    } else if (block.type === "p" && cards.length && !cards[cards.length - 1].body) {
      cards[cards.length - 1].body = block.text ?? "";
    } else if (block.type === "buttons" && cards.length) {
      cards[cards.length - 1].button = block.items?.[0];
    }
  }
  return cards;
}

/** Strips the leading value token so the label doesn't repeat the big number. */
function statLabel(title: string) {
  return title.replace(/^(\d+\+?|\S+)\s+/, "");
}

function StatValue({ title }: { title: string }) {
  const match = title.match(/^(\d+)(\+?)/);
  if (match) return <CountUp value={Number(match[1])} suffix={match[2]} />;
  return <>{title.split(" ")[0]}</>;
}
