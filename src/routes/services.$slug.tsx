import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { pillarForService, type PageContent } from "@/content/site";
import { RelatedServices } from "@/components/site/RelatedServices";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { faqsFor, faqSchema } from "@/content/faqs";

/**
 * Each service page's copy is its own lazily-loaded chunk, so visitors only
 * download the one they are reading.
 */
const servicePages = import.meta.glob("../content/pages/services/*.json", {
  import: "default",
}) as Record<string, () => Promise<PageContent>>;

const loadServicePage = async (slug: string): Promise<PageContent | undefined> => {
  const load = servicePages[`../content/pages/services/${slug}.json`];
  return load ? await load() : undefined;
};

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const page = await loadServicePage(params.slug);
    if (!page) throw notFound();
    return { slug: params.slug, page };
  },
  head: ({ loaderData }) => {
    const base = headFor(loaderData?.page, "Services");
    const faqs = loaderData?.slug ? faqsFor(loaderData.slug) : undefined;
    return faqs
      ? {
          ...base,
          scripts: [
            {
              type: "application/ld+json",
              children: JSON.stringify(faqSchema(faqs)),
            },
          ],
        }
      : base;
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug, page } = Route.useLoaderData();
  const url = `/services/${slug}`;
  const pillar = pillarForService(url);
  const isPillar = pillar?.url === url;
  const faqs = faqsFor(slug);

  return (
    <ContentPage
      page={page}
      eyebrow={isPillar ? "Service Pillar" : pillar?.short}
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Services", to: "/services" },
        ...(isPillar || !pillar ? [] : [{ label: pillar.short, to: pillar.url }]),
        { label: page.name },
      ]}
    >
      {faqs ? <FaqAccordion faqs={faqs} /> : null}
      {pillar ? <RelatedServices pillar={pillar} currentUrl={url} /> : null}
    </ContentPage>
  );
}
