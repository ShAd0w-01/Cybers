import { Link } from "@tanstack/react-router";
import { BrandMark } from "./Logo";
import { CtaLink, routeForLabel } from "./CtaLink";
import { Reveal } from "./Reveal";

export type Crumb = { label: string; to?: string };

export function PageHero({
  eyebrow,
  title,
  paragraphs,
  buttons = [],
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  buttons?: string[];
  crumbs?: Crumb[];
}) {
  return (
    <section className="wash-warm band-soft relative overflow-hidden text-ink-foreground">
      <div className="ink-grid absolute inset-0" aria-hidden="true" />
      <div className="hero-noise pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -right-40 -top-40 size-[34rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--magenta) 0%, var(--coral) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <BrandMark
        spin
        className="pointer-events-none absolute -bottom-24 -left-16 h-[26rem] w-auto opacity-[0.07]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  {c.to ? (
                    <Link to={c.to} className="transition-colors hover:text-ink-foreground">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-ink-foreground">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal>
          {eyebrow ? (
            <p className="mb-5 type-eyebrow text-amber-ink">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-4xl font-display text-3xl font-semibold leading-[1.12] sm:text-[2.75rem] lg:text-[3.25rem]">
            {title}
          </h1>
          <div className="mt-6 max-w-2xl space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-ink-muted">
                {p}
              </p>
            ))}
          </div>
          {buttons.length > 0 ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {buttons.map((b, i) => (
                <CtaLink key={b} to={routeForLabel(b)} variant={i === 0 ? "primary" : "ghost-dark"}>
                  {b}
                </CtaLink>
              ))}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
