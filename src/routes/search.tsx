import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, FileText } from "lucide-react";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import { pageIndex, type PageMeta } from "@/content/site";

const searchParams = z.object({
  q: z.string().default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: (search) => searchParams.parse(search),
  component: SearchPage,
});

function score(page: PageMeta, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const name = page.name.toLowerCase();
  const title = (page.seoTitle ?? "").toLowerCase();
  const desc = (page.metaDescription ?? "").toLowerCase();
  const url = page.url.toLowerCase();

  if (name === q || title === q) return 100;
  if (name.startsWith(q)) return 80;
  if (title.includes(q)) return 70;
  if (name.includes(q)) return 60;
  if (desc.includes(q)) return 40;
  if (url.includes(q.replace(/\s+/g, "-"))) return 30;
  return 0;
}

function SearchPage() {
  const { q } = Route.useSearch();
  const query = q.trim();

  const results = query
    ? pageIndex
        .map((page) => ({ page, rank: score(page, query) }))
        .filter((r) => r.rank > 0)
        .sort((a, b) => b.rank - a.rank)
        .map((r) => r.page)
    : [];

  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search the site"}
        paragraphs={[
          "Find services, industries, frameworks and resources across Cybersentinels.",
        ]}
      />

      <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <form action="/search" method="GET" role="search" className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search services, frameworks, industries…"
            className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-14 text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-coral-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-ink/30"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        {query ? (
          <div className="mt-10">
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"} found
            </p>
            {results.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center">
                <p className="font-display text-lg font-semibold text-foreground">
                  No results for “{query}”
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a broader term like “ISO 27001”, “VAPT” or “cloud security”.
                </p>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {results.map((page) => (
                  <li key={page.url}>
                    <Link
                      to={page.url}
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-coral-ink/40 hover:bg-accent"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <FileText className="size-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-foreground group-hover:text-coral-ink">
                          {page.name}
                        </p>
                        {page.seoTitle && page.seoTitle !== page.name ? (
                          <p className="mt-0.5 text-sm text-muted-foreground">{page.seoTitle}</p>
                        ) : null}
                        {page.metaDescription ? (
                          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                            {page.metaDescription}
                          </p>
                        ) : null}
                        <p className="mt-2 truncate text-xs text-muted-foreground">{page.url}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
