import { useEffect } from "react";

/**
 * Decides how much frosted glass this device can afford and writes the
 * verdict to `html[data-glass]` — "full", "lite" or "off".
 *
 * Signals, cheapest first: reduced-motion preference, device memory,
 * logical cores, save-data, and finally a short live frame-rate probe.
 * The stylesheet reads the attribute, so nothing re-renders in React.
 */
export function GlassGuard() {
  useEffect(() => {
    const root = document.documentElement;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const memory = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const saveData = nav.connection?.saveData === true;

    if (reduced || saveData || memory <= 2 || cores <= 2) {
      root.dataset.glass = "off";
      return;
    }
    root.dataset.glass = memory <= 4 || cores <= 4 ? "lite" : "full";

    // Live probe: if the page can't hold ~45fps while idle, step down a tier.
    let frames = 0;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick() {
      frames += 1;
      if (performance.now() - start < 900) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const fps = (frames / (performance.now() - start)) * 1000;
      if (fps < 32) root.dataset.glass = "off";
      else if (fps < 45 && root.dataset.glass === "full") root.dataset.glass = "lite";
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
