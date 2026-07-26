import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/website-disclaimer");

export const Route = createFileRoute("/website-disclaimer")({
  head: () => headFor(page, "Website Disclaimer"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Website Disclaimer" }]}
    />
  ),
});
