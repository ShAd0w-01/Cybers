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
import { getSection, heroOf, pillars, industries, frameworkMarks, type PageContent } from "@/content/site";

import homeData from "@/content/pages/home.json";
import { headFor } from "@/components/site/ContentPage";
import { CtaLink, routeForLabel } from "@/components/site/CtaLink";
import { Reveal, CountUp } from "@/components/site/Reveal";
import { IconTile } from "@/components/site/IconTile";

import { SectionRenderer } from "@/components/site/SectionRenderer";
import {
  TestimonialCarousel,
  type Testimonial,
} from "@/components/site/TestimonialCarousel";
import { ThreatMap } from "@/components/site/ThreatMap";
import { NewsStrip } from "@/components/site/NewsStrip";



const page = homeData as PageContent;

export const Route = createFileRoute("/")({
  head: () => headFor(page, "Cybersecurity, Compliance & VAPT Services"),
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
      <section className="ink-wash relative overflow-hidden bg-ink text-ink-foreground">
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
        <div className="ink-grid absolute inset-0" aria-hidden="true" />
        <div className="hero-noise pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:py-28 lg:px-8 lg:py-36">
          <Reveal>
            <p className="type-eyebrow mb-7 text-amber-ink">
              Cybersecurity • Compliance • Privacy • Governance
            </p>
            <h1 className="type-display">
              Strengthen Security.{" "}
              <span className="brand-gradient-text">Simplify Compliance.</span> Build Lasting
              Resilience.
            </h1>
            <div className="mt-8 space-y-5">
              {hero.paragraphs.slice(0, 2).map((p, i) => (
                <p key={i} className="type-lead mx-auto max-w-2xl text-ink-muted">
                  {p}
                </p>
              ))}
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
              <CtaLink to="/contact">Book a Consultation</CtaLink>
              <CtaLink to="/services" variant="ghost-dark">
                Explore Our Services
              </CtaLink>
            </div>
            <p className="type-small mt-5 inline-flex items-center justify-center gap-2 text-ink-muted">
              <CalendarCheck className="size-4 text-amber-ink" aria-hidden="true" />
              Free 30-minute scoping call — no obligation
            </p>

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

      {/* -------------------------------------------------- Credibility */}
      <section className="band-fade bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {credCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 70} className="bg-background p-7">
                <p className="brand-gradient-text font-display text-3xl font-bold">
                  <StatValue title={c.title} />
                </p>
                <h2 className="mt-2 font-display text-sm font-semibold">{statLabel(c.title)}</h2>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Value props */}
      <section className="band-fade bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
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
      <section className="band-fade bg-background py-16 sm:py-24">

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
      <section className="ink-wash band-fade bg-ink py-16 text-ink-foreground sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="brand-rule mb-5" />
              <h2 className="type-h2">
                {approach?.heading}
              </h2>
            </div>
          </Reveal>
          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {approachSteps.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 60}>
                <div className="flex items-center gap-3">
                  <span className="brand-gradient grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="h-px flex-1 bg-ink-border" />
                </div>
                <h3 className="mt-4 type-h4">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------- Mid-page CTA */}
      <section className="band-fade bg-surface py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
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
      <section className="band-fade bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
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
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal
                as="article"
                key={p.url}
                delay={i * 60}
                className="group card-lift sheen flex flex-col rounded-xl border border-border bg-background p-6"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 type-h4">
                  {p.title}
                </h3>
                <div className="brand-rule mt-3 mb-4 w-6 transition-all duration-300 group-hover:w-12" />
                <p className="text-sm leading-relaxed text-muted-foreground">{p.intent}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-4">
                  {p.services.slice(0, 5).map((s) => (
                    <li key={s.url}>
                      <Link
                        to={s.url}
                        className="text-[13px] leading-snug text-muted-foreground transition-colors hover:text-coral-ink"
                      >
                        {s.title}
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
      <ThreatMap />

      {/* ------------------------------------------- Global cyber news */}
      <NewsStrip />

      {/* ---------------------------------------------------- Industries */}
      <section className="band-fade bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="brand-rule mb-5" />
            <h2 className="max-w-3xl type-h2">
              Security and Compliance Designed Around Your Industry
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <Reveal key={ind.url} delay={i * 60} className="bg-background">
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
      <section className="band-fade bg-surface py-16 sm:py-24">
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
            <TestimonialCarousel items={testimonials} />
          </Reveal>

        </div>
      </section>


      {/* ------------------------------------------------------ Insights */}
      {insights ? <SectionRenderer section={insights} index={1} /> : null}

      {/* ------------------------------------------------- Where to start */}
      <section className="ink-wash bg-ink py-16 text-ink-foreground sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
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
