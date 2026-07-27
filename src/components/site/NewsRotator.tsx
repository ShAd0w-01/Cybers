import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { listCyberNews, type NewsItem } from "@/lib/cybernews.functions";
import { GradientPanel } from "@/components/site/GradientPanel";
import { CtaLink } from "@/components/site/CtaLink";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6500;

/** True when the visitor asked the OS to limit animation. */
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Three latest cyber-security headlines that crossfade automatically,
 * with accessible play/pause, previous/next and keyboard navigation.
 */
export function NewsRotator() {
  const fetchNews = useServerFn(listCyberNews);
  const { data } = useQuery({
    queryKey: ["home-news"],
    queryFn: () => fetchNews({ data: { page: 1, perPage: 3 } }),
    staleTime: 10 * 60 * 1000,
  });

  const items: NewsItem[] = (data?.items ?? []).slice(0, 3);
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [paused, setPaused] = React.useState(false);

  const count = items.length;
  const running = playing && !paused && !reduced && count > 1;

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [running, count]);

  const go = React.useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + count) % count),
    [count],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  if (!count) return null;

  return (
    <section className="band-soft wash-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="brand-rule mb-5" />
              <p className="type-eyebrow text-coral-ink">Threat intelligence</p>
              <h2 className="mt-3 type-h2">Latest in cyber security</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Headlines our analysts are tracking this week, refreshed from the global
                cyber-security newsroom.
              </p>
            </div>
            <CtaLink to="/cyber-news" variant="ghost">
              Browse all news
            </CtaLink>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label="Latest cyber security headlines"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="relative">
              {/* Sizing ghost keeps the crossfade stack from collapsing. */}
              <div className="invisible" aria-hidden="true">
                <NewsCard item={items[tallest(items)]} />
              </div>

              {items.map((item, i) => (
                <div
                  key={item.id}
                  aria-hidden={i !== active}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none",
                    i === active
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                >
                  <NewsCard item={item} live={i === active} />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ControlButton label="Previous headline" onClick={() => go(-1)}>
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </ControlButton>
                <ControlButton
                  label={playing ? "Pause headline rotation" : "Play headline rotation"}
                  onClick={() => setPlaying((p) => !p)}
                  aria-pressed={!playing}
                >
                  {playing ? (
                    <Pause className="size-4" aria-hidden="true" />
                  ) : (
                    <Play className="size-4" aria-hidden="true" />
                  )}
                </ControlButton>
                <ControlButton label="Next headline" onClick={() => go(1)}>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </ControlButton>
              </div>

              <div className="flex items-center gap-2">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show headline ${i + 1} of ${count}`}
                    aria-current={i === active}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none",
                      i === active ? "w-7 bg-coral-ink" : "w-2.5 bg-border hover:bg-foreground/40",
                    )}
                  />
                ))}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              Headline {active + 1} of {count}: {items[active]?.title}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Index of the item with the longest text so the ghost card reserves enough height. */
function tallest(items: NewsItem[]) {
  let best = 0;
  items.forEach((item, i) => {
    if ((item.title + item.excerpt).length > (items[best].title + items[best].excerpt).length) {
      best = i;
    }
  });
  return best;
}

function NewsCard({ item, live = false }: { item: NewsItem; live?: boolean }) {
  return (
    <GradientPanel
      tone="soft"
      interactive={live}
      className="flex h-full flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center"
    >
      {item.image ? (
        <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl lg:aspect-[4/3] lg:w-64">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {item.categories[0] ? (
            <span className="text-coral-ink">{item.categories[0]}</span>
          ) : null}
          <span>{formatDate(item.date)}</span>
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {item.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={live ? 0 : -1}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read the story
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <Link
            to="/cyber-news"
            tabIndex={live ? 0 : -1}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            More headlines
          </Link>
        </div>
      </div>
    </GradientPanel>
  );
}

function ControlButton({
  label,
  onClick,
  children,
  ...rest
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
      {...rest}
    >
      {children}
    </button>
  );
}
