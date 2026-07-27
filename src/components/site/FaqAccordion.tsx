import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

import { CtaLink } from "@/components/site/CtaLink";
import { Reveal } from "@/components/site/Reveal";
import type { Faq } from "@/content/faqs";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  faqs,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
}: {
  faqs: Faq[];
  title?: string;
  eyebrow?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="band-soft wash-quiet py-16 sm:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <Reveal>
          <div className="brand-rule mb-5" />
          <p className="type-eyebrow text-coral-ink">{eyebrow}</p>
          <h2 id="faq-heading" className="mt-3 type-h2">
            {title}
          </h2>
        </Reveal>

        <div className="mt-9 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <div
                  className={cn(
                    "overflow-hidden rounded-xl border border-border bg-background transition-colors",
                    isOpen && "border-coral-ink/50",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                    >
                      <span className="type-h4 text-foreground">{f.q}</span>
                      <ChevronDown
                        className={cn(
                          "size-5 shrink-0 text-coral-ink transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    hidden={!isOpen}
                    className="px-5 pb-5 sm:px-6"
                  >
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-9 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-6">
          <MessageCircleQuestion
            className="size-5 text-amber-ink"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <p className="flex-1 text-sm text-muted-foreground">
            Still have a question? Ask us on a free 30-minute scoping call.
          </p>
          <CtaLink to="/contact">Book a Consultation</CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
