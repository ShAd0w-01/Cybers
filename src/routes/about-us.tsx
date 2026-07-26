import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent } from "@/content/site";
import pageData from "@/content/pages/about-us.json";

const page = pageData as PageContent;

export const Route = createFileRoute("/about-us")({
  head: () => headFor(page, "About Cybersentinels Consulting"),
  component: () => (
    <ContentPage
      page={page}
      eyebrow="About Us"
      crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
    />
  ),
});
