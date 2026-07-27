import heroLogo from "@/assets/logo-dark.asset.json";
import { cn } from "@/lib/utils";

export type HeroLogoSize = "sm" | "default" | "lg";

/** Responsive size presets for the hero brand lockup. */
const SIZES: Record<HeroLogoSize, { img: string; pad: string }> = {
  sm: {
    img: "h-8 sm:h-9 lg:h-10",
    pad: "px-4 py-3 sm:px-5 sm:py-3.5",
  },
  default: {
    img: "h-10 sm:h-12 lg:h-16",
    pad: "px-5 py-3.5 sm:px-7 sm:py-4 lg:px-9 lg:py-5",
  },
  lg: {
    img: "h-16 sm:h-20 lg:h-32",
    pad: "px-7 py-5 sm:px-11 sm:py-6 lg:px-14 lg:py-8",
  },
};

export function HeroLogo({
  size = "default",
  className,
}: {
  size?: HeroLogoSize;
  className?: string;
}) {
  const preset = SIZES[size];
  return (
    <span
      className={cn(
        "glass-strong card-lift inline-flex max-w-full items-center justify-center rounded-full shadow-[0_18px_45px_-24px_color-mix(in_oklab,var(--magenta)_60%,transparent)]",
        preset.pad,
        className,
      )}
    >
      <img
        src={heroLogo.url}
        alt="CyberSentinels"
        width={520}
        height={120}
        className={cn("w-auto max-w-full object-contain", preset.img)}
        loading="eager"
        decoding="async"
      />
    </span>
  );
}
