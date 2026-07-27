import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, Pause, Play } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { listCyberNews, type NewsPage } from "@/lib/cybernews.functions";
import { NewsCard } from "@/routes/cyber-news";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 340; // px — includes gap via scroll step
const SCROLL_STEP = CARD_WIDTH + 24; // card + gap
const SCROLL_SPEED = 0.55; // px per ms

/** Homepage strip showing the latest Cyber News Global headlines as an
 *  auto-scrolling, draggable, pause-on-hover ticker. */
export function NewsStrip() {
  const fetchNews = useServerFn(listCyberNews);
  const { data } = useQuery<NewsPage>({
    queryKey: ["cyber-news", "home"],
    queryFn: () => fetchNews({ data: { page: 1, perPage: 3 } }),
    staleTime: 10 * 60 * 1000,
  });

  const items = data?.items ?? [];
  const tickerItems = items.length ? [...items, ...items] : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-scroll loop; duplicated items make the jump back seamless.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion || isPaused || items.length === 0) return;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const delta = now - last;
      last = now;
      const half = el.scrollWidth / 2;
      let next = el.scrollLeft + SCROLL_SPEED * delta;
      if (next >= half) next -= half;
      el.scrollLeft = next;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, isPaused, items.length]);

  // Keep arrow button state in sync with scroll position.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [items.length]);

  const scrollBy = (dir: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    let target = el.scrollLeft + dir * SCROLL_STEP;
    if (target >= half) target -= half;
    if (target < 0) target += half;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className="band-soft wash-soft py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="brand-rule mb-5" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="type-eyebrow text-coral-ink">Global cyber news</p>
              <h2 className="type-h2 mt-3 max-w-2xl text-foreground">
                What is happening in cybersecurity right now
              </h2>
            </div>
            <Link
              to="/cyber-news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-coral-ink transition-all hover:gap-3"
            >
              Browse the full feed
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>

      {items.length === 0 ? (
        <div className="mx-auto mt-10 max-w-7xl px-5 lg:px-8">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-8 text-sm text-muted-foreground">
            <Newspaper className="size-5 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
            Loading the latest global headlines…
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="mx-auto mt-8 flex max-w-7xl items-center justify-end gap-2 px-5 lg:px-8">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-pressed={isPaused}
              aria-label={isPaused ? "Resume news ticker" : "Pause news ticker"}
              className="btn-glass inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isPaused ? (
                <Play className="size-4" strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Pause className="size-4" strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft && !reducedMotion}
              aria-label="Previous headline"
              className="btn-glass inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight && !reducedMotion}
              aria-label="Next headline"
              className="btn-glass inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          {/* Ticker */}
          <div
            ref={containerRef}
            className={cn(
              "ticker-fade mt-6 flex cursor-grab snap-x snap-mandatory overflow-x-auto scrollbar-hide",
              reducedMotion && "cursor-auto"
            )}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label="Latest cybersecurity headlines"
          >
            <div className="flex gap-6 px-5 lg:px-8">
              {tickerItems.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="w-[300px] flex-shrink-0 snap-start sm:w-[340px]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${(i % items.length) + 1} of ${items.length}`}
                >
                  <NewsCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
