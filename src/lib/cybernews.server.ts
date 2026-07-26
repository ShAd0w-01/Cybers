/**
 * Cyber News Global feed reader.
 *
 * Pulls headlines from the public WordPress REST API at cybernewsglobal.com,
 * normalises them into a small shape the UI can render, and caches responses
 * in-memory so repeated page views do not hammer the upstream site.
 */

const BASE = "https://cybernewsglobal.com/wp-json/wp/v2";
const TTL_MS = 10 * 60 * 1000;

export type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  link: string;
  date: string;
  author: string | null;
  image: string | null;
  categories: string[];
};

export type NewsCategory = { id: number; name: string; count: number };

export type NewsPage = {
  items: NewsItem[];
  page: number;
  totalPages: number;
  total: number;
};

type CacheEntry = { at: number; value: unknown };
const cache = new Map<string, CacheEntry>();

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  return value;
}

/** Decodes the HTML entities WordPress returns in rendered title/excerpt strings. */
function decode(html: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    hellip: "…",
    mdash: "—",
    ndash: "–",
    rsquo: "’",
    lsquo: "‘",
    ldquo: "“",
    rdquo: "”",
  };
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

type WpPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    author?: { name?: string }[];
    "wp:featuredmedia"?: { source_url?: string; media_details?: { sizes?: Record<string, { source_url?: string }> } }[];
    "wp:term"?: { taxonomy?: string; name?: string }[][];
  };
};

function normalise(post: WpPost): NewsItem {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const sized = media?.media_details?.sizes;
  const image =
    sized?.medium_large?.source_url ?? sized?.large?.source_url ?? media?.source_url ?? null;
  const terms = (post._embedded?.["wp:term"] ?? []).flat();
  return {
    id: post.id,
    title: decode(post.title?.rendered ?? ""),
    excerpt: decode(post.excerpt?.rendered ?? "").slice(0, 260),
    link: post.link,
    date: post.date,
    author: post._embedded?.author?.[0]?.name ?? null,
    image,
    categories: terms
      .filter((t) => t?.taxonomy === "category" && t.name)
      .map((t) => t.name as string),
  };
}

async function wpFetch(path: string): Promise<Response> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { accept: "application/json", "user-agent": "CyberSentinels-Website/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Cyber News Global request failed [${res.status}]: ${await res.text()}`);
  }
  return res;
}

export async function fetchNews(opts: {
  page: number;
  perPage: number;
  search?: string;
  category?: number;
}): Promise<NewsPage> {
  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(opts.perPage),
    page: String(opts.page),
    orderby: "date",
    order: "desc",
  });
  if (opts.search) params.set("search", opts.search);
  if (opts.category) params.set("categories", String(opts.category));

  const key = `posts:${params.toString()}`;
  return cached(key, async () => {
    const res = await wpFetch(`/posts?${params.toString()}`);
    const posts = (await res.json()) as WpPost[];
    return {
      items: posts.map(normalise),
      page: opts.page,
      total: Number(res.headers.get("x-wp-total") ?? posts.length),
      totalPages: Number(res.headers.get("x-wp-totalpages") ?? 1),
    } satisfies NewsPage;
  });
}

export async function fetchCategories(): Promise<NewsCategory[]> {
  return cached("categories", async () => {
    const res = await wpFetch("/categories?per_page=100&orderby=count&order=desc&hide_empty=1");
    const rows = (await res.json()) as { id: number; name: string; count: number }[];
    return rows
      .filter((r) => r.count > 0)
      .slice(0, 12)
      .map((r) => ({ id: r.id, name: decode(r.name), count: r.count }));
  });
}
