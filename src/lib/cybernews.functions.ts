import { createServerFn } from "@tanstack/react-start";
import type { NewsCategory, NewsPage } from "@/lib/cybernews.server";

export type { NewsItem, NewsCategory, NewsPage } from "@/lib/cybernews.server";

/** Public: paginated Cyber News Global headlines with optional search / category filter. */
export const listCyberNews = createServerFn({ method: "GET" })
  .inputValidator((input: { page?: number; search?: string; category?: number; perPage?: number } | undefined) => ({
    page: Math.min(Math.max(Number(input?.page ?? 1) || 1, 1), 65),
    perPage: Math.min(Math.max(Number(input?.perPage ?? 12) || 12, 1), 24),
    search: String(input?.search ?? "").slice(0, 120).trim() || undefined,
    category: input?.category ? Number(input.category) : undefined,
  }))
  .handler(async ({ data }): Promise<NewsPage> => {
    const { fetchNews } = await import("@/lib/cybernews.server");
    try {
      return await fetchNews(data);
    } catch {
      return { items: [], page: data.page, total: 0, totalPages: 0 };
    }
  });

/** Public: category facets used by the news filter bar. */
export const listCyberNewsCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<NewsCategory[]> => {
    const { fetchCategories } = await import("@/lib/cybernews.server");
    try {
      return await fetchCategories();
    } catch {
      return [];
    }
  },
);
