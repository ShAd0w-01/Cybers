import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/terms-of-use");

export const Route = createFileRoute("/terms-of-use")({
  head: () => headFor(page, "Terms of Use"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Terms of Use" }]}
    />
  ),
});
