import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaLink } from "@/components/site/CtaLink";
import { submitLead } from "@/lib/crm.functions";
import { cn } from "@/lib/utils";

const title = "Free Security Scorecard | Cybersentinels Consulting";
const description =
  "Answer eight questions to score your security and compliance maturity, see where you are exposed and get prioritised next steps from Cybersentinels.";

export const Route = createFileRoute("/security-scorecard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scorecard,
});

type Question = {
  id: string;
  domain: string;
  text: string;
  options: { label: string; score: number }[];
  gapAction: string;
};

const questions: Question[] = [
  {
    id: "testing",
    domain: "Technical testing",
    text: "When were your public applications, APIs or networks last independently tested?",
    options: [
      { label: "Within the last 6 months", score: 3 },
      { label: "Within the last 12–24 months", score: 2 },
      { label: "Longer ago, or only partially", score: 1 },
      { label: "Never", score: 0 },
    ],
    gapAction: "Run a scoped VAPT across internet-facing applications, APIs and infrastructure.",
  },
  {
    id: "identity",
    domain: "Identity & access",
    text: "Is multi-factor authentication enforced for every user, including admins and contractors?",
    options: [
      { label: "Everywhere, with conditional access", score: 3 },
      { label: "For most users", score: 2 },
      { label: "For admins only", score: 1 },
      { label: "Not enforced", score: 0 },
    ],
    gapAction: "Close identity gaps: enforce MFA everywhere, review privileged and guest accounts.",
  },
  {
    id: "cloud",
    domain: "Cloud & infrastructure",
    text: "How is your cloud configuration reviewed against a hardening baseline?",
    options: [
      { label: "Continuously, with drift alerts", score: 3 },
      { label: "Reviewed periodically", score: 2 },
      { label: "Only at initial setup", score: 1 },
      { label: "No baseline exists", score: 0 },
    ],
    gapAction: "Complete a cloud security assessment covering IAM, logging, secrets and exposure.",
  },
  {
    id: "governance",
    domain: "Governance",
    text: "Do you maintain a documented risk register with named owners?",
    options: [
      { label: "Yes, reviewed at least quarterly", score: 3 },
      { label: "Yes, but rarely reviewed", score: 2 },
      { label: "Informal or partial", score: 1 },
      { label: "No", score: 0 },
    ],
    gapAction:
      "Establish a governance baseline: risk register, control ownership and review cadence.",
  },
  {
    id: "compliance",
    domain: "Assurance",
    text: "Can you evidence a recognised framework (ISO 27001, SOC 2, PCI DSS or equivalent)?",
    options: [
      { label: "Certified or attested today", score: 3 },
      { label: "Actively working towards it", score: 2 },
      { label: "Considering it, nothing started", score: 1 },
      { label: "Not on the roadmap yet", score: 0 },
    ],
    gapAction: "Select the right framework and build an evidence baseline before the audit window.",
  },
  {
    id: "privacy",
    domain: "Privacy",
    text: "Do you know what personal data you hold, where it lives and how long you keep it?",
    options: [
      { label: "Documented inventory kept current", score: 3 },
      { label: "Partially mapped", score: 2 },
      { label: "Only for major systems", score: 1 },
      { label: "Not mapped", score: 0 },
    ],
    gapAction:
      "Build a personal data inventory and align notices, rights and retention with DPDPA or GDPR.",
  },
  {
    id: "vendors",
    domain: "Third-party risk",
    text: "Are critical vendors risk-tiered and assessed before and during the relationship?",
    options: [
      { label: "Tiered with recurring assessment", score: 3 },
      { label: "Assessed at onboarding only", score: 2 },
      { label: "Ad hoc", score: 1 },
      { label: "No process", score: 0 },
    ],
    gapAction: "Tier critical providers and collect assurance evidence on a defined cycle.",
  },
  {
    id: "incident",
    domain: "Response & recovery",
    text: "When did you last test your incident response and recovery plan?",
    options: [
      { label: "Exercised in the last 12 months", score: 3 },
      { label: "Plan exists, never exercised", score: 2 },
      { label: "Informal understanding only", score: 1 },
      { label: "No plan", score: 0 },
    ],
    gapAction: "Run a tabletop exercise and validate recovery objectives for critical services.",
  },
];

const MAX = questions.length * 3;

function bandFor(pct: number) {
  if (pct >= 80)
    return {
      name: "Optimised",
      blurb:
        "Strong foundations. Focus on assurance depth, automation and continuous validation.",
    };
  if (pct >= 60)
    return {
      name: "Managed",
      blurb:
        "Controls are working but coverage is uneven. Tighten evidence and close the remaining gaps.",
    };
  if (pct >= 35)
    return {
      name: "Developing",
      blurb:
        "Key controls exist in places. Prioritise exposure reduction and a governance baseline.",
    };
  return {
    name: "Initial",
    blurb:
      "Material exposure is likely. Start with visibility, identity and internet-facing testing.",
  };
}

const inputClass =
  "rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70";

function Scorecard() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", company: "" });
  const send = useServerFn(submitLead);

  const answeredCount = Object.keys(answers).length;
  const total = useMemo(
    () => questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0),
    [answers],
  );
  const pct = Math.round((total / MAX) * 100);
  const band = bandFor(pct);
  const gaps = questions.filter((q) => (answers[q.id] ?? 0) <= 1);

  const mutation = useMutation({
    mutationFn: () => {
      const summary = questions
        .map(
          (q) => `${q.domain}: ${q.options.find((o) => o.score === answers[q.id])?.label ?? "—"}`,
        )
        .join("\n");
      return send({
        data: {
          name: lead.name,
          email: lead.email,
          company: lead.company,
          service_interest: "Security scorecard",
          source: "security-scorecard",
          message: `Security scorecard result: ${pct}% (${band.name}).\n\n${summary}`,
        },
      });
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Free tool"
        title="Security & Compliance Scorecard"
        paragraphs={[
          "Eight questions, about two minutes. You get an instant maturity score, the domains where you are most exposed, and the actions we would prioritise first.",
        ]}
        crumbs={[{ label: "Home", to: "/" }, { label: "Security Scorecard" }]}
      />

      <section className="bg-background py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          {!submitted ? (
            <>
              <div className="sticky top-18 z-10 -mx-5 mb-8 bg-background/92 px-5 py-4 backdrop-blur-md">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {answeredCount} of {questions.length} answered
                  </span>
                  <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
                </div>
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface"
                  role="progressbar"
                  aria-valuenow={answeredCount}
                  aria-valuemin={0}
                  aria-valuemax={questions.length}
                  aria-label="Scorecard progress"
                >
                  <div
                    className="brand-gradient h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <ol className="space-y-6">
                {questions.map((q, i) => (
                  <Reveal
                    key={q.id}
                    as="li"
                    delay={i * 30}
                    className="rounded-xl border border-border bg-background p-6 sm:p-7"
                  >
                    <p className="type-eyebrow text-coral-ink">{q.domain}</p>
                    <h2 className="type-h4 mt-2 text-foreground">
                      {i + 1}. {q.text}
                    </h2>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {q.options.map((o) => {
                        const active = answers[q.id] === o.score;
                        return (
                          <button
                            key={o.label}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.score }))}
                            className={cn(
                              "rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200",
                              active
                                ? "border-coral bg-surface font-semibold text-coral-ink"
                                : "border-border text-muted-foreground hover:-translate-y-0.5 hover:border-coral/60 hover:text-foreground",
                            )}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </Reveal>
                ))}
              </ol>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  disabled={answeredCount < questions.length}
                  onClick={() => setSubmitted(true)}
                  className="brand-gradient type-button inline-flex items-center gap-2 rounded-md px-6 py-3 text-white transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  See my score
                </button>
                <p className="text-sm text-muted-foreground">
                  {answeredCount < questions.length
                    ? `Answer ${questions.length - answeredCount} more question${
                        questions.length - answeredCount === 1 ? "" : "s"
                      } to unlock your score.`
                    : "No email required to view your result."}
                </p>
              </div>
            </>
          ) : (
            <div>
              <Reveal className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="type-eyebrow text-coral-ink">Your result</p>
                <p className="brand-gradient-text mt-3 font-display text-6xl font-semibold">
                  {pct}%
                </p>
                <h2 className="type-h3 mt-2 text-foreground">{band.name}</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {band.blurb}
                </p>
                <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-background">
                  <div className="brand-gradient h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </Reveal>

              <Reveal delay={80} className="mt-8 rounded-xl border border-border bg-background p-7">
                <h3 className="type-h4 text-foreground">Domain breakdown</h3>
                <ul className="mt-5 space-y-4">
                  {questions.map((q) => {
                    const score = answers[q.id] ?? 0;
                    return (
                      <li key={q.id}>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-sm font-semibold text-foreground">{q.domain}</span>
                          <span className="text-xs text-muted-foreground">{score}/3</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                          <div
                            className="brand-gradient h-full rounded-full"
                            style={{ width: `${(score / 3) * 100}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              {gaps.length > 0 ? (
                <Reveal
                  delay={120}
                  className="mt-8 rounded-xl border border-border bg-background p-7"
                >
                  <h3 className="type-h4 text-foreground">What we would prioritise first</h3>
                  <ol className="mt-4 space-y-3">
                    {gaps.map((g, i) => (
                      <li
                        key={g.id}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="font-display font-semibold text-coral-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <strong className="text-foreground">{g.domain}.</strong> {g.gapAction}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              ) : null}

              <Reveal delay={160} className="mt-8 rounded-xl border border-border bg-surface p-7">
                {mutation.isSuccess ? (
                  <div className="text-center">
                    <CheckCircle2
                      className="mx-auto size-8 text-coral-ink"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <h3 className="type-h4 mt-4 text-foreground">Your result is with our team</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      A consultant will follow up within one business day with a suggested scope.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      mutation.mutate();
                    }}
                  >
                    <h3 className="type-h4 text-foreground">Want this reviewed by a consultant?</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Send us your result and we will come back with a right-sized plan. Free
                      30-minute scoping call, no obligation.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <input
                        className={inputClass}
                        placeholder="Full name"
                        aria-label="Full name"
                        required
                        maxLength={120}
                        value={lead.name}
                        onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                      />
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="Work email"
                        aria-label="Work email"
                        required
                        maxLength={255}
                        value={lead.email}
                        onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                      />
                      <input
                        className={inputClass}
                        placeholder="Company"
                        aria-label="Company"
                        maxLength={160}
                        value={lead.company}
                        onChange={(e) => setLead((l) => ({ ...l, company: e.target.value }))}
                      />
                    </div>
                    {mutation.isError ? (
                      <p className="mt-3 text-sm text-coral-ink">
                        {(mutation.error as Error).message}
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="brand-gradient type-button inline-flex items-center gap-2 rounded-md px-6 py-3 text-white transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                      >
                        {mutation.isPending ? "Sending…" : "Send my result"}
                      </button>
                      <CtaLink to="/contact" variant="outline">
                        Book a consultation
                      </CtaLink>
                    </div>
                  </form>
                )}
              </Reveal>

              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-coral-ink"
              >
                <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Retake the scorecard
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
