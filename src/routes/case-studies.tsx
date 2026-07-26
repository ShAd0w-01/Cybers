import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/case-studies");

export const Route = createFileRoute("/case-studies")({
  head: () => headFor(page, "Case Studies"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Case Studies"
      crumbs={[{ label: "Home", to: "/" }, { label: "Case Studies" }]}
    />
  ),
});
