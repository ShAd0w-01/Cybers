import { cn } from "@/lib/utils";

/**
 * Decorative animated line-doodle layer for hero bands.
 * Hand-drawn arcs, orbits and sparks in the brand palette that
 * self-draw on mount and drift gently. Purely decorative.
 */
export function HeroDoodle({ className }: { className?: string }) {
  return (
    <svg
      className={cn("hero-doodle pointer-events-none absolute inset-0 size-full", className)}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="doodle-float-a" stroke="var(--magenta)" strokeLinecap="round" opacity="0.5">
        <path className="doodle-draw" style={{ animationDelay: "0.1s" }} d="M60 520c90-140 210-210 350-210" strokeWidth="1.5" />
        <path className="doodle-draw" style={{ animationDelay: "0.5s" }} d="M120 590c70-180 230-280 400-268" strokeWidth="1" strokeDasharray="6 10" />
      </g>

      <g className="doodle-float-b" stroke="var(--coral)" strokeLinecap="round" opacity="0.45">
        <path className="doodle-draw" style={{ animationDelay: "0.3s" }} d="M1140 180c-110 110-250 150-390 130" strokeWidth="1.5" />
        <path className="doodle-draw" style={{ animationDelay: "0.7s" }} d="M1090 90c-60 150-210 240-360 245" strokeWidth="1" strokeDasharray="4 12" />
      </g>

      <g className="doodle-spin" style={{ transformOrigin: "170px 150px" }} opacity="0.42">
        <circle cx="170" cy="150" r="54" stroke="var(--amber)" strokeWidth="1.2" strokeDasharray="3 9" />
        <circle cx="170" cy="96" r="3.5" fill="var(--coral)" />
      </g>

      <g className="doodle-spin-rev" style={{ transformOrigin: "1010px 560px" }} opacity="0.38">
        <circle cx="1010" cy="560" r="74" stroke="var(--magenta)" strokeWidth="1.2" strokeDasharray="2 10" />
        <circle cx="1010" cy="486" r="3" fill="var(--amber)" />
      </g>

      <g className="doodle-float-a" opacity="0.5">
        <path className="doodle-draw" style={{ animationDelay: "0.9s" }} d="M300 120c40-26 84-26 124 0" stroke="var(--amber)" strokeWidth="1.4" strokeLinecap="round" />
        <path className="doodle-draw" style={{ animationDelay: "1.1s" }} d="M820 640c40-26 84-26 124 0" stroke="var(--coral)" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      <g className="doodle-twinkle">
        <path d="M640 84l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill="var(--amber)" opacity="0.55" />
        <path className="doodle-twinkle-b" d="M240 400l4.5 10 10 4.5-10 4.5-4.5 10-4.5-10-10-4.5 10-4.5z" fill="var(--magenta)" opacity="0.5" />
        <path className="doodle-twinkle-c" d="M960 250l4.5 10 10 4.5-10 4.5-4.5 10-4.5-10-10-4.5 10-4.5z" fill="var(--coral)" opacity="0.5" />
      </g>
    </svg>
  );
}
