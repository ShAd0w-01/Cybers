/**
 * Critical CSS — the minimum needed to paint the first screen (background,
 * type colours, header shell, hero rhythm) before the full Tailwind sheet
 * arrives. Keep this small: it is inlined into every HTML response.
 *
 * The full stylesheet is loaded non-render-blocking (see `__root.tsx`), so
 * anything below the fold is styled a few milliseconds later.
 */
export const CRITICAL_CSS = `
:root{
  --critical-bg:#fdfaf6;
  --critical-fg:#2b2634;
  --critical-muted:#6b6070;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;line-height:1.5;scroll-behavior:smooth}
body{
  margin:0;
  min-height:100vh;
  background:var(--critical-bg);
  color:var(--critical-fg);
  font-family:Manrope,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
h1,h2,h3,h4{font-family:Sora,ui-sans-serif,system-ui,sans-serif;margin:0;line-height:1.15;letter-spacing:-0.01em}
p{margin:0}
a{color:inherit;text-decoration:none}
img,svg,video,picture{display:block;max-width:100%}
img,video{height:auto}
button{font:inherit;color:inherit;background:none;border:0}
header{position:sticky;top:0;z-index:50;width:100%;background:var(--critical-bg)}
/* Reserve the real header height so nothing shifts when the full sheet lands. */
header>div{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;min-height:4.5rem;max-width:80rem;margin:0 auto;padding:1rem 1.25rem}
header img{height:2rem;width:auto}
main{display:block;min-height:60vh}
[hidden]{display:none!important}
`;
