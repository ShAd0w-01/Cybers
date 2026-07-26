import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/careers");

export const Route = createFileRoute("/careers")({
  head: () => headFor(page, "Careers"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Careers"
      crumbs={[{ label: "Home", to: "/" }, { label: "Careers" }]}
    />
  ),
});
