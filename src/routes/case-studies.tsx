import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import type { PageContent } from "@/content/site";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/case-studies.json")).default as PageContent;

export const Route = createFileRoute("/case-studies")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Case Studies"),
  component: CaseStudies,
});

function CaseStudies() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="Case Studies"
      crumbs={[{ label: "Home", to: "/" }, { label: "Case Studies" }]}
    />
  );
}
