import logoPrimary from "@/assets/logo-primary.asset.json";
import logoWhite from "@/assets/logo-primary-white.asset.json";
import primaryAvif360 from "@/assets/logo-primary-360.avif.asset.json";
import primaryAvif720 from "@/assets/logo-primary-720.avif.asset.json";
import primaryWebp360 from "@/assets/logo-primary-360.webp.asset.json";
import primaryWebp720 from "@/assets/logo-primary-720.webp.asset.json";
import whiteAvif360 from "@/assets/logo-white-360.avif.asset.json";
import whiteAvif720 from "@/assets/logo-white-720.avif.asset.json";
import whiteWebp360 from "@/assets/logo-white-360.webp.asset.json";
import whiteWebp720 from "@/assets/logo-white-720.webp.asset.json";
import { cn } from "@/lib/utils";


/** Brand arc mark, redrawn from the Cybersentinels logo. */
export function BrandMark({ className, spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg
      viewBox="0 0 60.47 70.21"
      className={cn("h-8 w-auto", className)}
      style={spin ? { animation: "arc-spin 26s linear infinite" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.69 35.11c0-10.48 4.19-18.28 10.66-23.09a27.1 27.1 0 0 0-6.24-3.42C4.23 14.68 0 23.75 0 35.11s4.36 20.37 11.26 26.45a27.08 27.08 0 0 0 6.08-3.36C10.88 53.39 6.69 45.59 6.69 35.11z"
        fill="var(--coral)"
      />
      <path
        d="M23.43 8.66a32 32 0 0 1 12-2.25A29.18 29.18 0 0 1 56 14.63l4.46-4.32A35.8 35.8 0 0 0 35.39 0a38.19 38.19 0 0 0-18.17 4.35 33.14 33.14 0 0 1 6.21 4.31z"
        fill="var(--magenta)"
      />
      <path
        d="M35.39 63.81a32.09 32.09 0 0 1-11.81-2.19 32.35 32.35 0 0 1-6.11 4.24 37.75 37.75 0 0 0 17.92 4.35 35.2 35.2 0 0 0 25.08-10.3l-4.6-4.6a29.14 29.14 0 0 1-20.48 8.5z"
        fill="var(--amber)"
      />
    </svg>
  );
}

export function Logo({
  tone = "light",
  className,
  style,
  halo = "sm",
  reveal = false,
}: {
  tone?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
  /** Size of the soft brand glow behind the mark. */
  halo?: "sm" | "lg" | "none";
  /** Play the one-off entrance animation (hero use). */
  reveal?: boolean;
  /** Header/hero marks paint immediately; everything else defers. */
  priority?: boolean;
}) {
  const dark = tone === "dark";
  const asset = dark ? logoWhite : logoPrimary;
  const avif = dark ? [whiteAvif360, whiteAvif720] : [primaryAvif360, primaryAvif720];
  const webp = dark ? [whiteWebp360, whiteWebp720] : [primaryWebp360, primaryWebp720];
  const srcSet = (set: { url: string }[]) => `${set[0].url} 360w, ${set[1].url} 720w`;

  return (
    <span className={cn("logo-wrap align-middle", reveal && "logo-reveal")}>
      {halo !== "none" && (
        <span aria-hidden="true" className={cn("logo-halo", halo === "sm" && "logo-halo-sm")} />
      )}
      <picture>
        <source type="image/avif" srcSet={srcSet(avif)} sizes="(min-width: 640px) 320px, 220px" />
        <source type="image/webp" srcSet={srcSet(webp)} sizes="(min-width: 640px) 320px, 220px" />
        <img
          src={asset.url}
          alt="CyberSentinels"
          width={1154}
          height={326}
          style={style}
          className={cn(
            "logo-img block h-8 w-auto shrink-0 object-contain object-left sm:h-9",
            dark && "logo-img-dark",
            className,
          )}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      </picture>
    </span>
  );
}



