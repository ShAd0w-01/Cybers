import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/responsible-disclosure");

export const Route = createFileRoute("/responsible-disclosure")({
  head: () => headFor(page, "Responsible Disclosure"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="Trust"
      crumbs={[{ label: "Home", to: "/" }, { label: "Responsible Disclosure" }]}
    />
  ),
});
