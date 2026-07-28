import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Send,
  Sparkles,
  Zap,
  ZapOff,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { submitLead } from "@/lib/crm.functions";
import { useMotionPref, prefersReducedMotion } from "@/lib/useMotionPref";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

/* ------------------------------------------------------------ motion UI */

function MotionToggle() {
  const { pref, setPref } = useMotionPref();
  const reduced = pref === "reduced";
  return (
    <button
      type="button"
      onClick={() => setPref(reduced ? "full" : "reduced")}
      aria-pressed={reduced}
      className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-foreground transition-transform duration-300 hover:-translate-y-0.5"
    >
      {reduced ? (
        <ZapOff className="size-4 text-coral-ink" aria-hidden="true" />
      ) : (
        <Zap className="size-4 text-coral-ink" aria-hidden="true" />
      )}
      {reduced ? "Motion off" : "Motion on"}
      <span className="sr-only">
        {reduced ? "Turn animations back on" : "Reduce animations across the site"}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------- CTA form */

function ApproachCta({ openStep }: { openStep: string | null }) {
  const send = useServerFn(submitLead);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const mutation = useMutation({
    mutationFn: () => send({ data: { ...form, source: "homepage-approach-panel" } }),
    onSuccess: () =>
      track("approach_cta_submit_success", { step: openStep ?? "none", company: form.company || "" }),
    onError: (error) =>
      track("approach_cta_submit_error", { message: (error as Error).message.slice(0, 120) }),
  });

  const field =
    "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(next) => {
        setSheetOpen(next);
        track(next ? "approach_cta_open" : "approach_cta_close", { step: openStep ?? "none" });
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          className="brand-gradient inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-md transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Plan my next step
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Plan your next step</SheetTitle>
          <SheetDescription>
            Tell us where you are today. We reply within one business day with a
            recommended scope, timeline and indicative effort.
          </SheetDescription>
        </SheetHeader>

        <ol className="mt-4 space-y-2 px-4 text-sm text-muted-foreground">
          <li>1. Share your goal or deadline below.</li>
          <li>2. We review and propose the right stage to start from.</li>
          <li>3. A 30-minute consultation confirms scope and next actions.</li>
        </ol>

        {mutation.isSuccess ? (
          <div className="m-4 flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <CheckCircle2 className="mt-0.5 size-5 text-coral-ink" aria-hidden="true" />
            <p>Thanks — your request is in. Our team will be in touch shortly.</p>
          </div>
        ) : (
          <form
            className="mt-4 space-y-3 px-4 pb-8"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="approach-name">
                Name
              </label>
              <input
                id="approach-name"
                required
                className={field}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="approach-email">
                Work email
              </label>
              <input
                id="approach-email"
                type="email"
                required
                className={field}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="approach-company">
                Company
              </label>
              <input
                id="approach-company"
                className={field}
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="approach-message">
                What do you need?
              </label>
              <textarea
                id="approach-message"
                required
                rows={4}
                className={field}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="e.g. SOC 2 readiness before a customer audit in June"
              />
            </div>
            {mutation.isError ? (
              <p role="alert" className="text-sm text-destructive">
                {(mutation.error as Error).message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="brand-gradient inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white disabled:opacity-70"
            >
              <Send className="size-4" aria-hidden="true" />
              {mutation.isPending ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
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
  const visibleSet = useMemo(() => new Set(visible), [visible]);

  /** Read `#approach-<slug>` on mount and on back/forward navigation. */
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash.startsWith("approach-")) return;
      const target = steps.find((s) => slug(s.title) === hash.slice("approach-".length));
      if (!target) return;
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
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ApproachCta openStep={open} />
        <MotionToggle />
        <p className="text-sm text-ink-muted">Select a stage to see what it includes.</p>
      </div>

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

