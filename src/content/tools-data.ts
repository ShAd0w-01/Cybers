/**
 * Data powering the industry risk snapshots, the compliance framework
 * explorer, the security scorecard and the case-study / resource hub.
 * Content only — no runtime logic lives here.
 */

export type RiskSnapshot = {
  slug: string;
  label: string;
  /** Headline exposure metrics shown as a stat row. */
  stats: { value: string; label: string; note: string }[];
  /** Ranked risks with a 0-100 exposure weighting used for the bar chart. */
  risks: { title: string; weight: number; detail: string }[];
  /** Regulatory / assurance obligations most often in scope. */
  obligations: string[];
  /** Typical first 90 days of an engagement. */
  firstMoves: string[];
};

export const riskSnapshots: RiskSnapshot[] = [
  {
    slug: "technology-saas-it-services",
    label: "Technology, SaaS & IT Services",
    stats: [
      { value: "68%", label: "Deals delayed", note: "by security questionnaires or missing assurance reports" },
      { value: "3.4x", label: "Faster remediation", note: "when testing is tied to the release cycle" },
      { value: "1 in 4", label: "Critical findings", note: "originate in third-party or open-source components" },
    ],
    risks: [
      { title: "Exposed APIs and admin interfaces", weight: 92, detail: "Broken object-level authorisation and unauthenticated admin paths remain the most exploited SaaS weakness." },
      { title: "Cloud misconfiguration and secrets", weight: 84, detail: "Over-permissive IAM roles, public buckets and committed keys across fast-moving environments." },
      { title: "Multi-tenant isolation", weight: 71, detail: "Tenant boundary flaws in data access, background jobs and shared caches." },
      { title: "Supply-chain dependencies", weight: 66, detail: "Unpinned packages, subprocessors and CI/CD tokens with production reach." },
      { title: "Customer assurance gaps", weight: 58, detail: "No SOC 2 or ISO 27001 evidence set when enterprise buyers ask." },
    ],
    obligations: ["ISO/IEC 27001", "SOC 2 Type II", "DPDPA", "GDPR", "Customer security addenda"],
    firstMoves: [
      "Application, API and cloud configuration review of the production platform",
      "Secrets, IAM and CI/CD pipeline hardening",
      "Evidence baseline for SOC 2 or ISO 27001",
      "Recurring release-aligned testing cadence",
    ],
  },
  {
    slug: "bfsi-fintech-financial-services",
    label: "BFSI, FinTech & Financial Services",
    stats: [
      { value: "6 hrs", label: "Incident reporting", note: "CERT-In expects notification within six hours" },
      { value: "100%", label: "Scope coverage", note: "regulators expect for critical payment and customer systems" },
      { value: "2x", label: "Vendor scrutiny", note: "third-party failures now drive most reported outages" },
    ],
    risks: [
      { title: "Regulatory reporting readiness", weight: 94, detail: "CERT-In, RBI and SEBI CSCRF timelines demand rehearsed detection and escalation." },
      { title: "Payment and transaction integrity", weight: 88, detail: "PCI DSS scope, tokenisation gaps and fraud-adjacent logic flaws." },
      { title: "Third-party and outsourcing risk", weight: 80, detail: "Critical service providers with production access and weak assurance evidence." },
      { title: "Customer data protection", weight: 74, detail: "DPDPA obligations across KYC, support, analytics and archival stores." },
      { title: "Cyber resilience and recovery", weight: 69, detail: "Tested recovery objectives for core banking and customer-facing channels." },
    ],
    obligations: ["SEBI CSCRF", "RBI cyber directions", "PCI DSS", "ISO/IEC 27001", "DPDPA", "CERT-In"],
    firstMoves: [
      "Regulatory gap assessment against the applicable directions",
      "VAPT across customer channels, APIs and internal networks",
      "Third-party risk tiering with evidence collection",
      "Incident response and recovery tabletop exercise",
    ],
  },
  {
    slug: "professional-services-consulting",
    label: "Professional Services & Consulting",
    stats: [
      { value: "82%", label: "Client contracts", note: "now carry explicit security and confidentiality controls" },
      { value: "#1", label: "Attack path", note: "identity compromise through phishing and token theft" },
      { value: "45 days", label: "Typical readiness", note: "to a defensible ISO 27001 evidence baseline" },
    ],
    risks: [
      { title: "Identity and email compromise", weight: 90, detail: "MFA gaps, legacy auth and OAuth consent abuse across distributed teams." },
      { title: "Client data sprawl", weight: 83, detail: "Project files across mail, chat, drives and personal devices with no retention control." },
      { title: "Over-shared collaboration links", weight: 72, detail: "Guest access, anonymous links and stale external memberships." },
      { title: "Contractor and subcontractor access", weight: 64, detail: "Onboarding and offboarding gaps for short engagements." },
      { title: "Assurance evidence gaps", weight: 57, detail: "Client questionnaires answered ad hoc without underlying controls." },
    ],
    obligations: ["ISO/IEC 27001", "SOC 2", "DPDPA", "GDPR", "Client contractual controls"],
    firstMoves: [
      "Identity, device and collaboration configuration review",
      "Data classification and retention baseline",
      "Client questionnaire and evidence pack",
      "Role-based awareness training for delivery teams",
    ],
  },
  {
    slug: "logistics-shipping-supply-chain",
    label: "Logistics, Shipping & Supply Chain",
    stats: [
      { value: "72 hrs", label: "Disruption window", note: "typical operational impact of a ransomware event" },
      { value: "150+", label: "Connected parties", note: "agents, carriers, ports and platforms in a mid-size network" },
      { value: "60%", label: "Legacy exposure", note: "of operational systems running unsupported components" },
    ],
    risks: [
      { title: "Operational availability", weight: 93, detail: "Booking, tracking and documentation outages cascade to customers within hours." },
      { title: "Partner and EDI connectivity", weight: 85, detail: "Trusted integrations with agents, carriers and ports bypass perimeter controls." },
      { title: "Legacy and unpatched systems", weight: 78, detail: "Warehouse, terminal and back-office systems with limited vendor support." },
      { title: "Customer portal exposure", weight: 70, detail: "Commercial and shipment data reachable through weak authorisation." },
      { title: "Recovery dependencies", weight: 65, detail: "Untested backups and no manual fallback for time-critical processes." },
    ],
    obligations: ["ISO/IEC 27001", "ISO 22301", "DPDPA", "Customer and port authority requirements"],
    firstMoves: [
      "Critical service and dependency mapping",
      "External attack-surface and portal testing",
      "Vendor tiering for carriers, agents and platforms",
      "Recovery and continuity exercise for a disruption scenario",
    ],
  },
];

export function snapshotFor(slug: string) {
  return riskSnapshots.find((r) => r.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Compliance framework explorer                                       */
/* ------------------------------------------------------------------ */

export type Framework = {
  code: string;
  name: string;
  category: "Security" | "Privacy" | "Payments" | "Resilience" | "Sector";
  regions: string[];
  effort: "Light" | "Moderate" | "Heavy";
  timeline: string;
  audit: string;
  bestFor: string;
  checklist: string[];
  serviceUrl: string;
};

export const frameworks: Framework[] = [
  {
    code: "ISO/IEC 27001",
    name: "Information Security Management System",
    category: "Security",
    regions: ["India", "UAE", "Global"],
    effort: "Heavy",
    timeline: "4–8 months",
    audit: "Accredited certification body, Stage 1 + Stage 2",
    bestFor: "Organisations that need a recognised, auditable security certificate for customers and tenders.",
    checklist: [
      "Define scope, context and interested parties",
      "Run risk assessment and produce the Statement of Applicability",
      "Publish policies and assign control ownership",
      "Operate the ISMS for an evidence period",
      "Complete internal audit and management review",
    ],
    serviceUrl: "/services/iso-27001-implementation-certification-assistance",
  },
  {
    code: "SOC 2",
    name: "Trust Services Criteria Report",
    category: "Security",
    regions: ["Global", "United States"],
    effort: "Moderate",
    timeline: "3–6 months to Type I",
    audit: "Licensed CPA firm attestation",
    bestFor: "SaaS and technology vendors selling to North American enterprise buyers.",
    checklist: [
      "Select criteria and reporting period",
      "Map controls to the criteria and close design gaps",
      "Automate evidence for access, change and monitoring",
      "Run a readiness assessment before the audit window",
    ],
    serviceUrl: "/services/soc-2-compliance-assistance",
  },
  {
    code: "PCI DSS",
    name: "Payment Card Industry Data Security Standard",
    category: "Payments",
    regions: ["Global"],
    effort: "Heavy",
    timeline: "4–9 months",
    audit: "QSA assessment or self-assessment questionnaire",
    bestFor: "Any business that stores, processes or transmits cardholder data.",
    checklist: [
      "Confirm merchant or service-provider level and SAQ type",
      "Scope the cardholder data environment and reduce it",
      "Implement segmentation, logging and key management",
      "Complete required scanning and penetration testing",
    ],
    serviceUrl: "/services/pci-dss-compliance-assistance",
  },
  {
    code: "DPDPA",
    name: "Digital Personal Data Protection Act, 2023",
    category: "Privacy",
    regions: ["India"],
    effort: "Moderate",
    timeline: "3–5 months",
    audit: "Self-accountable; Data Protection Officer where designated",
    bestFor: "Organisations processing personal data of individuals in India.",
    checklist: [
      "Build the personal data inventory and processing register",
      "Rewrite notices and consent capture",
      "Operationalise data principal rights and grievance redressal",
      "Update processor contracts and breach notification runbooks",
    ],
    serviceUrl: "/services/dpdpa-readiness-implementation",
  },
  {
    code: "GDPR",
    name: "EU General Data Protection Regulation",
    category: "Privacy",
    regions: ["European Union", "Global"],
    effort: "Heavy",
    timeline: "4–8 months",
    audit: "Supervisory authority oversight; DPO where required",
    bestFor: "Businesses handling EU or UK personal data or acting as a processor for EU clients.",
    checklist: [
      "Record processing activities under Article 30",
      "Establish lawful bases and transfer mechanisms",
      "Run DPIAs on high-risk processing",
      "Stand up rights handling and 72-hour breach process",
    ],
    serviceUrl: "/services/gdpr-readiness-implementation",
  },
  {
    code: "ISO 22301",
    name: "Business Continuity Management System",
    category: "Resilience",
    regions: ["India", "UAE", "Global"],
    effort: "Moderate",
    timeline: "3–6 months",
    audit: "Accredited certification body",
    bestFor: "Operations where downtime directly harms customers, revenue or safety.",
    checklist: [
      "Complete business impact analysis and set RTO/RPO",
      "Design continuity and recovery strategies",
      "Document plans and communication trees",
      "Exercise, review and improve",
    ],
    serviceUrl: "/services/iso-22301-business-continuity",
  },
  {
    code: "SEBI CSCRF",
    name: "Cybersecurity and Cyber Resilience Framework",
    category: "Sector",
    regions: ["India"],
    effort: "Heavy",
    timeline: "4–7 months",
    audit: "Auditor submission to SEBI on the prescribed cycle",
    bestFor: "SEBI-regulated entities and market intermediaries.",
    checklist: [
      "Classify the entity and confirm applicable controls",
      "Close governance, testing and monitoring gaps",
      "Establish SOC, VAPT and reporting cadence",
      "Prepare the compliance submission evidence",
    ],
    serviceUrl: "/services/sebi-cscrf-compliance",
  },
  {
    code: "CMMC",
    name: "Cybersecurity Maturity Model Certification",
    category: "Sector",
    regions: ["United States", "Global"],
    effort: "Heavy",
    timeline: "5–10 months",
    audit: "Self-assessment (L1) or C3PAO assessment (L2)",
    bestFor: "Suppliers in the US defence industrial base handling FCI or CUI.",
    checklist: [
      "Determine level and CUI boundary",
      "Assess against NIST SP 800-171 practices",
      "Remediate with a POA&M and system security plan",
      "Book assessment and maintain evidence",
    ],
    serviceUrl: "/services/cmmc-level-1-level-2-readiness",
  },
  {
    code: "ISO/IEC 42001",
    name: "AI Management System",
    category: "Security",
    regions: ["Global"],
    effort: "Moderate",
    timeline: "3–6 months",
    audit: "Accredited certification body",
    bestFor: "Teams shipping AI features that customers or regulators will scrutinise.",
    checklist: [
      "Inventory AI systems and intended use",
      "Assess AI-specific risk and impact",
      "Define oversight, data and model governance",
      "Monitor performance and incidents",
    ],
    serviceUrl: "/services/iso-42001-ai-management-system",
  },
  {
    code: "ISO/IEC 27701",
    name: "Privacy Information Management System",
    category: "Privacy",
    regions: ["Global"],
    effort: "Moderate",
    timeline: "3–5 months (with ISO 27001)",
    audit: "Extension audit on an existing ISMS",
    bestFor: "Certified ISO 27001 organisations that want a privacy extension buyers recognise.",
    checklist: [
      "Confirm controller and processor roles",
      "Extend the ISMS scope to privacy controls",
      "Map obligations to DPDPA and GDPR requirements",
      "Evidence privacy operations over an audit period",
    ],
    serviceUrl: "/services/iso-27701-privacy-information-management",
  },
];

/* ------------------------------------------------------------------ */
/* Case studies and downloadable resources                             */
/* ------------------------------------------------------------------ */

export type CaseStudy = {
  slug: string;
  sector: string;
  title: string;
  challenge: string;
  approach: string[];
  metrics: { value: string; label: string }[];
  outcome: string;
  services: { title: string; url: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "saas-soc2-readiness",
    sector: "SaaS platform, 180 employees",
    title: "Cleared enterprise security review and reached SOC 2 readiness in one quarter",
    challenge:
      "Two enterprise deals were blocked pending an assurance report and answers to a 240-question security review.",
    approach: [
      "Application, API and cloud assessment of the production platform",
      "Control design against the Trust Services Criteria",
      "Evidence automation for access, change and monitoring",
      "Questionnaire response library owned by the sales engineering team",
    ],
    metrics: [
      { value: "94%", label: "Critical and high findings closed" },
      { value: "11 wks", label: "To audit-ready evidence" },
      { value: "2", label: "Blocked enterprise deals unblocked" },
    ],
    outcome:
      "The platform entered its SOC 2 observation window with a documented control set and a repeatable release-aligned testing cadence.",
    services: [
      { title: "SOC 2 Compliance Assistance", url: "/services/soc-2-compliance-assistance" },
      { title: "Cloud Security Assessment", url: "/services/cloud-security-assessment" },
    ],
  },
  {
    slug: "bfsi-regulatory-resilience",
    sector: "Regulated financial intermediary",
    title: "Closed regulatory gaps and rehearsed a six-hour incident reporting path",
    challenge:
      "Supervisory expectations had tightened while incident escalation still depended on informal contact between teams.",
    approach: [
      "Gap assessment against the applicable regulatory directions",
      "VAPT across customer channels, APIs and internal networks",
      "Third-party tiering with evidence collection for critical providers",
      "Tabletop exercise covering detection, escalation and reporting",
    ],
    metrics: [
      { value: "100%", label: "Critical systems in tested scope" },
      { value: "5.5 hrs", label: "Rehearsed reporting time" },
      { value: "38", label: "Vendors risk-tiered" },
    ],
    outcome:
      "Leadership gained a single risk register mapped to regulatory clauses, with named owners and a quarterly review rhythm.",
    services: [
      { title: "BFSI Regulatory Compliance", url: "/services/bfsi-regulatory-compliance" },
      { title: "Third-Party Risk Management", url: "/services/third-party-risk-management" },
    ],
  },
  {
    slug: "logistics-resilience-program",
    sector: "Logistics network across three countries",
    title: "Reduced external attack surface and proved recovery for time-critical operations",
    challenge:
      "Booking and documentation platforms were reachable by more than a hundred partners with inconsistent controls and untested backups.",
    approach: [
      "Critical service and dependency mapping across sites",
      "External attack-surface testing on portals and integrations",
      "Segmentation and access hardening for partner connectivity",
      "Recovery exercise against a ransomware disruption scenario",
    ],
    metrics: [
      { value: "61%", label: "Internet-facing surface reduced" },
      { value: "4 hrs", label: "Validated recovery objective" },
      { value: "0", label: "Critical findings left open at retest" },
    ],
    outcome:
      "Operations leaders now hold documented manual fallbacks and a prioritised improvement plan tied to service impact.",
    services: [
      { title: "Network & Infrastructure VAPT", url: "/services/network-infrastructure-vapt" },
      { title: "ISO 22301 Business Continuity", url: "/services/iso-22301-business-continuity" },
    ],
  },
];

export type ResourceItem = {
  title: string;
  kind: "Checklist" | "Template" | "Guide" | "Tool";
  summary: string;
  to: string;
  cta: string;
};

export const resourceHub: ResourceItem[] = [
  {
    title: "Security Scorecard",
    kind: "Tool",
    summary: "Answer eight questions and get a maturity score with prioritised next steps for your environment.",
    to: "/security-scorecard",
    cta: "Start the scorecard",
  },
  {
    title: "Compliance Framework Explorer",
    kind: "Guide",
    summary: "Compare ISO 27001, SOC 2, PCI DSS, DPDPA, GDPR and sector frameworks with readiness checklists.",
    to: "/compliance-explorer",
    cta: "Compare frameworks",
  },
  {
    title: "Industry Risk Snapshots",
    kind: "Checklist",
    summary: "Sector-specific exposure rankings, obligations and the first 90 days of a right-sized engagement.",
    to: "/industries",
    cta: "View by industry",
  },
  {
    title: "Live Threat Map",
    kind: "Tool",
    summary: "Watch global attack telemetry in real time and use it to brief non-technical stakeholders.",
    to: "/threat-map",
    cta: "Open the map",
  },
];
