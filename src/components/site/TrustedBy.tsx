import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * "Trusted by" strip. The marks are anonymised placeholders (client names are
 * under NDA) styled as brand-consistent wordmark lockups.
 */
const clients = [
  { name: "Northbridge", mark: "NB", sector: "BFSI · India" },
  { name: "Averio Cloud", mark: "AC", sector: "SaaS · UAE" },
  { name: "Medira Health", mark: "MH", sector: "Healthcare · India" },
];

export function TrustedBy({ className }: { className?: string }) {
  return (
    <section aria-label="Trusted by" className={cn("relative", className)}>
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="panel-glass rounded-2xl px-6 py-6 sm:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Trusted by security and compliance teams
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
            {clients.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span
                  className="brand-gradient inline-flex size-10 items-center justify-center rounded-xl font-display text-sm font-bold tracking-tight text-white shadow-sm"
                  aria-hidden="true"
                >
                  {c.mark}
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-sm font-semibold text-foreground">
                    {c.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">{c.sector}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-amber-ink" strokeWidth={1.75} aria-hidden="true" />
            Client names anonymised where engagements are under NDA
          </p>
        </div>
      </div>
    </section>
  );
}
