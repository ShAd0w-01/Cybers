import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import type { PageContent } from "@/content/site";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/about-us.json")).default as PageContent;

export const Route = createFileRoute("/about-us")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "About Cybersentinels Consulting"),
  component: AboutUs,
});

function AboutUs() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="About Us"
      crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
    />
  );
}
