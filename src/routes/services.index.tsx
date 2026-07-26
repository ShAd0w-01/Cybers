import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage, pillars } from "@/content/site";
import { Reveal } from "@/components/site/Reveal";

const page = getPage("/services");

export const Route = createFileRoute("/services/")({
  head: () => headFor(page, "Cybersecurity, Compliance & Privacy Services"),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <ContentPage
      page={page!}
      eyebrow="Services"
      crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
    >
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="brand-rule mb-5" />
            <h2 className="type-h2">
              Full service directory
            </h2>
          </Reveal>
          <div className="mt-10 space-y-12">
            {pillars.map((p, i) => (
              <Reveal key={p.url} delay={i * 40}>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
                  <h3 className="type-h3">
                    <Link to={p.url} className="transition-colors hover:text-coral">
                      {p.title}
                    </Link>
                  </h3>
                  <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {p.services.length} services
                  </span>
                </div>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  {p.services.map((s) => (
                    <li key={s.url}>
                      <Link
                        to={s.url}
                        className="group flex items-start gap-2.5 text-sm leading-snug text-muted-foreground transition-colors hover:text-coral"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-coral/60 transition-colors group-hover:bg-coral" />
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
