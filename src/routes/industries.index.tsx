import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { industries, getPageMeta, type PageContent } from "@/content/site";
import { Reveal } from "@/components/site/Reveal";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/industries.json")).default as PageContent;

export const Route = createFileRoute("/industries/")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Industries We Serve"),
  component: IndustriesIndex,
});

function IndustriesIndex() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="Industries"
      crumbs={[{ label: "Home", to: "/" }, { label: "Industries" }]}
    >
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {industries.map((ind, i) => (
              <Reveal
                key={ind.url}
                delay={i * 60}
                className="group rounded-xl border border-border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-coral/40 hover:shadow-xl hover:shadow-coral/5"
              >
                <Link to={ind.url}>
                  <h2 className="type-h3 transition-colors group-hover:text-coral-ink">
                    {ind.title}
                  </h2>
                  <div className="brand-rule mt-3 w-6 transition-all duration-300 group-hover:w-14" />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {getPageMeta(ind.url)?.metaDescription}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
