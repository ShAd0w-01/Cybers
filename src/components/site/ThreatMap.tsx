import { useState } from "react";
import { Radar, Globe2, ShieldAlert, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Doodle } from "./Doodle";
import { CtaLink } from "./CtaLink";
import { cn } from "@/lib/utils";

type MapSource = {
  id: string;
  label: string;
  vendor: string;
  href: string;
  src: string;
  description: string;
};

const sources: MapSource[] = [
  {
    id: "kaspersky",
    label: "Global malware activity",
    vendor: "Kaspersky",
    href: "https://cybermap.kaspersky.com/",
    src: "https://cybermap.kaspersky.com/en/widget/dynamic/dark",
    description:
      "Malware, web and email threat detections streamed from Kaspersky's global sensor network. Useful for seeing which countries are absorbing the heaviest endpoint and browser-borne attack volume right now.",
  },
  {
    id: "radware",
    label: "DDoS & application attacks",
    vendor: "Radware",
    href: "https://livethreatmap.radware.com/",
    src: "https://livethreatmap.radware.com/",
    description:
      "Radware's live map tracks DDoS, web application, intrusion and scanning activity observed across its cloud scrubbing centres — the closest public proxy for the availability attacks that take services offline.",
  },
];

/**
 * Live global threat activity, presented as a slider across multiple public
 * vendor feeds. Third-party iframes are only requested after an explicit
 * click, so they never compete with first paint.
 */
export function ThreatMap({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState<Record<string, boolean>>({});
  const active = sources[index]!;
  const isLive = Boolean(live[active.id]);

  const go = (delta: number) =>
    setIndex((i) => (i + delta + sources.length) % sources.length);

  return (
    <section className="wash-warm relative overflow-hidden py-16 text-ink-foreground sm:py-24">
      <Doodle variant="radar" opacity={0.85} />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.25fr]">
          <Reveal>
            <p className="type-eyebrow text-coral">Live threat intelligence</p>
            <h2 className="type-h2 mt-3 text-ink-foreground">
              Attacks don't wait for your next audit cycle
            </h2>
            <p className="type-body mt-4 text-ink-foreground/70">
              These are live views of malware, DDoS, web and network attacks detected around the
              world right now. Our testing and managed programmes are built for exactly this tempo —
              continuous, evidence-led and mapped to the frameworks your auditors expect.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: Globe2, text: "Threat activity across India and global markets" },
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
            <div className="overflow-hidden rounded-2xl border border-ink-border bg-ink-soft shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-ink-border px-4 py-2.5">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-foreground/60">
                  <span className="size-2 animate-pulse rounded-full bg-coral" aria-hidden="true" />
                  {active.label}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous threat map"
                    className="inline-flex size-7 items-center justify-center rounded-full border border-ink-border text-ink-foreground/70 transition-colors hover:border-coral hover:text-coral"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next threat map"
                    className="inline-flex size-7 items-center justify-center rounded-full border border-ink-border text-ink-foreground/70 transition-colors hover:border-coral hover:text-coral"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <div aria-live="polite">
                {isLive ? (
                  <iframe
                    key={active.id}
                    title={`${active.vendor} live threat map`}
                    src={active.src}
                    loading="lazy"
                    className="h-[320px] w-full border-0 sm:h-[420px]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setLive((s) => ({ ...s, [active.id]: true }))}
                    className="group flex h-[320px] w-full flex-col items-center justify-center gap-3 bg-ink-soft px-6 text-ink-foreground/70 transition-colors hover:text-ink-foreground sm:h-[420px]"
                  >
                    <span className="brand-gradient inline-flex size-12 items-center justify-center rounded-full text-white shadow-lg transition-transform group-hover:scale-110">
                      <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold">
                      Load the {active.vendor} live map
                    </span>
                    <span className="max-w-sm text-center text-xs text-ink-foreground/55">
                      Loads a third-party widget on demand, keeping this page fast.
                    </span>
                  </button>
                )}
              </div>

              <div className="border-t border-ink-border px-4 py-4">
                <p className="text-sm leading-relaxed text-ink-foreground/70">
                  {active.description}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {sources.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show ${s.vendor} map`}
                        aria-current={i === index}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          i === index
                            ? "w-6 bg-coral"
                            : "w-1.5 bg-ink-foreground/25 hover:bg-ink-foreground/50",
                        )}
                      />
                    ))}
                  </div>
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-ink-foreground/55 underline-offset-4 hover:text-coral hover:underline"
                  >
                    Source: {active.vendor}
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-foreground/50">
              Map data is provided by Kaspersky and Radware and is shown for situational awareness
              only.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
