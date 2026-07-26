import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";

const industryPages = import.meta.glob("../content/pages/industries/*.json", {
  eager: true,
  import: "default",
}) as Record<string, PageContent>;

const getIndustryPage = (slug: string): PageContent | undefined =>
  industryPages[`../content/pages/industries/${slug}.json`];

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const page = getIndustryPage(params.slug);
    if (!page) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => headFor(getIndustryPage(params.slug), "Industries"),
  component: IndustryDetail,
});

function IndustryDetail() {
  const { slug } = Route.useLoaderData();
  const page = getIndustryPage(slug)!;
  return (
    <ContentPage
      page={page}
      eyebrow="Industry"
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Industries", to: "/industries" },
        { label: page.name },
      ]}
    />
  );
}
