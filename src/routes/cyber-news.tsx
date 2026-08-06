import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Newspaper,
  Search,
  UserRound,
} from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import {
  listCyberNews,
  listCyberNewsCategories,
  type NewsCategory,
  type NewsItem,
  type NewsPage,
} from "@/lib/cybernews.functions";
import { cn } from "@/lib/utils";

type Search = { page: number; q: string; cat: number | undefined };

export const Route = createFileRoute("/cyber-news")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    page: Math.min(Math.max(Number(search.page ?? 1) || 1, 1), 65),
    q: typeof search.q === "string" ? search.q.slice(0, 120) : "",
    cat: search.cat ? Number(search.cat) || undefined : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({
    deps,
  }): Promise<{ news: NewsPage; categories: NewsCategory[] }> => {
    const [news, categories] = await Promise.all([
      listCyberNews({ data: { page: deps.page, search: deps.q, category: deps.cat } }),
      listCyberNewsCategories(),
    ]);
    return { news, categories };
  },
  head: () => ({
    meta: [
      { title: "Global Cyber News Feed | CyberSentinels Consulting" },
      {
        name: "description",
        content:
          "Live cybersecurity headlines from Cyber News Global — breaches, threat intelligence, regulation and industry news, searchable by topic.",
      },
      { property: "og:title", content: "Global Cyber News Feed | CyberSentinels Consulting" },
      {
        property: "og:description",
        content:
          "Searchable stream of global cybersecurity headlines, curated alongside CyberSentinels advisory services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CyberNewsPage,
});

function CyberNewsPage() {
  const { news, categories } = Route.useLoaderData() as {
    news: NewsPage;
    categories: NewsCategory[];
  };
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [term, setTerm] = useState(search.q);

  const apply = (next: Partial<Search>) =>
    navigate({ search: (prev: Search) => ({ ...prev, page: 1, ...next }) });

  return (
    <>
      <PageHero
        eyebrow="Threat intelligence"
        title="Global cyber news, updated continuously"
        paragraphs={[
          "Headlines syndicated from Cyber News Global — breaches, ransomware campaigns, regulatory moves and industry briefings from around the world.",
          "Search the archive or filter by topic, then talk to us about what any of it means for your own control environment.",
        ]}
        crumbs={[{ label: "Home", to: "/" }, { label: "Cyber News" }]}
      />

      <section className="bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="card-lift flex flex-col gap-4 rounded-xl border border-border bg-background p-5 lg:flex-row lg:items-center lg:justify-between">
            <form
              className="flex w-full max-w-md items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                apply({ q: term.trim() });
              }}
            >
              <label htmlFor="news-search" className="sr-only">
                Search cyber news
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <input
                  id="news-search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search ransomware, DPDPA, ISO 27001…"
                  className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-coral"
                />
              </div>
              <button
                type="submit"
                className="brand-gradient rounded-md px-4 py-2.5 type-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              >
                Search
              </button>
            </form>

            <p className="type-small text-muted-foreground">
              {news.total > 0
                ? `${news.total} article${news.total === 1 ? "" : "s"} · page ${news.page} of ${news.totalPages}`
                : "Live feed"}
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <FilterChip active={!search.cat} onClick={() => apply({ cat: undefined })}>
                All topics
              </FilterChip>
              {categories.map((c: NewsCategory) => (
                <FilterChip
                  key={c.id}
                  active={search.cat === c.id}
                  onClick={() => apply({ cat: c.id })}
                >
                  {c.name}
                </FilterChip>
              ))}
            </div>
          ) : null}

          {news.items.length === 0 ? (
            <div className="mt-10 rounded-xl border border-border bg-background p-10 text-center">
              <Newspaper
                className="mx-auto size-6 text-coral-ink"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <p className="type-body mt-4 text-muted-foreground">
                No headlines matched that search right now. Try a different term, or read our own{" "}
                <Link
                  to="/blog"
                  className="font-medium text-coral-ink underline underline-offset-4"
                >
                  consulting blog
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.items.map((item: NewsItem, i: number) => (
                <Reveal key={item.id} delay={i * 40}>
                  <NewsCard item={item} />
                </Reveal>
              ))}
            </div>
          )}

          {news.totalPages > 1 ? (
            <nav
              className="mt-12 flex items-center justify-center gap-3"
              aria-label="News pagination"
            >
              <PagerLink
                disabled={news.page <= 1}
                to={{ page: news.page - 1 }}
                label="Previous"
                icon={<ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />}
              />
              <span className="type-small text-muted-foreground">
                Page {news.page} / {news.totalPages}
              </span>
              <PagerLink
                disabled={news.page >= news.totalPages}
                to={{ page: news.page + 1 }}
                label="Next"
                icon={<ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />}
                trailing
              />
            </nav>
          ) : null}

          <p className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            Headlines and summaries are syndicated from{" "}
            <a
              href="https://cybernewsglobal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-coral-ink underline underline-offset-4"
            >
              cybernewsglobal.com
            </a>
            . Full articles open on the publisher's site.
          </p>
        </div>
      </section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5",
        active
          ? "border-coral bg-coral/10 text-coral-ink"
          : "border-border bg-background text-muted-foreground hover:border-coral/50 hover:text-coral-ink",
      )}
    >
      {children}
    </button>
  );
}

function PagerLink({
  disabled,
  to,
  label,
  icon,
  trailing,
}: {
  disabled: boolean;
  to: { page: number };
  label: string;
  icon: React.ReactNode;
  trailing?: boolean;
}) {
  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground/50">
        {!trailing && icon}
        {label}
        {trailing && icon}
      </span>
    );
  }
  return (
    <Link
      to="/cyber-news"
      search={(prev) => ({ ...prev, ...to }) as Search}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-coral hover:text-coral-ink"
    >
      {!trailing && icon}
      {label}
      {trailing && icon}
    </Link>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-lift sheen flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background"
    >
      {item.image ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="brand-gradient h-1.5 w-full" aria-hidden="true" />
      )}
      <div className="flex flex-1 flex-col p-6">
        {item.categories[0] ? (
          <span className="type-eyebrow text-coral-ink">{item.categories[0]}</span>
        ) : null}
        <h2 className="type-h4 mt-3 text-foreground transition-colors group-hover:text-coral-ink">
          {item.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {new Date(item.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {item.author ? (
            <span className="flex items-center gap-1.5">
              <UserRound className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {item.author}
            </span>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-coral-ink transition-all group-hover:gap-2">
            Read <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          </span>
        </div>
      </div>
    </a>
  );
}
