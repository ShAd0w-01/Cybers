import { Link } from "@tanstack/react-router";
import { BrandMark } from "./Logo";
import { CtaLink, routeForLabel } from "./CtaLink";
import { Reveal } from "./Reveal";
import { AuroraBloom } from "./AuroraBloom";
import { Doodle, type DoodleVariant } from "./Doodle";

/** Picks a doodle scene that matches the page subject. */
function doodleFor(title: string): DoodleVariant {
  const t = title.toLowerCase();
  if (/(iso|soc|pci|gdpr|dpdpa|cmmc|sebi|compliance|audit|certif|policy|privacy|governance)/.test(t))
    return "compliance";
  if (/(pen ?test|penetration|vapt|red team|vulnerab|threat|attack|security testing|assurance)/.test(t))
    return "radar";
  if (/(cloud|network|infrastructure|api|saas|technology|logistics|supply)/.test(t)) return "network";
  if (/(insight|blog|article|news|case stud|resource|career)/.test(t)) return "insight";
  if (/(contact|about|industr|global|partner)/.test(t)) return "globe";
  if (/(kit|download|template|toolkit|starter)/.test(t)) return "toolkit";
  return "shield";
}

export type Crumb = { label: string; to?: string };

export function PageHero({
  eyebrow,
  title,
  paragraphs,
  buttons = [],
  crumbs = [],
  doodle,
}: {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  buttons?: string[];
  crumbs?: Crumb[];
  doodle?: DoodleVariant;
}) {
  return (
    <section className="wash-warm band-soft relative overflow-hidden text-ink-foreground">
      <AuroraBloom intensity={0.62} blur={78} direction="bottom" fade={58} />
      <Doodle variant={doodle ?? doodleFor(`${eyebrow ?? ""} ${title}`)} opacity={0.85} />
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

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 type-small text-ink-muted">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  {c.to ? (
                    <Link to={c.to} className="transition-colors hover:text-coral-ink">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-ink-foreground">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal>
          {eyebrow ? <p className="mb-6 type-eyebrow text-amber-ink">{eyebrow}</p> : null}
          <h1 className="max-w-4xl type-display">{title}</h1>
          <div className="mt-7 max-w-2xl space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="type-lead text-ink-muted">
                {p}
              </p>
            ))}
          </div>
          {buttons.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-3">
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
