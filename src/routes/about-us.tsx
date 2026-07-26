import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

const page = getPage("/about-us");

export const Route = createFileRoute("/about-us")({
  head: () => headFor(page, "About Cybersentinels Consulting"),
  component: () => (
    <ContentPage
      page={page!}
      eyebrow="About Us"
      crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
    />
  ),
});
