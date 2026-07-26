import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEFAULT_THEME, normaliseHex, type SiteTheme } from "@/lib/theme";

const COLUMNS =
  "id, heading_font, body_font, base_font_size, heading_scale, color_ink, color_magenta, color_coral, color_coral_ink, color_amber, color_surface, color_background, color_foreground, color_muted_foreground, updated_at";

function sanitise(input: Partial<SiteTheme>): SiteTheme {
  const num = (v: unknown, fallback: number, min: number, max: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  return {
    heading_font: String(input.heading_font ?? DEFAULT_THEME.heading_font).slice(0, 60),
    body_font: String(input.body_font ?? DEFAULT_THEME.body_font).slice(0, 60),
    base_font_size: num(input.base_font_size, 16, 14, 20),
    heading_scale: num(input.heading_scale, 1, 0.85, 1.25),
    color_ink: normaliseHex(input.color_ink ?? "", DEFAULT_THEME.color_ink),
    color_magenta: normaliseHex(input.color_magenta ?? "", DEFAULT_THEME.color_magenta),
    color_coral: normaliseHex(input.color_coral ?? "", DEFAULT_THEME.color_coral),
    color_coral_ink: normaliseHex(input.color_coral_ink ?? "", DEFAULT_THEME.color_coral_ink),
    color_amber: normaliseHex(input.color_amber ?? "", DEFAULT_THEME.color_amber),
    color_surface: normaliseHex(input.color_surface ?? "", DEFAULT_THEME.color_surface),
    color_background: normaliseHex(input.color_background ?? "", DEFAULT_THEME.color_background),
    color_foreground: normaliseHex(input.color_foreground ?? "", DEFAULT_THEME.color_foreground),
    color_muted_foreground: normaliseHex(
      input.color_muted_foreground ?? "",
      DEFAULT_THEME.color_muted_foreground,
    ),
  };
}

/** Public: the active theme, used to paint CSS variables for every visitor. */
export const getActiveTheme = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("@/lib/public-db.server");
  const { data, error } = await publicDb()
    .from("site_theme")
    .select(COLUMNS)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return DEFAULT_THEME;
  return sanitise(data as unknown as Partial<SiteTheme>);
});

export const adminGetTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("site_theme")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      id: (data as { id?: string } | null)?.id ?? null,
      theme: data ? sanitise(data as unknown as Partial<SiteTheme>) : DEFAULT_THEME,
    };
  });

export const adminSaveTheme = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: Partial<SiteTheme> & { id?: string | null }) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const payload = { ...sanitise(data), is_active: true, updated_by: context.userId };

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
