import logoPrimary from "@/assets/logo-primary.asset.json";
import logoWhite from "@/assets/logo-primary-white.asset.json";
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
}) {
  const asset = tone === "dark" ? logoWhite : logoPrimary;
  return (
    <span className={cn("logo-wrap", reveal && "logo-reveal")}>
      {halo !== "none" && (
        <span aria-hidden="true" className={cn("logo-halo", halo === "sm" && "logo-halo-sm")} />
      )}
      <img
        src={asset.url}
        alt="CyberSentinels"
        width={1154}
        height={326}
        style={style}
        className={cn(
          "logo-img h-7 w-auto object-contain sm:h-9",
          tone === "dark" && "logo-img-dark",
          className,
        )}
        loading="eager"
        decoding="async"
      />
    </span>
  );
}


