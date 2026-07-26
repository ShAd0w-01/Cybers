import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  tags: string[];
  author: string;
  read_minutes: number;
  status: string;
  published_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  updated_at: string;
};

const LIST_COLUMNS =
  "id, slug, title, excerpt, cover_image_url, tags, author, read_minutes, status, published_at, updated_at";
const FULL_COLUMNS = `${LIST_COLUMNS}, body, seo_title, meta_description`;

export type BlogPostCard = Omit<BlogPost, "body" | "seo_title" | "meta_description">;

/** Public: published posts only (RLS enforces it too). */
export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("@/lib/public-db.server");
  const { data, error } = await publicDb()
    .from("blog_posts")
    .select(LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(60);
  if (error) throw new Error(error.message);
  return (data ?? []) as BlogPostCard[];
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug).slice(0, 200) }))
  .handler(async ({ data }) => {
    const { publicDb } = await import("@/lib/public-db.server");
    const { data: row, error } = await publicDb()
      .from("blog_posts")
      .select(FULL_COLUMNS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as BlogPost | null;
  });

/* ----------------------------- admin ----------------------------- */

export const adminListPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select(FULL_COLUMNS)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as BlogPost[];
  });

export type BlogPostInput = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url?: string | null;
  tags: string[];
  author: string;
  read_minutes: number;
  status: "draft" | "published";
  seo_title?: string | null;
  meta_description?: string | null;
};

function cleanPost(input: BlogPostInput) {
  const title = String(input.title).trim().slice(0, 200);
  if (!title) throw new Error("Title is required");
  const slug = String(input.slug)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
  if (!slug) throw new Error("Slug is required");
  const status = input.status === "published" ? "published" : "draft";
  return {
    slug,
    title,
    excerpt: String(input.excerpt ?? "").slice(0, 600),
    body: String(input.body ?? "").slice(0, 100000),
    cover_image_url: input.cover_image_url?.slice(0, 500) || null,
    tags: (input.tags ?? []).slice(0, 12).map((t) => String(t).slice(0, 40)),
    author: String(input.author ?? "CyberSentinels").slice(0, 120),
    read_minutes: Math.min(90, Math.max(1, Number(input.read_minutes) || 5)),
    status,
    seo_title: input.seo_title?.slice(0, 200) || null,
    meta_description: input.meta_description?.slice(0, 400) || null,
  };
}

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: BlogPostInput) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const values = cleanPost(data);
    if (data.id) {
      const { data: existing } = await context.supabase
        .from("blog_posts")
        .select("published_at, status")
        .eq("id", data.id)
        .maybeSingle();
      const published_at =
        values.status === "published"
          ? (existing?.published_at ?? new Date().toISOString())
          : existing?.published_at ?? null;
      const { data: row, error } = await context.supabase
        .from("blog_posts")
        .update({ ...values, published_at })
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("blog_posts")
      .insert({
        ...values,
        published_at: values.status === "published" ? new Date().toISOString() : null,
        created_by: context.userId,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
