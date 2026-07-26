import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { CtaLink, routeForLabel } from "./CtaLink";
import type { Block, Section } from "@/content/site";
import { cn } from "@/lib/utils";

type Group = { title?: string; paragraphs: string[]; items: string[] };

/** Groups a section's flat block list into intro copy + h3-led groups. */
function analyze(section: Section) {
  const intro: string[] = [];
  const groups: Group[] = [];
  let buttons: string[] = [];
  let current: Group | null = null;

  for (const block of section.blocks as Block[]) {
    if (block.type === "h3") {
      current = { title: block.text, paragraphs: [], items: [] };
      groups.push(current);
    } else if (block.type === "p") {
      if (current) current.paragraphs.push(block.text);
      else intro.push(block.text);
    } else if (block.type === "ul") {
      if (current) current.items.push(...block.items);
      else groups.push({ paragraphs: [], items: block.items });
    } else if (block.type === "buttons") {
      buttons = block.items;
    } else if (block.type === "kv") {
      if (current) current.paragraphs.push(`${block.label}: ${block.value}`);
    }
  }
  return { intro, groups, buttons };
}

const numbered = (t?: string) => !!t && /^\d+\./.test(t.trim());

export function SectionRenderer({
  section,
  index,
  accentHeading = false,
}: {
  section: Section;
  index: number;
  accentHeading?: boolean;
}) {
  const { intro, groups, buttons } = analyze(section);
  const titled = groups.filter((g) => g.title);
  const bare = groups.filter((g) => !g.title);
  const isNumbered = titled.length > 2 && titled.every((g) => numbered(g.title));
  const tinted = index % 2 === 1;

  return (
    <section
      className={cn("border-b border-border py-16 sm:py-20", tinted ? "bg-surface" : "bg-background")}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <div className="brand-rule mb-5" />
            <h2
              className={cn(
                "type-h2",
                accentHeading && "brand-gradient-text",
              )}
            >
              {section.heading}
            </h2>
            {intro.map((p, i) => (
              <p key={i} className="mt-4 text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {bare.length > 0 ? (
          <Reveal delay={60}>
            <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {bare.flatMap((g) => g.items).map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-coral-ink" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {isNumbered ? (
          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {titled.map((g, i) => (
              <Reveal as="li" key={i} delay={i * 50} className="bg-background p-6">
                <span className="brand-gradient-text font-display text-2xl font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold">
                  {g.title!.replace(/^\d+\.\s*/, "")}
                </h3>
                {g.paragraphs.map((p, j) => (
                  <p key={j} className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </Reveal>
            ))}
          </ol>
        ) : titled.length > 0 ? (
          <div
            className={cn(
              "mt-12 grid gap-6",
              titled.length === 1
                ? "sm:grid-cols-1"
                : titled.length % 3 === 0
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2",
            )}
          >
            {titled.map((g, i) => (
              <Reveal
                as="article"
                key={i}
                delay={i * 50}
                className="group rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-coral/40 hover:shadow-xl hover:shadow-coral/5"
              >
                <h3 className="type-h4">{g.title}</h3>
                <div className="brand-rule mt-3 mb-4 w-6 transition-all duration-300 group-hover:w-12" />
                {g.paragraphs.map((p, j) => (
                  <p key={j} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
                {g.items.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {g.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-coral" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            ))}
          </div>
        ) : null}

        {buttons.length > 0 ? (
          <Reveal delay={80}>
            <div className="mt-10 flex flex-wrap gap-3">
              {buttons.map((b, i) => (
                <CtaLink key={b} to={routeForLabel(b)} variant={i === 0 ? "primary" : "outline"}>
                  {b}
                </CtaLink>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
