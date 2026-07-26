import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/case-studies.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/case-studies")({
  head: () => headFor(page, "Case Studies"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Case Studies"
      crumbs={[{ label: "Home", to: "/" }, { label: "Case Studies" }]}
    />
  ),
});
