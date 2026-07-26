import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { pillarForService, type PageContent } from "@/content/site";

const servicePages = import.meta.glob("../content/pages/services/*.json", {
  eager: true,
  import: "default",
}) as Record<string, PageContent>;

const getServicePage = (slug: string): PageContent | undefined =>
  servicePages[`../content/pages/services/${slug}.json`];
import { RelatedServices } from "@/components/site/RelatedServices";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const page = getServicePage(params.slug);
    if (!page) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) =>
    headFor(getServicePage(params.slug), "Services"),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useLoaderData();
  const url = `/services/${slug}`;
  const page = getServicePage(slug)!;
  const pillar = pillarForService(url);
  const isPillar = pillar?.url === url;

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
      {pillar ? <RelatedServices pillar={pillar} currentUrl={url} /> : null}
    </ContentPage>
  );
}
