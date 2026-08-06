import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { CaseStudyShowcase } from "@/components/site/CaseStudyShowcase";
import { listPublishedCaseStudies } from "@/lib/casestudies.functions";
import type { PageContent } from "@/content/site";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/case-studies.json")).default as PageContent;

export const Route = createFileRoute("/case-studies")({
  loader: async () => ({
    page: await loadPage(),
    caseStudies: await listPublishedCaseStudies(),
  }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Case Studies"),
  component: CaseStudies,
});

function CaseStudies() {
  const { page, caseStudies } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="Case Studies"
      crumbs={[{ label: "Home", to: "/" }, { label: "Case Studies" }]}
    >
      <CaseStudyShowcase items={caseStudies} />
    </ContentPage>
  );
}

