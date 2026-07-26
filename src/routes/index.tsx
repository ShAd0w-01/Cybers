import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, ScrollText, Lock, Users } from "lucide-react";
import { getPage, getSection, heroOf, pillars, industries, frameworkMarks } from "@/content/site";
import { headFor } from "@/components/site/ContentPage";
import { CtaLink, routeForLabel } from "@/components/site/CtaLink";
import { Reveal, CountUp } from "@/components/site/Reveal";
import { BrandMark } from "@/components/site/Logo";
import { SectionRenderer } from "@/components/site/SectionRenderer";

const page = getPage("/");

export const Route = createFileRoute("/")({
  head: () => headFor(page, "Cybersecurity, Compliance & VAPT Services"),
  component: Home,
});

const pillarIcons = [ShieldCheck, ScrollText, Lock, Users];

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
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="ink-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -right-32 -top-52 size-[46rem] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--magenta) 0%, var(--coral) 42%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
          <Reveal>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-amber">
              Cybersecurity • Compliance • Privacy • Governance
            </p>
            <h1 className="font-display text-[2rem] font-semibold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
              Strengthen Security.{" "}
              <span className="brand-gradient-text">Simplify Compliance.</span> Build Lasting
              Resilience.
            </h1>
            <div className="mt-7 max-w-2xl space-y-4">
              {hero.paragraphs.slice(0, 2).map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-ink-muted">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaLink to="/contact">Book a Consultation</CtaLink>
              <CtaLink to="/services" variant="ghost-dark">
                Explore Our Services
              </CtaLink>
            </div>
            {heroTail ? (
              <p className="mt-8 border-l-2 border-coral pl-4 text-sm italic text-ink-muted">
                {heroTail.type === "p" ? heroTail.text : null}
              </p>
            ) : null}
          </Reveal>

          <Reveal delay={120} className="hidden lg:block">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 grid place-items-center">
                <BrandMark spin className="h-64 w-auto opacity-90" />
              </div>
              <div className="absolute inset-6 rounded-full border border-ink-border" />
              <div className="absolute inset-16 rounded-full border border-ink-border" />
              {["VAPT", "ISO 27001", "SOC 2", "DPDPA", "vCISO", "GDPR"].map((label, i, arr) => {
                const angle = (i / arr.length) * 2 * Math.PI - Math.PI / 2;
                return (
                  <span
                    key={label}
                    className="absolute whitespace-nowrap rounded-full border border-ink-border bg-ink-soft/80 px-3 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur"
                    style={{
                      left: `${50 + 48 * Math.cos(angle)}%`,
                      top: `${50 + 48 * Math.sin(angle)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Framework marquee */}
        <div className="relative border-t border-ink-border py-5">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div
              className="flex shrink-0 items-center gap-12 pr-12"
              style={{ animation: "marquee-x 42s linear infinite" }}
            >
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
      <section className="border-b border-border bg-background py-16 sm:py-20">
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

      {/* ------------------------------------------------ Challenge grid */}
      <section className="border-b border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="brand-rule mb-5" />
              <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[2rem]">
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
                  className="group relative overflow-hidden rounded-xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-coral/40 hover:shadow-2xl hover:shadow-coral/8"
                >
                  <div className="brand-gradient absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                  <Icon className="size-6 text-coral" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-lg font-semibold">{c.title}</h3>
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
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-coral transition-all group-hover:gap-3"
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
      <section className="border-b border-border bg-ink py-16 text-ink-foreground sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <div className="brand-rule mb-5" />
              <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[2rem]">
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
                <h3 className="mt-4 font-display text-base font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------------- Practices */}
      <section className="border-b border-border bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="brand-rule mb-5" />
                <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[2rem]">
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
                className="group flex flex-col rounded-xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-coral/40 hover:shadow-xl hover:shadow-coral/5"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug">
                  {p.title}
                </h3>
                <div className="brand-rule mt-3 mb-4 w-6 transition-all duration-300 group-hover:w-12" />
                <p className="text-sm leading-relaxed text-muted-foreground">{p.intent}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-4">
                  {p.services.slice(0, 5).map((s) => (
                    <li key={s.url}>
                      <Link
                        to={s.url}
                        className="text-[13px] leading-snug text-muted-foreground transition-colors hover:text-coral"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={p.url}
                  className="mt-auto pt-5 text-sm font-semibold text-coral transition-all hover:tracking-wide"
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

      {/* ---------------------------------------------------- Industries */}
      <section className="border-b border-border bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="brand-rule mb-5" />
            <h2 className="max-w-3xl font-display text-2xl font-semibold leading-tight sm:text-[2rem]">
              Security and Compliance Designed Around Your Industry
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <Reveal key={ind.url} delay={i * 60} className="bg-background">
                <Link to={ind.url} className="group block h-full p-7">
                  <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-coral">
                    {ind.title}
                  </h3>
                  <div className="brand-rule mt-3 w-6 transition-all duration-300 group-hover:w-14" />
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-all group-hover:gap-3 group-hover:text-coral">
                    Industry approach <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Insights */}
      {insights ? <SectionRenderer section={insights} index={1} /> : null}

      {/* ------------------------------------------------- Where to start */}
      <section className="bg-ink py-16 text-ink-foreground sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="brand-rule mb-5" />
            <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[2rem]">
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
