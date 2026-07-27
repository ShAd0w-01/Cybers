import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, Filter, Gauge, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { IconTile } from "@/components/site/IconTile";
import { CtaLink } from "@/components/site/CtaLink";
import { frameworks, type Framework } from "@/content/tools-data";
import { cn } from "@/lib/utils";

const title = "Compliance Framework Explorer | Cybersentinels Consulting";
const description =
  "Compare ISO 27001, SOC 2, PCI DSS, DPDPA, GDPR, SEBI CSCRF and more — effort, timelines, audit route and a readiness checklist for each framework.";

export const Route = createFileRoute("/compliance-explorer")({
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
  component: ComplianceExplorer,
});

const categories = ["All", "Security", "Privacy", "Payments", "Resilience", "Sector"] as const;
const regions = ["All regions", "India", "UAE", "European Union", "United States", "Global"];

function ComplianceExplorer() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [region, setRegion] = useState(regions[0]);
  const [open, setOpen] = useState<string | null>(frameworks[0].code);

  const shown = useMemo(
    () =>
      frameworks.filter(
        (f) =>
          (category === "All" || f.category === category) &&
          (region === "All regions" || f.regions.includes(region)),
      ),
    [category, region],
  );

  return (
    <>
      <PageHero
        eyebrow="Resource"
        title="Compliance Framework Explorer"
        paragraphs={[
          "Filter the frameworks that matter to your market and sector, then see the effort, timeline, audit route and the practical steps to reach readiness.",
        ]}
        crumbs={[{ label: "Home", to: "/" }, { label: "Compliance Explorer" }]}
      />

      <section className="bg-background py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-5">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="size-4" strokeWidth={1.75} aria-hidden="true" /> Filter
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    category === c
                      ? "brand-gradient border-transparent text-white"
                      : "border-border text-muted-foreground hover:border-coral hover:text-coral-ink",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <span className="sr-only sm:not-sr-only">Region</span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </Reveal>

          <p className="mt-6 text-sm text-muted-foreground">
            Showing {shown.length} of {frameworks.length} frameworks.
          </p>

          <div className="mt-6 space-y-4">
            {shown.map((f, i) => (
              <Reveal key={f.code} delay={i * 40}>
                <FrameworkRow
                  framework={f}
                  open={open === f.code}
                  onToggle={() => setOpen(open === f.code ? null : f.code)}
                />
              </Reveal>
            ))}
            {shown.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No frameworks match that combination. Try a different region or category.
              </p>
            ) : null}
          </div>

          <Reveal className="mt-14 rounded-xl border border-border bg-surface p-8 text-center">
            <h2 className="type-h3 text-foreground">Not sure which one applies to you?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Share your market, customers and contractual commitments. We will map the frameworks
              that genuinely apply and sequence them so the work is done once.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CtaLink to="/contact">Discuss your compliance path</CtaLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FrameworkRow({
  framework: f,
  open,
  onToggle,
}: {
  framework: Framework;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `fw-${f.code.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div className="card-lift overflow-hidden rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 p-6 text-left"
      >
        <IconTile icon={ShieldCheck} />
        <span className="min-w-0 flex-1">
          <span className="type-h4 block text-foreground">{f.code}</span>
          <span className="mt-1 block text-sm text-muted-foreground">{f.name}</span>
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <Badge>{f.category}</Badge>
          <Badge>{f.effort} effort</Badge>
        </span>
        <span aria-hidden="true" className="text-coral-ink">
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div id={panelId} className="border-t border-border bg-surface p-6 sm:p-7">
          <p className="text-sm leading-relaxed text-foreground">{f.bestFor}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <Fact icon={CalendarClock} label="Typical timeline" value={f.timeline} />
            <Fact icon={Gauge} label="Assurance route" value={f.audit} />
            <Fact icon={ShieldCheck} label="Regions" value={f.regions.join(", ")} />
          </dl>
          <h3 className="type-h4 mt-7 text-foreground">Readiness checklist</h3>
          <ol className="mt-3 space-y-2.5">
            {f.checklist.map((c, i) => (
              <li key={c} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-display font-semibold text-coral-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c}
              </li>
            ))}
          </ol>
          <Link to={f.serviceUrl} className="mt-6 inline-block text-sm font-semibold text-coral-ink">
            See how we support {f.code} →
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
      {children}
    </span>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-sm text-foreground">{value}</dd>
    </div>
  );
}
