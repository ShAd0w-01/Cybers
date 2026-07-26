import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/terms-of-use.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/terms-of-use")({
  head: () => headFor(page, "Terms of Use"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Terms of Use" }]}
    />
  ),
});
