import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/insights");

export const Route = createFileRoute("/insights")({
  head: () => headFor(page, "Insights & Resources"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Insights & Resources"
      crumbs={[{ label: "Home", to: "/" }, { label: "Insights" }]}
    />
  ),
});
