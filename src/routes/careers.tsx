import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/careers.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/careers")({
  head: () => headFor(page, "Careers"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="Careers"
      crumbs={[{ label: "Home", to: "/" }, { label: "Careers" }]}
    />
  ),
});
