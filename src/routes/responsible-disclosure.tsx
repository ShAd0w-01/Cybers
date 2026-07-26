import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/responsible-disclosure.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/responsible-disclosure")({
  head: () => headFor(page, "Responsible Disclosure"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Trust"
      crumbs={[{ label: "Home", to: "/" }, { label: "Responsible Disclosure" }]}
    />
  ),
});
