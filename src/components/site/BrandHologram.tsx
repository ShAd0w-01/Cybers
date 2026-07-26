import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import videoAsset from "@/assets/cybersentinels-hologram.mp4.asset.json";
import posterAsset from "@/assets/cybersentinels-hologram-poster.jpg.asset.json";

/**
 * Looping holographic brand emblem video used as a hero visual.
 * Falls back to the poster frame when the user prefers reduced motion.
 */
export function BrandHologram({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduced.matches) {
        el.pause();
        el.currentTime = 0;
      } else {
        void el.play().catch(() => undefined);
      }
    };
    apply();
    reduced.addEventListener("change", apply);
    return () => reduced.removeEventListener("change", apply);
  }, []);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-ink-border bg-ink-soft/40",
        className,
      )}
    >
      <video
        ref={ref}
        className="block h-auto w-full"
        src={videoAsset.url}
        poster={posterAsset.url}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label="Animated Cybersentinels emblem projected from a holographic pedestal"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,transparent_40%,var(--ink)_100%)]"
        aria-hidden="true"
      />
    </div>
  );
}
