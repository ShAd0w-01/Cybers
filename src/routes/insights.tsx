import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/insights.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/insights")({
  head: () => headFor(page, "Insights & Resources"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Insights & Resources"
      crumbs={[{ label: "Home", to: "/" }, { label: "Insights" }]}
    />
  ),
});
