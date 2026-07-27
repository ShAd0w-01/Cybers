import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useParallax } from "@/lib/useParallax";

export type AuroraDirection = "bottom" | "top" | "left" | "right" | "center";

const DIRECTIONS: Record<
  AuroraDirection,
  { x: string; y: string; angle: string }
> = {
  bottom: { x: "50%", y: "100%", angle: "to bottom" },
  top: { x: "50%", y: "0%", angle: "to top" },
  left: { x: "0%", y: "60%", angle: "to left" },
  right: { x: "100%", y: "60%", angle: "to right" },
  center: { x: "50%", y: "55%", angle: "to bottom" },
};

export type AuroraBloomProps = {
  /** Overall strength of the colour field, 0–1. Default 0.78. */
  intensity?: number;
  /** Blur radius in px of the colour field. Default 70. */
  blur?: number;
  /** Where the glow rises from. Default "bottom". */
  direction?: AuroraDirection;
  /** How far the field extends beyond the band, in %. Default 20. */
  spread?: number;
  /** Paper-grain strength blended into the glow, 0–1. Default 0.5. */
  grain?: number;
  /** Where the fade-to-page mask finishes, in %. Lower = glow reaches further. */
  fade?: number;
  /** Drift the glow against the scroll for depth. 0 disables. Default 0.1. */
  parallax?: number;
  className?: string;
};

/**
 * Reusable brand aurora glow (magenta → coral → amber) for any hero,
 * banner or section band. Renders an absolutely-positioned decorative
 * layer — the parent needs `relative overflow-hidden`, and content above
 * it needs `relative` so it stacks on top.
 *
 * Every knob is a CSS variable, so intensity / blur / direction can be
 * tuned per page without touching the stylesheet. The paper-grain overlay
 * keeps the glow from looking flat, especially on mobile.
 */
export function AuroraBloom({
  intensity = 0.78,
  blur = 70,
  direction = "bottom",
  spread = 20,
  grain = 0.5,
  fade = 52,
  className,
}: AuroraBloomProps) {
  const d = DIRECTIONS[direction];

  const style = {
    "--aurora-intensity": String(Math.min(Math.max(intensity, 0), 1)),
    "--aurora-blur": `${blur}px`,
    "--aurora-spread": `${spread}%`,
    "--aurora-grain": String(Math.min(Math.max(grain, 0), 1)),
    "--aurora-x": d.x,
    "--aurora-y": d.y,
    "--aurora-fade-angle": d.angle,
    "--aurora-fade-mid": `${Math.round(fade / 2)}%`,
    "--aurora-fade-end": `${fade}%`,
  } as CSSProperties;

  return (
    <div className={cn("aurora-bloom", className)} style={style} aria-hidden="true">
      <span className="aurora-grain" />
    </div>
  );
}
