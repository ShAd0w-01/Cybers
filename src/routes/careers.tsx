import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import type { PageContent } from "@/content/site";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/careers.json")).default as PageContent;

export const Route = createFileRoute("/careers")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Careers"),
  component: Careers,
});

function Careers() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="Careers"
      crumbs={[{ label: "Home", to: "/" }, { label: "Careers" }]}
    />
  );
}
