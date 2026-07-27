import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "quiet" | "soft" | "warm";

const tones: Record<Tone, string> = {
  quiet: "panel-quiet",
  soft: "panel-soft",
  warm: "panel-warm",
};

export type GradientPanelProps<T extends React.ElementType = "div"> = {
  /** Element to render — article, li, section… defaults to div. */
  as?: T;
  tone?: Tone;
  /** Adds the 6px lift + shadow bloom on hover. */
  interactive?: boolean;
  /** Draws a soft warm fade at the bottom edge instead of a hard rule. */
  separated?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * The single card shell used across every section: consistent padding,
 * radius, warm gradient fill, paper texture and shadow — with soft fade
 * separators instead of dividing lines.
 */
export function GradientPanel<T extends React.ElementType = "div">({
  as,
  tone = "quiet",
  interactive = false,
  separated = false,
  className,
  children,
  ...rest
}: GradientPanelProps<T>) {
  const Comp = (as ?? "div") as React.ElementType;
  return (
    <Comp
      className={cn(
        "panel-base",
        tones[tone],
        interactive && "card-lift group",
        separated && "fade-sep",
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
