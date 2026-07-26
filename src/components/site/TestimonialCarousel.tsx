import { useCallback, useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  author: string;
  detail: string;
  rating: number;
  /** Short anonymised client wordmark shown as the logo lockup. */
  logo: string;
  logoNote: string;
};

/** Renders the client logo lockup: a brand-gradient monogram plus wordmark. */
function ClientLogo({ logo, note }: { logo: string; note: string }) {
  const initials = logo
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex items-center gap-3">
      <span
        className="brand-gradient grid size-9 shrink-0 place-items-center rounded-md text-[13px] font-bold tracking-tight text-white"
        aria-hidden="true"
      >
        {initials}
      </span>
      <span>
        <span className="block font-display text-sm font-semibold leading-tight">{logo}</span>
        <span className="block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {note}
        </span>
      </span>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i <= rating ? "fill-amber text-amber" : "text-border",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => api.scrollNext(), 6000);
    return () => window.clearInterval(id);
  }, [api, paused]);

  const scrollTo = useCallback((i: number) => api?.scrollTo(i), [api]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="[&_[data-slot=carousel-content]]:overflow-visible"
      >
        <CarouselContent className="-ml-6">
          {items.map((t) => (
            <CarouselItem key={t.author + t.detail} className="pl-6 md:basis-1/2 lg:basis-1/3">
              <article className="flex h-full flex-col rounded-xl border border-border bg-background p-7 transition-colors duration-300 hover:border-coral/40">
                <div className="flex items-start justify-between gap-4">
                  <Stars rating={t.rating} />
                  <Quote className="size-6 shrink-0 text-coral" aria-hidden="true" />
                </div>
                <blockquote className="mt-5 text-sm leading-relaxed text-foreground">
                  “{t.quote}”
                </blockquote>
                <div className="mt-auto pt-6">
                  <ClientLogo logo={t.logo} note={t.logoNote} />
                  <div className="brand-rule my-4 w-8" />
                  <p className="font-display text-sm font-semibold">{t.author}</p>
                  <p className="text-[13px] text-muted-foreground">{t.detail}</p>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {items.map((t, i) => (
            <button
              key={t.author + t.detail}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={selected === i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                selected === i ? "brand-gradient w-8" : "w-3 bg-border hover:bg-coral/40",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label="Previous testimonial"
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-coral hover:text-coral"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label="Next testimonial"
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-coral hover:text-coral"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
