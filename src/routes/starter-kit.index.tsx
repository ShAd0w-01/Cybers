import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  ListChecks,
  ShieldCheck,
  Gauge,
} from "lucide-react";

import { submitLead } from "@/lib/crm.functions";
import { AuroraBloom } from "@/components/site/AuroraBloom";
import { Reveal } from "@/components/site/Reveal";
import { IconTile } from "@/components/site/IconTile";
import { CtaLink } from "@/components/site/CtaLink";
import { STARTER_KIT_PDF, starterKitContents } from "@/content/starter-kit";

const title = "Security & Compliance Starter Kit (Free PDF) | Cybersentinels Consulting";
const description =
  "Download the free Security & Compliance Starter Kit: a 12-week readiness roadmap, ISO 27001:2022 documentation checklist, SOC 2 evidence matrix, GDPR and DPDPA checklists and nine board metrics.";

export const Route = createFileRoute("/starter-kit/")({
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
  component: StarterKit,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70";

const kitIcons = [ListChecks, FileText, ShieldCheck, Gauge];

function StarterKit() {
  const navigate = useNavigate();
  const send = useServerFn(submitLead);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "" });

  const mutation = useMutation({
    mutationFn: () =>
      send({
        data: {
          name: form.name,
          email: form.email,
          company: form.company,
          message: `Requested the Security & Compliance Starter Kit PDF.${
            form.role ? ` Role: ${form.role}.` : ""
          }`,
          service_interest: "Governance, Risk & Compliance",
          source: "starter-kit-lead-magnet",
        },
      }),
    onSuccess: () => navigate({ to: "/starter-kit/thank-you" }),
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <section className="wash-warm relative overflow-hidden py-16 text-foreground sm:py-20">
        <AuroraBloom intensity={0.55} blur={86} direction="left" grain={0.6} fade={68} />
        <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <nav aria-label="Breadcrumb" className="type-small text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Starter Kit</span>
            </nav>
            <p className="type-eyebrow mt-6 text-amber-ink">Free practitioner guide</p>
            <h1 className="mt-3 type-display">
              Security &amp; Compliance{" "}
              <span className="brand-gradient-text">Starter Kit</span>
            </h1>
            <p className="mt-5 max-w-xl type-lead text-muted-foreground">
              The same checklists we open on a first consultation call: a 12-week readiness roadmap,
              the ISO 27001:2022 mandatory documentation list, a SOC 2 evidence matrix, GDPR and
              DPDPA privacy checklists, and nine board metrics that survive scrutiny.
            </p>
            <ul className="mt-9 grid gap-5 sm:grid-cols-2">
              {starterKitContents.map((item, i) => (
                <li key={item.title}>
                  <IconTile icon={kitIcons[i] ?? ListChecks} size="sm" />
                  <h2 className="mt-4 type-h4">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80}>
            <form
              className="rounded-xl border border-border bg-background p-7 backdrop-blur-sm sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
            >
              <h2 className="type-h3">Where should we send it?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your details and the PDF downloads immediately on the next page. We never sell
                or share your data.
              </p>

              <div className="mt-6 space-y-4">
                <Field label="Full name" required>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={set("name")}
                    required
                    maxLength={120}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Work email" required>
                  <input
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={set("email")}
                    required
                    maxLength={255}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Company">
                  <input
                    className={inputClass}
                    value={form.company}
                    onChange={set("company")}
                    maxLength={160}
                    autoComplete="organization"
                  />
                </Field>
                <Field label="Your role">
                  <input
                    className={inputClass}
                    value={form.role}
                    onChange={set("role")}
                    maxLength={120}
                    placeholder="e.g. Head of IT, CTO, Compliance Lead"
                  />
                </Field>
              </div>

              {mutation.isError && (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  {(mutation.error as Error).message}
                </p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="brand-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 type-button text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
                {mutation.isPending ? "Preparing your kit…" : "Send me the Starter Kit"}
              </button>

              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <CheckCircle2
                  className="mt-0.5 size-3.5 shrink-0 text-amber-ink"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                No newsletter spam. We may follow up once to ask whether the kit was useful.
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="band-soft wash-quiet py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Prefer to talk it through? A free 30-minute consultation maps the kit to your scope,
            deadline and customer requirement.
          </p>
          <div className="flex flex-wrap gap-3">
            <CtaLink to="/contact">Book a consultation</CtaLink>
            <a
              href={STARTER_KIT_PDF}
              className="inline-flex items-center gap-2 text-sm font-semibold text-coral-ink hover:underline"
              download
            >
              Skip the form, just download
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        {required && <span className="text-amber-ink"> *</span>}
      </span>
      {children}
    </label>
  );
}
