import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Newspaper } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { listCyberNews, type NewsPage } from "@/lib/cybernews.functions";
import { NewsCard } from "@/routes/cyber-news";

/** Homepage strip showing the three most recent Cyber News Global headlines. */
export function NewsStrip() {
  const fetchNews = useServerFn(listCyberNews);
  const { data } = useQuery<NewsPage>({
    queryKey: ["cyber-news", "home"],
    queryFn: () => fetchNews({ data: { page: 1, perPage: 3 } }),
    staleTime: 10 * 60 * 1000,
  });

  const items = data?.items ?? [];

  return (
    <section className="band-soft wash-soft py-16 sm:py-24">
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

        {items.length === 0 ? (
          <div className="mt-10 flex items-center gap-3 rounded-xl border border-border bg-background p-8 text-sm text-muted-foreground">
            <Newspaper className="size-5 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
            Loading the latest global headlines…
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <NewsCard item={item} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
