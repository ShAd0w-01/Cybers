import { themeCss, type SiteTheme } from "@/lib/theme";

/**
 * Paints the admin-configured tokens as CSS custom properties.
 * Rendered server-side so there is no flash of the default palette.
 */
export function ThemeStyle({ theme }: { theme: SiteTheme }) {
  return <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />;
}
