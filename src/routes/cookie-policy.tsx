import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/cookie-policy.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/cookie-policy")({
  head: () => headFor(page, "Cookie Policy"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Cookie Policy" }]}
    />
  ),
});
