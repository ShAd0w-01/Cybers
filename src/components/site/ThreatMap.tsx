import { Radar, Globe2, ShieldAlert } from "lucide-react";
import { Reveal } from "./Reveal";
import { CtaLink } from "./CtaLink";

/**
 * Live global threat activity, embedded from the Kaspersky Cyberthreat
 * Real-Time Map widget. Lazy-loaded so it never blocks first paint.
 */
export function ThreatMap({ compact = false }: { compact?: boolean }) {
  return (
    <section className="ink-wash-grid relative overflow-hidden bg-ink py-16 text-ink-foreground sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.25fr]">
          <Reveal>
            <p className="type-eyebrow text-coral">Live threat intelligence</p>
            <h2 className="type-h2 mt-3 text-ink-foreground">
              Attacks don't wait for your next audit cycle
            </h2>
            <p className="type-body mt-4 text-ink-foreground/70">
              This is a live view of malware, web and network attacks detected around the world
              right now. Our testing and managed programmes are built for exactly this tempo —
              continuous, evidence-led and mapped to the frameworks your auditors expect.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: Globe2, text: "Threat activity across India, the UAE and global markets" },
                { icon: ShieldAlert, text: "Findings triaged by exploitability, not scanner score" },
                { icon: Radar, text: "Continuous VAPT and managed monitoring options" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <item.icon
                    className="mt-0.5 size-[18px] shrink-0 text-coral"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed text-ink-foreground/75">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            {!compact && (
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaLink to="/contact">Request an Assessment</CtaLink>
                <CtaLink to="/services" variant="ghost-dark">
                  Explore our services
                </CtaLink>
              </div>
            )}
          </Reveal>

          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl border border-white/12 bg-black/40 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-foreground/60">
                  <span className="size-2 animate-pulse rounded-full bg-coral" aria-hidden="true" />
                  Live cyberthreat map
                </span>
                <a
                  href="https://cybermap.kaspersky.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-ink-foreground/55 underline-offset-4 hover:text-coral hover:underline"
                >
                  Source: Kaspersky
                </a>
              </div>
              <iframe
                title="Kaspersky Cyberthreat Real-Time Map"
                src="https://cybermap.kaspersky.com/en/widget/dynamic/dark"
                loading="lazy"
                className="h-[320px] w-full border-0 sm:h-[420px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="mt-3 text-xs text-ink-foreground/50">
              Map data is provided by Kaspersky and is shown for situational awareness only.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
