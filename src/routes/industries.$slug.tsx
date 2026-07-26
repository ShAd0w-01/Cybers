import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { IndustryRiskSnapshot } from "@/components/site/IndustryRiskSnapshot";
import type { PageContent } from "@/content/site";


/** Industry copy is split per page and fetched only when that page is opened. */
const industryPages = import.meta.glob("../content/pages/industries/*.json", {
  import: "default",
}) as Record<string, () => Promise<PageContent>>;

const loadIndustryPage = async (slug: string): Promise<PageContent | undefined> => {
  const load = industryPages[`../content/pages/industries/${slug}.json`];
  return load ? await load() : undefined;
};

export const Route = createFileRoute("/industries/$slug")({
  loader: async ({ params }) => {
    const page = await loadIndustryPage(params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => headFor(loaderData?.page, "Industries"),
  component: IndustryDetail,
});

function IndustryDetail() {
  const { page } = Route.useLoaderData();
  const { slug } = Route.useParams();
  return (
    <ContentPage
      page={page}
      eyebrow="Industry"
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Industries", to: "/industries" },
        { label: page.name },
      ]}
    >
      <IndustryRiskSnapshot slug={slug} />
    </ContentPage>
  );
}

