/**
 * Global theme tokens (typography + brand colours) that admins can edit.
 * Values are plain hex so they are easy to pick in the admin UI; they are
 * injected as CSS custom properties that override the defaults in styles.css.
 */

export type SiteTheme = {
  heading_font: string;
  body_font: string;
  base_font_size: number;
  heading_scale: number;
  color_ink: string;
  color_magenta: string;
  color_coral: string;
  color_coral_ink: string;
  color_amber: string;
  color_surface: string;
  color_background: string;
  color_foreground: string;
  color_muted_foreground: string;
};

export const DEFAULT_THEME: SiteTheme = {
  heading_font: "Sora",
  body_font: "Manrope",
  base_font_size: 16,
  heading_scale: 1,
  color_ink: "#12121b",
  color_magenta: "#d63bab",
  color_coral: "#f2603f",
  color_coral_ink: "#c33a25",
  color_amber: "#f0a441",
  color_surface: "#f7f7f8",
  color_background: "#ffffff",
  color_foreground: "#1c1c26",
  color_muted_foreground: "#5f5f6b",
};

export const FONT_OPTIONS = [
  { name: "Sora", weights: "400;600;700" },
  { name: "Manrope", weights: "400;500;600" },
  { name: "Inter", weights: "400;500;600;700" },
  { name: "Outfit", weights: "400;500;600;700" },
  { name: "Space Grotesk", weights: "400;500;600;700" },
  { name: "Plus Jakarta Sans", weights: "400;500;600;700" },
  { name: "DM Sans", weights: "400;500;600;700" },
  { name: "Figtree", weights: "400;500;600;700" },
  { name: "Work Sans", weights: "400;500;600;700" },
  { name: "Source Serif 4", weights: "400;600;700" },
] as const;

export function googleFontsHref(theme: SiteTheme) {
  const names = Array.from(new Set([theme.heading_font, theme.body_font]));
  const families = names
    .map((n) => FONT_OPTIONS.find((f) => f.name === n) ?? { name: n, weights: "400;600;700" })
    .map((f) => `family=${f.name.replace(/ /g, "+")}:wght@${f.weights}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/** CSS custom-property block injected into the document. */
export function themeCss(theme: SiteTheme) {
  const scale = clamp(Number(theme.heading_scale) || 1, 0.85, 1.25);
  return `:root{
  --ink:${theme.color_ink};
  --ink-soft:${mix(theme.color_ink, "#ffffff", 0.08)};
  --magenta:${theme.color_magenta};
  --coral:${theme.color_coral};
  --coral-ink:${theme.color_coral_ink};
  --amber:${theme.color_amber};
  --surface:${theme.color_surface};
  --background:${theme.color_background};
  --foreground:${theme.color_foreground};
  --card:${theme.color_background};
  --card-foreground:${theme.color_foreground};
  --popover:${theme.color_background};
  --popover-foreground:${theme.color_foreground};
  --muted-foreground:${theme.color_muted_foreground};
  --primary:${theme.color_coral};
  --ring:${theme.color_coral};
  --sidebar:${theme.color_surface};
  --sidebar-primary:${theme.color_coral};
  --font-display:"${theme.heading_font}",ui-sans-serif,system-ui,sans-serif;
  --font-sans:"${theme.body_font}",ui-sans-serif,system-ui,sans-serif;
}
html{font-size:${clamp(Number(theme.base_font_size) || 16, 14, 20)}px;}
h1,h2,h3,h4,h5,h6{font-size-adjust:none;}
.type-display{font-size:calc(clamp(2.125rem, 1.2rem + 3.9vw, 3.75rem) * ${scale});}
.type-h2{font-size:calc(clamp(1.625rem, 1.1rem + 1.8vw, 2.25rem) * ${scale});}
.type-h3{font-size:calc(clamp(1.125rem, 1rem + 0.5vw, 1.375rem) * ${scale});}
.type-h4{font-size:calc(1rem * ${scale});}`;
}

/* -------------------------- contrast helpers -------------------------- */

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function normaliseHex(input: string, fallback = "#000000") {
  let hex = String(input || "").trim();
  if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toLowerCase() : fallback;
}

function toRgb(hex: string): [number, number, number] {
  const h = normaliseHex(hex);
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}

function toHex(rgb: [number, number, number]) {
  return `#${rgb.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
}

function mix(a: string, b: string, amount: number) {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return toHex([
    r1 + (r2 - r1) * amount,
    g1 + (g2 - g1) * amount,
    b1 + (b2 - b1) * amount,
  ]);
}

export function luminance(hex: string) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio between two hex colours (1–21). */
export function contrastRatio(a: string, b: string) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastLevel = "AAA" | "AA" | "AA Large" | "Fail";

export function contrastLevel(ratio: number, large = false): ContrastLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (large && ratio >= 3) return "AA Large";
  return "Fail";
}

/**
 * Nudges `color` lighter or darker (whichever direction the background asks
 * for) until it reaches the target contrast ratio, so admins can always get
 * to an AA-ready palette in one click.
 */
export function adjustForContrast(color: string, background: string, target = 4.5) {
  const towardsWhite = luminance(background) < 0.5;
  let best = normaliseHex(color);
  for (let step = 0; step <= 100; step++) {
    const candidate = mix(normaliseHex(color), towardsWhite ? "#ffffff" : "#000000", step / 100);
    best = candidate;
    if (contrastRatio(candidate, background) >= target) break;
  }
  return best;
}

/** Every text/background pairing the admin UI audits. */
export function contrastChecks(theme: SiteTheme) {
  return [
    {
      key: "color_foreground" as const,
      label: "Body text on page background",
      fg: theme.color_foreground,
      bg: theme.color_background,
      large: false,
    },
    {
      key: "color_muted_foreground" as const,
      label: "Muted text on page background",
      fg: theme.color_muted_foreground,
      bg: theme.color_background,
      large: false,
    },
    {
      key: "color_muted_foreground" as const,
      label: "Muted text on surface panels",
      fg: theme.color_muted_foreground,
      bg: theme.color_surface,
      large: false,
    },
    {
      key: "color_coral_ink" as const,
      label: "Accent text / links on background",
      fg: theme.color_coral_ink,
      bg: theme.color_background,
      large: false,
    },
    {
      key: "color_coral" as const,
      label: "White button text on coral",
      fg: "#ffffff",
      bg: theme.color_coral,
      large: true,
    },
    {
      key: "color_magenta" as const,
      label: "White button text on magenta",
      fg: "#ffffff",
      bg: theme.color_magenta,
      large: true,
    },
    {
      key: "color_ink" as const,
      label: "White text on ink bands",
      fg: "#ffffff",
      bg: theme.color_ink,
      large: false,
    },
  ].map((c) => {
    const ratio = contrastRatio(c.fg, c.bg);
    return { ...c, ratio, level: contrastLevel(ratio, c.large), passes: ratio >= (c.large ? 3 : 4.5) };
  });
}
