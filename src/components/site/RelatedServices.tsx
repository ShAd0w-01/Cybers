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
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="brand-rule mb-5" />
              <h2 className="font-display text-2xl font-semibold">
                Related services in {pillar.short}
              </h2>
            </div>
            <CtaLink to={pillar.url} variant="outline">
              View the full pillar
            </CtaLink>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s, i) => (
            <Reveal key={s.url} delay={i * 50} className="bg-background">
              <Link to={s.url} className="group block h-full p-6">
                <h3 className="font-display text-sm font-semibold leading-snug transition-colors group-hover:text-coral">
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
