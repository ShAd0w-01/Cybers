import indexJson from "./index.json";

export type Block =
  | { type: "p"; text: string }
  | { type: "h1"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "buttons"; items: string[] }
  | { type: "kv"; label: string; value: string };

export type Section = { heading: string; blocks: Block[] };

export type PageContent = {
  page: number;
  name: string;
  url?: string;
  seoTitle?: string;
  metaDescription?: string;
  primaryCta?: string;
  secondaryCta?: string;
  sections: Section[];
};

/**
 * Slim metadata index (url / name / SEO copy) for every page.
 * Full page bodies live in ./pages/*.json and are imported by the route that
 * renders them, so no route ships content it does not display.
 */
export type PageMeta = {
  url: string;
  name: string;
  seoTitle?: string;
  metaDescription?: string;
};

export const pageIndex = indexJson as PageMeta[];

export function getPageMeta(url: string): PageMeta | undefined {
  return pageIndex.find((p) => p.url === url);
}

export function getSection(page: PageContent | undefined, heading: string): Section | undefined {
  if (!page) return undefined;
  const needle = heading.toLowerCase();
  return page.sections.find((s) => s.heading.toLowerCase() === needle);
}

export function heroOf(page: PageContent | undefined) {
  const hero = getSection(page, "Hero") ?? page?.sections[0];
  const h1 = hero?.blocks.find((b) => b.type === "h1") as { text: string } | undefined;
  const paragraphs = (hero?.blocks.filter((b) => b.type === "p") as { text: string }[]) ?? [];
  const buttons = (hero?.blocks.find((b) => b.type === "buttons") as { items: string[] } | undefined)
    ?.items;
  return {
    title: h1?.text ?? page?.name ?? "",
    paragraphs: paragraphs
      .map((p) => p.text)
      // Drop all-caps kicker lines — they are rendered as the eyebrow instead.
      .filter((t) => t !== t.toUpperCase() || t.length > 90),
    buttons: buttons ?? [],
  };
}

/** Sections after the hero — the body of a content page. */
export function bodySections(page: PageContent | undefined): Section[] {
  if (!page) return [];
  const hero = getSection(page, "Hero") ?? page.sections[0];
  return page.sections.filter(
    (s) =>
      s !== hero &&
      !["header navigation", "footer", "breadcrumb"].includes(s.heading.toLowerCase()),
  );
}

/* ------------------------------------------------------------------ */
/* Navigation architecture (from the approved sitemap blueprint)       */
/* ------------------------------------------------------------------ */

export type ServiceLink = { title: string; url: string };

export type Pillar = {
  title: string;
  short: string;
  url: string;
  intent: string;
  services: ServiceLink[];
};

const s = (url: string): ServiceLink => ({ title: getPageMeta(url)?.name ?? url, url });

export const pillars: Pillar[] = [
  {
    title: "Cybersecurity Testing & Assurance",
    short: "Testing & Assurance",
    url: "/services/cybersecurity-testing-assurance",
    intent:
      "Assess applications, APIs, cloud, infrastructure, code and attack paths through structured technical testing.",
    services: [
      s("/services/vulnerability-assessment-penetration-testing"),
      s("/services/web-application-penetration-testing"),
      s("/services/mobile-application-penetration-testing"),
      s("/services/api-penetration-testing"),
      s("/services/network-infrastructure-vapt"),
      s("/services/cloud-security-assessment"),
      s("/services/source-code-security-review"),
      s("/services/red-teaming"),
      s("/services/vulnerability-management"),
    ],
  },
  {
    title: "Governance, Risk & Compliance",
    short: "Governance & Compliance",
    url: "/services/governance-risk-compliance",
    intent:
      "Implement frameworks, prepare for independent assurance and sustain the controls behind them.",
    services: [
      s("/services/iso-27001-implementation-certification-assistance"),
      s("/services/iso-27701-privacy-information-management"),
      // s("/services/iso-22301-business-continuity"),
      s("/services/iso-27032-cybersecurity-guidelines"),
      s("/services/iso-42001-ai-management-system"),
      s("/services/iso-9001-quality-management"),
      s("/services/soc-1-compliance-assistance"),
      s("/services/soc-2-compliance-assistance"),
      s("/services/pci-dss-compliance-assistance"),
      s("/services/cmmc-level-1-level-2-readiness"),
      s("/services/sebi-cscrf-compliance"),
      s("/services/bfsi-regulatory-compliance"),
      s("/services/governance-risk-compliance-advisory"),
    ],
  },
  {
    title: "Privacy & Data Protection",
    short: "Privacy & Data",
    url: "/services/privacy-data-protection",
    intent:
      "Build accountable privacy operations, assess risk and support legal readiness across jurisdictions.",
    services: [
      s("/services/dpdpa-readiness-implementation"),
      s("/services/gdpr-readiness-implementation"),
      s("/services/virtual-data-protection-officer-vdpo"),
      s("/services/privacy-maturity-gap-assessment"),
      s("/services/data-protection-impact-assessment"),
      s("/services/privacy-governance-program-development"),
    ],
  },
  {
    title: "Advisory, Risk & Managed Services",
    short: "Advisory & Managed",
    url: "/services/advisory-risk-managed-services",
    intent:
      "Add leadership, specialist capacity and recurring program support to your security function.",
    services: [
      s("/services/virtual-chief-information-security-officer-vciso"),
      s("/services/it-security-maturity-assessment"),
      s("/services/third-party-risk-management"),
      s("/services/vendor-risk-management"),
      s("/services/security-awareness-training"),
      s("/services/cyber-insurance-assistance"),
      s("/services/cybersecurity-staff-augmentation"),
      s("/services/managed-governance-compliance"),
      s("/services/security-as-a-service"),
    ],
  },
];

/**
 * WhatsApp business contact. `number` is in international format, digits only
 * (country code first, no "+", spaces or dashes) as wa.me requires.
 */
export const whatsapp = {
  number: "919999999999",
  display: "+91 99999 99999",
  defaultMessage:
    "Hello Cybersentinels, I would like to discuss a cybersecurity, privacy or compliance requirement.",
};



export const industries: ServiceLink[] = [
  s("/industries/technology-saas-it-services"),
  s("/industries/bfsi-fintech-financial-services"),
  s("/industries/professional-services-consulting"),
  s("/industries/logistics-shipping-supply-chain"),
];

export const legalLinks: ServiceLink[] = [
  s("/privacy-notice"),
  s("/cookie-policy"),
  s("/terms-of-use"),
  s("/website-disclaimer"),
  s("/responsible-disclosure"),
];

export const serviceSlugs = pillars.flatMap((p) =>
  [p.url, ...p.services.map((x) => x.url)].map((u) => u.replace("/services/", "")),
);

export function pillarForService(url: string): Pillar | undefined {
  return pillars.find((p) => p.url === url || p.services.some((x) => x.url === url));
}

export const frameworkMarks = [
  "ISO/IEC 27001",
  "ISO/IEC 27701",
  "ISO 22301",
  "ISO/IEC 42001",
  "ISO 9001",
  "SOC 2",
  "PCI DSS",
  "CMMC",
  "SEBI CSCRF",
  "DPDPA",
  "GDPR",
  "NIST CSF",
];

export const allRoutes: string[] = [
  "/",
  "/about-us",
  "/careers",
  "/services",
  ...pillars.flatMap((p) => [p.url, ...p.services.map((x) => x.url)]),
  "/industries",
  ...industries.map((i) => i.url),
  "/case-studies",
  "/insights",
  "/compliance-explorer",
  "/starter-kit",


  "/contact",
  ...legalLinks.map((l) => l.url),
];
