import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage, pillarForService } from "@/content/site";
import { RelatedServices } from "@/components/site/RelatedServices";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const page = getPage(`/services/${params.slug}`);
    if (!page) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) =>
    headFor(getPage(`/services/${params.slug}`), "Services"),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useLoaderData();
  const url = `/services/${slug}`;
  const page = getPage(url)!;
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
