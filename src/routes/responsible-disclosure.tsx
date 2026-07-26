import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import type { PageContent } from "@/content/site";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/responsible-disclosure.json")).default as PageContent;

export const Route = createFileRoute("/responsible-disclosure")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Responsible Disclosure"),
  component: ResponsibleDisclosure,
});

function ResponsibleDisclosure() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="Trust"
      crumbs={[{ label: "Home", to: "/" }, { label: "Responsible Disclosure" }]}
    />
  );
}
