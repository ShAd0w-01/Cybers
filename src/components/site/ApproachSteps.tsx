import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Send,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/useMotionPref";

export type ApproachStep = { title: string; body: string };

/** Extra reveal-on-expand detail per stage, keyed by stage name. */
const DETAIL: Record<string, { points: string[]; link: { label: string; to: string } }> = {
  PLAN: {
    points: [
      "Scoping workshop with business and technical stakeholders",
      "Applicable frameworks mapped (ISO 27001, SOC 2, DPDP, PCI DSS)",
      "Risk register and prioritised remediation roadmap",
    ],
    link: { label: "Explore compliance readiness", to: "/services/compliance" },
  },
  BUILD: {
    points: [
      "Policies, procedures and control documentation authored with you",
      "Technical hardening backlog with owners and due dates",
      "Evidence templates so audits stop being fire drills",
    ],
    link: { label: "See our services", to: "/services" },
  },
  OPERATE: {
    points: [
      "Day-to-day execution support for security and privacy tasks",
      "Vulnerability assessment and penetration testing cycles",
      "Incident readiness drills and response playbooks",
    ],
    link: { label: "View VAPT services", to: "/services/vapt" },
  },
  GOVERN: {
    points: [
      "Control performance tracked against measurable objectives",
      "Exception handling, risk acceptance and management reporting",
      "Continuous monitoring of evolving regulatory obligations",
    ],
    link: { label: "Read our insights", to: "/insights" },
  },
  SCALE: {
    points: [
      "Programme extended into new products, regions and cloud estates",
      "Customer security questionnaires answered faster",
      "Third-party and supply-chain risk brought into scope",
    ],
    link: { label: "Industries we serve", to: "/industries" },
  },
  TRANSFER: {
    points: [
      "Role-based training for engineering, product and leadership",
      "Runbooks and documentation handed to your internal owners",
      "Structured knowledge transfer so capability stays in-house",
    ],
    link: { label: "Talk to our team", to: "/contact" },
  },
};

/* --------------------------------------------------------------- reveal */

/**
 * One IntersectionObserver for the whole grid. Index bookkeeping happens in a
 * ref, and visible indices are flushed once per animation frame, so a section
 * scrolling into view costs a single re-render instead of one per card.
 */
function useStaggerReveal(count: number) {
  const [visible, setVisible] = useState<number[]>([]);
  const nodes = useRef<(HTMLElement | null)[]>([]);
  const pending = useRef<Set<number>>(new Set());
  const frame = useRef(0);

  // Ref callbacks are cached per index so memoised cards keep identical props
  // across renders (no detach/attach churn, no wasted re-renders).
  const refCache = useRef<Map<number, (el: HTMLElement | null) => void>>(new Map());
  const register = useCallback((i: number) => {
    let cb = refCache.current.get(i);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        nodes.current[i] = el;
      };
      refCache.current.set(i, cb);
    }
    return cb;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(Array.from({ length: count }, (_, i) => i));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = nodes.current.indexOf(entry.target as HTMLElement);
          if (i >= 0) pending.current.add(i);
          observer.unobserve(entry.target);
        }
        if (pending.current.size === 0 || frame.current) return;
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          const batch = Array.from(pending.current);
          pending.current.clear();
          setVisible((prev) => Array.from(new Set([...prev, ...batch])));
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    for (const node of nodes.current) if (node) observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [count]);

  return { register, visible };
}

/* ---------------------------------------------------------------- cards */

const slug = (title: string) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type CardProps = {
  step: ApproachStep;
  index: number;
  isOpen: boolean;
  shown: boolean;
  onToggle: (title: string) => void;
  registerRef: (el: HTMLElement | null) => void;
};

const StepCard = memo(function StepCard({
  step,
  index,
  isOpen,
  shown,
  onToggle,
  registerRef,
}: CardProps) {
  const detail = DETAIL[step.title.toUpperCase()];
  const id = slug(step.title);
  const panelId = `approach-panel-${id}`;
  const headingId = `approach-heading-${id}`;

  return (
    <li
      id={`approach-${id}`}
      ref={registerRef}
      style={{ transitionDelay: shown ? `${(index % 3) * 90}ms` : undefined }}
      className={cn(
        "group glass card-lift sheen relative overflow-hidden rounded-2xl transition-all duration-700 ease-out",
        shown
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-8 opacity-0 blur-[2px] will-change-transform",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "brand-gradient pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100",
          isOpen ? "scale-x-100" : "scale-x-0",
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-magenta)_28%,transparent),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
      />

      <button
        type="button"
        onClick={() => onToggle(step.title)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="relative w-full rounded-2xl p-6 text-left"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="brand-gradient grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
          >
            {index + 1}
          </span>
          <div className="h-px flex-1 bg-ink-border">
            <div
              className={cn(
                "brand-gradient h-px transition-[width] duration-700 ease-out",
                isOpen ? "w-full" : "w-0 group-hover:w-full",
              )}
            />
          </div>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 text-coral-ink transition-transform duration-500",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </div>
        <h3 id={headingId} className="mt-4 type-h4 transition-colors duration-300 group-hover:text-coral-ink">
          <span className="sr-only">{`Step ${index + 1}: `}</span>
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        hidden={!isOpen}
        className="relative grid px-6 pb-6"
      >
        {detail ? (
          <div className="animate-fade-in border-t border-ink-border pt-4">
            <ul className="space-y-2">
              {detail.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-ink-muted">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-coral-ink"
                    aria-hidden="true"
                  />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              to={detail.link.to}
              onClick={() => track("approach_step_link_click", { step: step.title, to: detail.link.to })}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-coral-ink transition-all hover:gap-3"
            >
              {detail.link.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </div>
    </li>
  );
});

export function ApproachSteps({ steps }: { steps: ApproachStep[] }) {
  const { register, visible } = useStaggerReveal(steps.length);
  const [open, setOpen] = useState<string | null>(null);
  const openRef = useRef<string | null>(null);
  const visibleSet = useMemo(() => new Set(visible), [visible]);

  /** Read `#approach-<slug>` on mount and on back/forward navigation. */
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash.startsWith("approach-")) return;
      const target = steps.find((s) => slug(s.title) === hash.slice("approach-".length));
      if (!target) return;
      openRef.current = target.title;
      setOpen(target.title);
      requestAnimationFrame(() => {
        const el = document.getElementById(`approach-${slug(target.title)}`);
        el?.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [steps]);

  const toggle = useCallback((title: string) => {
    // Side effects live outside the state updater: React may invoke updaters
    // twice (StrictMode / concurrent rendering) and events must fire once.
    const next = openRef.current === title ? null : title;
    openRef.current = next;
    setOpen(next);
    track(next ? "approach_step_expand" : "approach_step_collapse", { step: title });
    const url = new URL(window.location.href);
    url.hash = next ? `approach-${slug(title)}` : "";
    window.history.replaceState(
      window.history.state,
      "",
      next ? url.href : url.href.replace(/#$/, ""),
    );
  }, []);

  return (
    <div>
      <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <StepCard
            key={step.title}
            step={step}
            index={i}
            isOpen={open === step.title}
            shown={visibleSet.has(i)}
            onToggle={toggle}
            registerRef={register(i)}
          />
        ))}
      </ol>
    </div>
  );
}

