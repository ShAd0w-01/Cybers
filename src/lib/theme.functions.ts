import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEFAULT_THEME, type SiteTheme } from "@/lib/theme";

/** Public: the active theme, used to paint CSS variables for every visitor. */
export const getActiveTheme = createServerFn({ method: "GET" }).handler(async () => {
  const { loadActiveTheme } = await import("@/lib/theme.server");
  return loadActiveTheme();
});

export const adminGetTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    const { THEME_COLUMNS, sanitiseTheme } = await import("@/lib/theme.server");
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("site_theme")
      .select(THEME_COLUMNS)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      id: (data as { id?: string } | null)?.id ?? null,
      theme: data ? sanitiseTheme(data as unknown as Partial<SiteTheme>) : DEFAULT_THEME,
    };
  });

export const adminSaveTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: Partial<SiteTheme> & { id?: string | null }) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    const { sanitiseTheme, clearThemeCache } = await import("@/lib/theme.server");
    await requireAdmin(context.supabase, context.userId);
    const payload = { ...sanitiseTheme(data), is_active: true, updated_by: context.userId };
    clearThemeCache();

    if (data.id) {
      const { error } = await context.supabase
        .from("site_theme")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: row, error } = await context.supabase
      .from("site_theme")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: (row as { id: string }).id };
  });
