import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/cookie-policy");

export const Route = createFileRoute("/cookie-policy")({
  head: () => headFor(page, "Cookie Policy"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Cookie Policy" }]}
    />
  ),
});
