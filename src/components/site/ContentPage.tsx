import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { PageHero, type Crumb } from "./PageHero";
import { SectionRenderer } from "./SectionRenderer";
import { bodySections, heroOf, type PageContent } from "@/content/site";
import { getPageOverride } from "@/lib/cms.functions";

export function ContentPage({
  page,
  eyebrow,
  crumbs,
  children,
}: {
  page: PageContent;
  eyebrow?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fetchOverride = useServerFn(getPageOverride);

  // Admin-edited copy (saved in the admin panel) transparently replaces the
  // built-in content for any page whose URL has an override.
  const override = useQuery({
    queryKey: ["page-override", pathname],
    queryFn: () => fetchOverride({ data: { url: pathname } }),
    staleTime: 60_000,
  });

  const effective: PageContent =
    override.data && override.data.sections?.length
      ? { ...page, name: override.data.name, sections: override.data.sections }
      : page;

  const hero = heroOf(effective);
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={hero.title}
        paragraphs={hero.paragraphs}
        buttons={hero.buttons}
        crumbs={crumbs}
      />
      {bodySections(effective).map((section, i) => (
        <SectionRenderer key={`${section.heading}-${i}`} section={section} index={i} />
      ))}
      {children}
    </>
  );
}

export function headFor(page: PageContent | undefined, fallbackTitle: string) {
  const title = page?.seoTitle ?? `${fallbackTitle} | Cybersentinels Consulting`;
  const description =
    page?.metaDescription ??
    "Cybersecurity testing, governance and compliance, privacy and managed advisory services from Cybersentinels Consulting.";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
