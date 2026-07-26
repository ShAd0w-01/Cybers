import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const page = getPage(`/industries/${params.slug}`);
    if (!page) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => headFor(getPage(`/industries/${params.slug}`), "Industries"),
  component: IndustryDetail,
});

function IndustryDetail() {
  const { slug } = Route.useLoaderData();
  const page = getPage(`/industries/${slug}`)!;
  return (
    <ContentPage
      page={page}
      eyebrow="Industry"
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Industries", to: "/industries" },
        { label: page.name },
      ]}
    />
  );
}
