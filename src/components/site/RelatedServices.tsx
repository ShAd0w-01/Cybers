import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";
import type { Pillar } from "@/content/site";

export function RelatedServices({
  pillar,
  currentUrl,
}: {
  pillar: Pillar;
  currentUrl: string;
}) {
  const related = pillar.services.filter((s) => s.url !== currentUrl).slice(0, 6);
  if (related.length === 0) return null;

  return (
    <section className="wash-quiet band-soft py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="brand-rule mb-6" />
              <h2 className="type-h2">
                Related services in {pillar.short}
              </h2>
            </div>
            <CtaLink to={pillar.url} variant="outline">
              View the full pillar
            </CtaLink>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s, i) => (
            <Reveal key={s.url} delay={i * 50} className="section-card card-lift bg-card/80 backdrop-blur-sm">
              <Link to={s.url} className="group block h-full p-7">
                <h3 className="type-h4 transition-colors group-hover:text-coral-ink">
                  {s.title}
                </h3>
                <div className="brand-rule mt-3 w-6 transition-all duration-300 group-hover:w-12" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

  );
}
