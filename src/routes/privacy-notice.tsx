import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/privacy-notice.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/privacy-notice")({
  head: () => headFor(page, "Privacy Notice"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Privacy Notice" }]}
    />
  ),
});
