/**
 * Lightweight client-side analytics dispatcher.
 *
 * Events are fanned out to whichever collector happens to be present
 * (GTM dataLayer, gtag, Plausible) and always re-emitted as a DOM
 * CustomEvent so anything in-app can listen without extra wiring.
 */
export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: AnalyticsProps }) => void;
  }
}

export function track(event: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...props, ts: Date.now() };

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...payload });
    window.gtag?.("event", event, payload);
    window.plausible?.(event, { props });
    window.dispatchEvent(new CustomEvent("cs:analytics", { detail: { event, ...payload } }));
  } catch {
    /* analytics must never break the UI */
  }

  if (import.meta.env.DEV) console.debug("[analytics]", event, payload);
}
