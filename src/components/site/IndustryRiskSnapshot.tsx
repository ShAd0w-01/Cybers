import { Link } from "@tanstack/react-router";
import { AlertTriangle, ClipboardCheck, Gauge, ScrollText } from "lucide-react";

import { Reveal } from "./Reveal";
import { IconTile } from "./IconTile";
import { CtaLink } from "./CtaLink";
import { snapshotFor } from "@/content/tools-data";

/** Sector risk snapshot appended to each industry detail page. */
export function IndustryRiskSnapshot({ slug }: { slug: string }) {
  const snap = snapshotFor(slug);
  if (!snap) return null;

  return (
    <section className="wash-soft band-soft py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="type-eyebrow text-coral-ink">Risk snapshot</p>
          <h2 className="type-h2 mt-3 text-foreground">What we typically find in {snap.label}</h2>
          <div className="brand-rule mt-4 w-14" />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {snap.stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 70}
              className="card-lift rounded-xl border border-border bg-background p-6"
            >
              <p className="brand-gradient-text font-display text-4xl font-semibold">{s.value}</p>
              <p className="type-h4 mt-2 text-foreground">{s.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.note}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <Reveal className="rounded-xl border border-border bg-background p-7">
            <div className="flex items-center gap-3">
              <IconTile icon={AlertTriangle} />
              <h3 className="type-h3 text-foreground">Ranked exposure</h3>
            </div>
            <ul className="mt-6 space-y-5">
              {snap.risks.map((r) => (
                <li key={r.title}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-semibold text-foreground">{r.title}</p>
                    <span className="text-xs font-semibold text-muted-foreground">{r.weight}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                    <div
                      className="brand-gradient h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${r.weight}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="space-y-6">
            <Reveal className="rounded-xl border border-border bg-background p-7">
              <div className="flex items-center gap-3">
                <IconTile icon={ScrollText} size="sm" />
                <h3 className="type-h4 text-foreground">Obligations usually in scope</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {snap.obligations.map((o) => (
                  <li
                    key={o}
                    className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground"
                  >
                    {o}
                  </li>
                ))}
              </ul>
              <Link
                to="/compliance-explorer"
                className="mt-5 inline-block text-sm font-semibold text-coral-ink"
              >
                Compare these frameworks →
              </Link>
            </Reveal>

            <Reveal delay={90} className="rounded-xl border border-border bg-background p-7">
              <div className="flex items-center gap-3">
                <IconTile icon={ClipboardCheck} size="sm" />
                <h3 className="type-h4 text-foreground">First 90 days</h3>
              </div>
              <ol className="mt-4 space-y-3">
                {snap.firstMoves.map((m, i) => (
                  <li key={m} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-display text-sm font-semibold text-coral-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {m}
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={140} className="rounded-xl border border-border bg-background p-7">
              <div className="flex items-center gap-3">
                <IconTile icon={Gauge} size="sm" />
                <h3 className="type-h4 text-foreground">Not sure where you stand?</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Take the eight-question security scorecard for an instant maturity read and a
                prioritised action list.
              </p>
              <CtaLink to="/security-scorecard" className="mt-5 w-full">
                Get your score
              </CtaLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
