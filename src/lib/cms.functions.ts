import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Section } from "@/content/site";

export type SitePage = {
  id: string;
  url: string;
  name: string;
  seo_title: string | null;
  meta_description: string | null;
  sections: Section[];
  is_published: boolean;
  updated_at: string;
};

const COLUMNS = "id, url, name, seo_title, meta_description, sections, is_published, updated_at";

/** Public: content override for a single page URL, if an admin has saved one. */
export const getPageOverride = createServerFn({ method: "GET" })
  .inputValidator((input: { url: string }) => ({ url: String(input.url).slice(0, 300) }))
  .handler(async ({ data }) => {
    const { publicDb } = await import("@/lib/public-db.server");
    const { data: row, error } = await publicDb()
      .from("site_pages")
      .select(COLUMNS)
      .eq("url", data.url)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as SitePage | null;
  });

/* ----------------------------- admin ----------------------------- */

export const adminListPages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("site_pages")
      .select(COLUMNS)
      .order("url", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as SitePage[];
  });

export type SitePageInput = {
  url: string;
  name: string;
  seo_title?: string | null;
  meta_description?: string | null;
  sections: Section[];
  is_published: boolean;
};

export const adminSavePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: SitePageInput) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const url = String(data.url).trim().slice(0, 300);
    if (!url.startsWith("/")) throw new Error("Page URL must start with /");
    const payload = {
      url,
      name: String(data.name ?? url).slice(0, 200),
      seo_title: data.seo_title?.slice(0, 200) || null,
      meta_description: data.meta_description?.slice(0, 400) || null,
      sections: (data.sections ?? []) as unknown as never,
      is_published: Boolean(data.is_published),
      updated_by: context.userId,
    };
    const { error } = await context.supabase
      .from("site_pages")
      .upsert(payload, { onConflict: "url" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("site_pages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
