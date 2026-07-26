import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/website-disclaimer.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/website-disclaimer")({
  head: () => headFor(page, "Website Disclaimer"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Website Disclaimer" }]}
    />
  ),
});
