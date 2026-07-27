import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Gauge, RotateCcw, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Compact 4-question maturity check that lives in the hero. It mirrors the
 * scoring bands of the full /security-scorecard tool but stays a 30-second
 * interaction, then hands the visitor off to the full assessment or a call.
 */

type Q = {
  id: string;
  domain: string;
  text: string;
  options: { label: string; score: number }[];
};

const questions: Q[] = [
  {
    id: "testing",
    domain: "Testing",
    text: "When were your internet-facing apps or networks last independently tested?",
    options: [
      { label: "Within 6 months", score: 3 },
      { label: "12–24 months ago", score: 2 },
      { label: "Longer / partial", score: 1 },
      { label: "Never", score: 0 },
    ],
  },
  {
    id: "identity",
    domain: "Identity",
    text: "Is MFA enforced for every user, including admins and contractors?",
    options: [
      { label: "Everywhere", score: 3 },
      { label: "Most users", score: 2 },
      { label: "Admins only", score: 1 },
      { label: "Not enforced", score: 0 },
    ],
  },
  {
    id: "assurance",
    domain: "Assurance",
    text: "Can you evidence a recognised framework (ISO 27001, SOC 2, PCI DSS)?",
    options: [
      { label: "Certified today", score: 3 },
      { label: "Working towards it", score: 2 },
      { label: "Considering it", score: 1 },
      { label: "Not started", score: 0 },
    ],
  },
  {
    id: "response",
    domain: "Response",
    text: "When did you last exercise your incident response and recovery plan?",
    options: [
      { label: "Last 12 months", score: 3 },
      { label: "Plan exists, untested", score: 2 },
      { label: "Informal only", score: 1 },
      { label: "No plan", score: 0 },
    ],
  },
];

const MAX = questions.length * 3;

function bandFor(pct: number) {
  if (pct >= 80)
    return {
      name: "Optimised",
      blurb: "Strong foundations — focus on assurance depth and continuous validation.",
    };
  if (pct >= 60)
    return {
      name: "Managed",
      blurb: "Controls work but coverage is uneven. Tighten evidence and close remaining gaps.",
    };
  if (pct >= 35)
    return {
      name: "Developing",
      blurb: "Key controls exist in places. Prioritise exposure reduction and governance.",
    };
  return {
    name: "Initial",
    blurb: "Material exposure is likely. Start with visibility, identity and external testing.",
  };
}

export function HeroScorecard({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const total = useMemo(
    () => questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0),
    [answers],
  );
  const done = step >= questions.length;
  const pct = Math.round((total / MAX) * 100);
  const band = bandFor(pct);
  const q = questions[Math.min(step, questions.length - 1)];

  const choose = (score: number) => {
    setAnswers((a) => ({ ...a, [q.id]: score }));
    setStep((s) => s + 1);
  };

  return (
    <section
      aria-label="Security maturity quick check"
      className={cn(
        "panel-glass card-lift mx-auto w-full max-w-xl rounded-2xl p-6 text-left sm:p-7",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="brand-gradient inline-flex size-8 items-center justify-center rounded-lg text-white">
          <Gauge className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div>
          <p className="type-eyebrow text-coral-ink">60-second check</p>
          <h2 className="type-h4 text-foreground">Security scorecard</h2>
        </div>
      </div>

      {!done ? (
        <>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {q.domain} · {step + 1} of {questions.length}
            </p>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-coral-ink"
              >
                <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" /> Back
              </button>
            )}
          </div>

          <div
            className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={step}
            aria-label="Question progress"
          >
            <div
              className="brand-gradient h-full rounded-full transition-[width] duration-500"
              style={{ width: `${(step / questions.length) * 100}%` }}
            />
          </div>

          <p className="mt-4 text-sm font-medium leading-relaxed text-foreground">{q.text}</p>

          <div className="mt-4 grid gap-2">
            {q.options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => choose(o.score)}
                className="group flex items-center justify-between rounded-lg border border-border bg-background/70 px-4 py-2.5 text-left text-sm text-foreground transition-all hover:border-coral-ink hover:bg-accent"
              >
                {o.label}
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-coral-ink"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div aria-live="polite">
          <div className="mt-5 flex items-end gap-3">
            <p className="brand-gradient-text font-display text-4xl font-bold leading-none">
              {pct}%
            </p>
            <p className="type-h4 pb-0.5 text-foreground">{band.name}</p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="brand-gradient h-full rounded-full transition-[width] duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{band.blurb}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to="/security-scorecard" className="btn-base btn-primary">
              <Sparkles className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Get the full 8-question report
            </Link>
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
              className="btn-base btn-quiet"
            >
              <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Restart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
