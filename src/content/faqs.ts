/** FAQ copy for high-intent service pages, rendered as accordions + FAQPage schema. */
export type Faq = { q: string; a: string };

export const serviceFaqs: Record<string, Faq[]> = {
  "iso-27001-implementation-certification-assistance": [
    {
      q: "How long does ISO 27001 certification typically take?",
      a: "For a mid-sized organisation, six to nine months from kick-off to stage 2 is realistic: roughly six weeks for gap assessment and scoping, three to four months to implement controls and produce evidence, then an internal audit, management review and the certification audit itself.",
    },
    {
      q: "What does the ISO 27001 scope include?",
      a: "Scope covers the products, services, locations, people and systems the ISMS protects. We help you define a scope that is defensible to an auditor and meaningful to your customers, without pulling in systems that add cost but no assurance value.",
    },
    {
      q: "Do you provide the certification audit itself?",
      a: "No. Certification must be issued by an accredited certification body, which cannot also consult on your implementation. We prepare you end to end, run the internal audit, help you shortlist certification bodies and support you through stage 1 and stage 2.",
    },
    {
      q: "What documentation is mandatory for ISO 27001:2022?",
      a: "The Statement of Applicability, risk assessment and treatment methodology and results, ISMS scope, information security policy and objectives, plus records of competence, monitoring, internal audit, management review and nonconformities. We deliver these as working documents, not templates.",
    },
    {
      q: "How much does ISO 27001 cost?",
      a: "Cost depends on scope, headcount, number of locations and how much control evidence already exists, plus separate certification-body fees. After a short scoping call we provide a fixed-fee proposal with clear phases and deliverables.",
    },
  ],
  "soc-2-compliance-assistance": [
    {
      q: "What is the difference between SOC 2 Type 1 and Type 2?",
      a: "Type 1 attests that controls are suitably designed at a point in time. Type 2 tests that they operated effectively across a period, usually three to twelve months. Enterprise buyers increasingly ask for Type 2, so many teams do Type 1 first and then run an observation window.",
    },
    {
      q: "Which Trust Services Criteria should we include?",
      a: "Security (the common criteria) is mandatory. Availability, Confidentiality, Processing Integrity and Privacy are optional and should be driven by customer commitments and contractual language, not added by default.",
    },
    {
      q: "How long does a SOC 2 readiness project take?",
      a: "Readiness usually runs eight to fourteen weeks depending on control maturity and tooling. The Type 2 observation window then adds three to twelve months before the CPA firm issues the report.",
    },
    {
      q: "Do we need a compliance automation platform?",
      a: "It helps with evidence collection but is not required. We work with your existing stack, and if you use a platform we configure the control mappings so evidence is auditor-ready rather than just green ticks on a dashboard.",
    },
    {
      q: "Can we reuse ISO 27001 work for SOC 2?",
      a: "Yes. A large share of the control set overlaps. We map existing ISO 27001 controls and evidence to the Trust Services Criteria so you only build what is genuinely missing.",
    },
  ],
  "pci-dss-compliance-assistance": [
    {
      q: "Which PCI DSS level applies to us?",
      a: "Your level depends on annual card transaction volume and your acquirer's requirements. We confirm the level, the correct SAQ type or ROC path, and the scope of the cardholder data environment before any remediation begins.",
    },
    {
      q: "How can we reduce PCI DSS scope?",
      a: "Through network segmentation, tokenisation, redirect or hosted payment pages, and removing stored card data. Scope reduction is usually the single biggest cost saver in a PCI programme.",
    },
    {
      q: "What changed in PCI DSS v4.0?",
      a: "Greater emphasis on continuous compliance, customised implementation of controls, stronger authentication requirements, and expanded scripting and phishing protections for e-commerce. We map your current posture against the v4.0 requirements and the future-dated ones.",
    },
  ],
  "vulnerability-assessment-penetration-testing": [
    {
      q: "What is the difference between a vulnerability assessment and a penetration test?",
      a: "A vulnerability assessment enumerates and prioritises known weaknesses at breadth. A penetration test manually validates exploitability, chains issues together and demonstrates real business impact. Most organisations need both on different cadences.",
    },
    {
      q: "How long does a VAPT engagement take?",
      a: "A typical web application or external network test runs five to ten working days of testing, plus reporting. Larger scopes, complex APIs or red-team style work take longer. Free retesting of fixed findings is included.",
    },
    {
      q: "Will testing disrupt our production systems?",
      a: "Testing is scoped with agreed rules of engagement, exclusion lists, rate limits and a named escalation contact. Denial-of-service testing is excluded unless explicitly requested in a non-production environment.",
    },
    {
      q: "Is your report accepted for CERT-In, ISO 27001 or SOC 2 evidence?",
      a: "Yes. Reports include methodology, scope, CVSS-rated findings with reproduction steps, business impact, remediation guidance and retest results — the format auditors and regulators expect.",
    },
  ],
  "web-application-penetration-testing": [
    {
      q: "What methodology do you follow?",
      a: "OWASP Web Security Testing Guide and OWASP Top 10, extended with business-logic, authorisation and multi-tenancy testing that automated scanners cannot cover.",
    },
    {
      q: "Do you need credentials and a test environment?",
      a: "Authenticated testing across each user role finds far more than unauthenticated scanning. We ask for role-based test accounts and, ideally, a staging environment that mirrors production.",
    },
    {
      q: "Is a retest included?",
      a: "Yes. Once you remediate, we retest the reported findings and issue an updated report and attestation letter you can share with customers or auditors.",
    },
  ],
  "dpdpa-readiness-implementation": [
    {
      q: "Who does India's DPDP Act apply to?",
      a: "Any organisation processing digital personal data in India, and processing outside India connected to offering goods or services to individuals in India. Obligations vary between Data Fiduciaries and Significant Data Fiduciaries.",
    },
    {
      q: "What are the first steps towards DPDPA readiness?",
      a: "Build a personal data inventory and processing map, then fix the fundamentals: notices, consent capture and withdrawal, purpose limitation, retention schedules, processor contracts and a rights-request workflow.",
    },
    {
      q: "Do we need to appoint a Data Protection Officer?",
      a: "A DPO is mandatory for Significant Data Fiduciaries and good practice for others. Our virtual DPO service gives you a named contact and operating cadence without a full-time hire.",
    },
  ],
  "gdpr-readiness-implementation": [
    {
      q: "Does GDPR apply to a company based outside the EU?",
      a: "Yes, if you offer goods or services to people in the EU or monitor their behaviour. You may also need an EU representative under Article 27.",
    },
    {
      q: "When is a DPIA required?",
      a: "When processing is likely to result in high risk — large-scale special category data, systematic monitoring, or automated decisions with legal effects. We run DPIAs and document the mitigation decisions.",
    },
    {
      q: "How do we handle international data transfers?",
      a: "Through Standard Contractual Clauses plus a transfer impact assessment, adequacy decisions where they exist, or binding corporate rules. We document the lawful basis and safeguards for each transfer route.",
    },
  ],
  "virtual-chief-information-security-officer-vciso": [
    {
      q: "What does a vCISO actually do day to day?",
      a: "Owns the security strategy and roadmap, runs the risk and governance cadence, prepares board and customer reporting, oversees audits and incidents, and directs internal or vendor delivery teams.",
    },
    {
      q: "How much time is included?",
      a: "Engagements are typically two to eight days a month, scaled to your risk profile, audit calendar and growth stage, with defined escalation cover between sessions.",
    },
    {
      q: "How is a vCISO different from hiring a consultant?",
      a: "A vCISO carries accountability for outcomes over time rather than delivering a one-off report — the same person shows up for your board, your auditors and your customers.",
    },
  ],
};

export function faqsFor(slug: string): Faq[] | undefined {
  const list = serviceFaqs[slug];
  return list && list.length ? list : undefined;
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Compliance FAQs shown on the homepage. Deliberately answers the ISO 27001 and
 * SOC 2 questions prospects ask on a first consultation call.
 */
export const homeFaqs: Faq[] = [
  {
    q: "How long does ISO 27001 certification take from a standing start?",
    a: "Six to nine months is realistic for a mid-sized organisation: about six weeks for scoping and gap assessment, three to four months to implement controls and generate evidence, then an internal audit, management review and the stage 1 and stage 2 certification audits. Teams with mature IT controls and a narrow scope have gone from kick-off to certificate in four months.",
  },
  {
    q: "Should we do ISO 27001 or SOC 2 first?",
    a: "Follow the buyer. North American enterprise customers usually ask for SOC 2; European, Indian and Middle East buyers, tenders and regulators tend to ask for ISO 27001. If both are on the roadmap, build the ISO 27001 management system first and map it to the Trust Services Criteria — more than half the control work is shared, so the second framework costs far less than the first.",
  },
  {
    q: "What is the difference between SOC 2 Type 1 and Type 2?",
    a: "Type 1 attests that your controls are suitably designed at a single point in time. Type 2 tests that they actually operated over a period, usually three to twelve months. Most enterprise procurement teams now expect Type 2, so a common path is Type 1 first, then an observation window that produces the Type 2 report.",
  },
  {
    q: "Do you issue the certificate or the SOC 2 report yourselves?",
    a: "No, and no consultancy legitimately can. ISO 27001 certificates come from an accredited certification body and SOC 2 reports from a licensed CPA firm, and neither may audit work they consulted on. We prepare you end to end, run the internal audit, help you shortlist and brief the auditor, and stay with you through the audit itself.",
  },
  {
    q: "What will ISO 27001 or SOC 2 cost us?",
    a: "Cost is driven by scope, headcount, number of locations or environments, and how much control evidence already exists — plus separate certification body or CPA fees. After a free 30-minute scoping call we issue a fixed-fee proposal with phases, deliverables and the smallest credible scope that still satisfies your customer or regulator.",
  },
  {
    q: "Can our existing tools and policies be reused?",
    a: "Almost always. We start from what you already run — identity, endpoint, logging, ticketing, HR onboarding — and turn those into evidence sources rather than replacing them. A compliance automation platform helps with collection but is never a prerequisite.",
  },
  {
    q: "What happens after certification?",
    a: "ISO 27001 has surveillance audits in years one and two and recertification in year three; SOC 2 Type 2 reports are typically refreshed annually. We hand over an operating calendar covering internal audits, management reviews, risk reviews, vendor reviews and evidence collection, and can run it as a managed service or a vCISO retainer.",
  },
];
