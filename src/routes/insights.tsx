import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import type { PageContent } from "@/content/site";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/insights.json")).default as PageContent;

export const Route = createFileRoute("/insights")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Insights & Resources"),
  component: Insights,
});

function Insights() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="Insights & Resources"
      crumbs={[{ label: "Home", to: "/" }, { label: "Insights" }]}
    />
  );
}
