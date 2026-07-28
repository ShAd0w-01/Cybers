import { DEFAULT_THEME, normaliseHex, type SiteTheme } from "@/lib/theme";

export const THEME_COLUMNS =
  "id, heading_font, body_font, base_font_size, heading_scale, color_ink, color_magenta, color_coral, color_coral_ink, color_amber, color_surface, color_background, color_foreground, color_muted_foreground, updated_at";

export function sanitiseTheme(input: Partial<SiteTheme>): SiteTheme {
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

/**
 * The active theme is read on every single request, so it is memoised in the
 * worker for a few minutes. Admin saves clear the cache immediately, so edits
 * still appear straight away.
 */
const TTL_MS = 5 * 60 * 1000;
let cache: { at: number; theme: SiteTheme } | null = null;

export function clearThemeCache() {
  cache = null;
}

export async function loadActiveTheme(): Promise<SiteTheme> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.theme;

  const { publicDb } = await import("@/lib/public-db.server");
  const { data, error } = await publicDb()
    .from("site_theme")
    .select(THEME_COLUMNS)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const theme = error || !data ? DEFAULT_THEME : sanitiseTheme(data as unknown as Partial<SiteTheme>);
  cache = { at: Date.now(), theme };
  return theme;
}
