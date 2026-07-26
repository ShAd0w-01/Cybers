import { PageHero, type Crumb } from "./PageHero";
import { SectionRenderer } from "./SectionRenderer";
import { bodySections, heroOf, type PageContent } from "@/content/site";

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
  const hero = heroOf(page);
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={hero.title}
        paragraphs={hero.paragraphs}
        buttons={hero.buttons}
        crumbs={crumbs}
      />
      {bodySections(page).map((section, i) => (
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
