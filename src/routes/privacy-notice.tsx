import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/privacy-notice");

export const Route = createFileRoute("/privacy-notice")({
  head: () => headFor(page, "Privacy Notice"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Privacy Notice" }]}
    />
  ),
});
