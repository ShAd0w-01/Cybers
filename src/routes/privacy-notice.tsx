import { createFileRoute } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import type { PageContent } from "@/content/site";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/privacy-notice.json")).default as PageContent;

export const Route = createFileRoute("/privacy-notice")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Privacy Notice"),
  component: PrivacyNotice,
});

function PrivacyNotice() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
      eyebrow="Legal"
      crumbs={[{ label: "Home", to: "/" }, { label: "Privacy Notice" }]}
    />
  );
}
