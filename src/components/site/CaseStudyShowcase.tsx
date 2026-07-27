import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";

import { Reveal } from "./Reveal";
import { IconTile } from "./IconTile";
import { CtaLink } from "./CtaLink";
import { caseStudies, resourceHub } from "@/content/tools-data";

/** Outcome-led case studies plus the practical resource hub. */
export function CaseStudyShowcase() {
  return (
    <>
      <section className="wash-soft band-soft py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="type-eyebrow text-coral-ink">Engagement outcomes</p>
            <h2 className="type-h2 mt-3 text-foreground">Representative engagements</h2>
            <div className="brand-rule mt-4 w-14" />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Client names are withheld under confidentiality. Metrics reflect measured outcomes at
              the close of each engagement.
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            {caseStudies.map((cs, i) => (
              <Reveal
                key={cs.slug}
                delay={i * 70}
                as="article"
                className="card-lift rounded-xl border border-border bg-background p-7 sm:p-9"
              >
                <p className="type-eyebrow text-muted-foreground">{cs.sector}</p>
                <h3 className="type-h3 mt-3 max-w-3xl text-foreground">{cs.title}</h3>

                <div className="mt-7 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                  <div>
                    <h4 className="type-h4 text-foreground">The challenge</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {cs.challenge}
                    </p>
                    <h4 className="type-h4 mt-6 text-foreground">What we did</h4>
                    <ul className="mt-3 space-y-2">
                      {cs.approach.map((a) => (
                        <li
                          key={a}
                          className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-coral" />
                          {a}
                        </li>
                      ))}
                    </ul>
                    <h4 className="type-h4 mt-6 text-foreground">Outcome</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {cs.outcome}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-6">
                    <dl className="space-y-5">
                      {cs.metrics.map((m) => (
                        <div key={m.label}>
                          <dt className="sr-only">{m.label}</dt>
                          <dd>
                            <span className="brand-gradient-text block font-display text-4xl font-semibold">
                              {m.value}
                            </span>
                            <span className="mt-1 block text-sm text-muted-foreground">
                              {m.label}
                            </span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Services used
                      </p>
                      <ul className="mt-3 space-y-2">
                        {cs.services.map((s) => (
                          <li key={s.url}>
                            <Link
                              to={s.url}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral-ink"
                            >
                              {s.title}
                              <ArrowRight
                                className="size-3.5"
                                strokeWidth={1.75}
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="type-eyebrow text-coral-ink">Resource hub</p>
            <h2 className="type-h2 mt-3 text-foreground">Practical tools you can use today</h2>
            <div className="brand-rule mt-4 w-14" />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resourceHub.map((r, i) => (
              <Reveal
                key={r.to}
                delay={i * 60}
                className="group card-lift flex h-full flex-col rounded-xl border border-border p-6"
              >
                <IconTile icon={BookOpen} size="sm" />
                <p className="type-eyebrow mt-4 text-muted-foreground">{r.kind}</p>
                <h3 className="type-h4 mt-1.5 text-foreground">{r.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {r.summary}
                </p>
                <Link
                  to={r.to}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-coral-ink"
                >
                  {r.cta}
                  <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 rounded-xl border border-border bg-surface p-8 text-center">
            <h2 className="type-h3 text-foreground">Want an outcome like these?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Tell us the deadline, deal or regulator driving the work. We will scope the shortest
              defensible path to it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CtaLink to="/contact">Book a consultation</CtaLink>
              <CtaLink to="/security-scorecard" variant="outline">
                Take the security scorecard
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
