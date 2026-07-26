import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Consistent, professional icon presentation used across the site:
 * a quiet tinted square with a thin-stroke line icon — no filled
 * gradient blobs, no mixed stroke weights.
 */
export function IconTile({
  icon: Icon,
  size = "md",
  tone = "light",
  className,
}: {
  icon: LucideIcon;
  size?: "sm" | "md";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-lg border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-coral/50 group-hover:shadow-[0_10px_22px_-12px_color-mix(in_oklab,var(--coral)_65%,transparent)]",
        size === "sm" ? "size-9" : "size-11",
        tone === "dark"
          ? "border-ink-border bg-ink-soft/60 text-amber"
          : "border-border bg-surface text-coral-ink",
        className,
      )}
    >
      <Icon
        className={size === "sm" ? "size-4" : "size-5"}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </span>
  );
}
