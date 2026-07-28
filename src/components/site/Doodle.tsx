import type { CSSProperties, ReactElement } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated line-doodle decoration layer for the warm ink bands.
 * Each variant is a hand-drawn scene that matches the content of the
 * section it sits behind. Strokes self-draw on mount, then drift, spin
 * and twinkle gently. Purely decorative — always aria-hidden.
 */
export type DoodleVariant =
  | "orbit" // hero — orbits, arcs, sparks
  | "shield" // security / protection
  | "compliance" // checklists, documents, certificates
  | "network" // nodes, connections, infrastructure
  | "insight" // reading, charts, ideas
  | "globe" // footer / global reach
  | "radar" // threat map / monitoring
  | "toolkit"; // starter kit / downloads

const D = (delay: number) => ({ animationDelay: `${delay}s` } as CSSProperties);

export function Doodle({
  variant = "orbit",
  className,
  opacity = 1,
}: {
  variant?: DoodleVariant;
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={cn("hero-doodle pointer-events-none absolute inset-0 size-full", className)}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      {SCENES[variant]}
    </svg>
  );
}

/** Back-compat alias used by the homepage hero. */
export function HeroDoodle({ className }: { className?: string }) {
  return <Doodle variant="orbit" className={className} />;
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

const orbit = (
  <>
    <g className="doodle-float-a" stroke="var(--magenta)" strokeLinecap="round" opacity="0.5">
      <path className="doodle-draw" style={D(0.1)} d="M60 520c90-140 210-210 350-210" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.5)} d="M120 590c70-180 230-280 400-268" strokeWidth="1" strokeDasharray="6 10" />
    </g>
    <g className="doodle-float-b" stroke="var(--coral)" strokeLinecap="round" opacity="0.45">
      <path className="doodle-draw" style={D(0.3)} d="M1140 180c-110 110-250 150-390 130" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.7)} d="M1090 90c-60 150-210 240-360 245" strokeWidth="1" strokeDasharray="4 12" />
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
      <path className="doodle-draw" style={D(0.9)} d="M300 120c40-26 84-26 124 0" stroke="var(--amber)" strokeWidth="1.4" strokeLinecap="round" />
      <path className="doodle-draw" style={D(1.1)} d="M820 640c40-26 84-26 124 0" stroke="var(--coral)" strokeWidth="1.4" strokeLinecap="round" />
    </g>
    <Sparks />
  </>
);

const shield = (
  <>
    <g className="doodle-float-a" opacity="0.5" strokeLinecap="round" strokeLinejoin="round">
      <path
        className="doodle-draw"
        style={D(0.1)}
        d="M150 120l86 30v70c0 56-36 96-86 116-50-20-86-60-86-116v-70l86-30z"
        stroke="var(--magenta)"
        strokeWidth="1.6"
      />
      <path className="doodle-draw" style={D(0.8)} d="M116 226l24 24 46-52" stroke="var(--coral)" strokeWidth="1.8" />
    </g>
    <g className="doodle-float-b" opacity="0.45" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.4)} d="M980 430h140v96H980z" stroke="var(--amber)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.7)} d="M1010 430v-30a40 40 0 0 1 80 0v30" stroke="var(--amber)" strokeWidth="1.5" />
      <circle cx="1050" cy="474" r="9" stroke="var(--coral)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(1)} d="M1050 483v18" stroke="var(--coral)" strokeWidth="1.5" />
    </g>
    <g className="doodle-spin" style={{ transformOrigin: "620px 610px" }} opacity="0.32">
      <circle cx="620" cy="610" r="66" stroke="var(--magenta)" strokeWidth="1.1" strokeDasharray="3 11" />
    </g>
    <g className="doodle-float-a" opacity="0.4" strokeLinecap="round">
      <path className="doodle-draw" style={D(1.2)} d="M300 640c60-70 150-96 240-70" stroke="var(--coral)" strokeWidth="1.2" strokeDasharray="5 9" />
    </g>
    <Sparks />
  </>
);

const compliance = (
  <>
    <g className="doodle-float-a" opacity="0.5" strokeLinecap="round" strokeLinejoin="round">
      <path className="doodle-draw" style={D(0.1)} d="M96 96h190l46 46v256H96z" stroke="var(--magenta)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.5)} d="M286 96v46h46" stroke="var(--magenta)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.7)} d="M132 200h118M132 240h150M132 280h96" stroke="var(--coral)" strokeWidth="1.4" />
      <path className="doodle-draw" style={D(1)} d="M132 330l20 20 40-46" stroke="var(--amber)" strokeWidth="1.8" />
    </g>
    <g className="doodle-float-b" opacity="0.45" strokeLinecap="round">
      <circle cx="1050" cy="200" r="46" stroke="var(--amber)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.9)} d="M1028 200l16 16 30-34" stroke="var(--amber)" strokeWidth="1.8" />
      <path className="doodle-draw" style={D(1.2)} d="M1030 244l-14 62 34-20 34 20-14-62" stroke="var(--coral)" strokeWidth="1.5" />
    </g>
    <g className="doodle-float-a" opacity="0.4" strokeLinecap="round">
      <path className="doodle-draw" style={D(1.3)} d="M420 620h360" stroke="var(--magenta)" strokeWidth="1.2" strokeDasharray="4 10" />
      <circle cx="420" cy="620" r="5" fill="var(--coral)" />
      <circle cx="600" cy="620" r="5" fill="var(--amber)" />
      <circle cx="780" cy="620" r="5" fill="var(--magenta)" />
    </g>
    <Sparks />
  </>
);

const network = (
  <>
    <g className="doodle-float-a" opacity="0.45" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.1)} d="M140 180L360 120 560 250 340 360z" stroke="var(--magenta)" strokeWidth="1.3" />
      <path className="doodle-draw" style={D(0.6)} d="M360 120v130M140 180l200 180M560 250 340 360" stroke="var(--coral)" strokeWidth="1.1" strokeDasharray="5 8" />
      {[
        [140, 180],
        [360, 120],
        [560, 250],
        [340, 360],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="var(--amber)" />
      ))}
    </g>
    <g className="doodle-float-b" opacity="0.42" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.4)} d="M880 480h200M880 540h200M880 600h200" stroke="var(--coral)" strokeWidth="1.4" />
      <path className="doodle-draw" style={D(0.8)} d="M880 450v180M1080 450v180" stroke="var(--magenta)" strokeWidth="1.2" />
      <circle cx="910" cy="510" r="4" fill="var(--amber)" />
      <circle cx="910" cy="570" r="4" fill="var(--amber)" />
    </g>
    <g className="doodle-spin-rev" style={{ transformOrigin: "980px 170px" }} opacity="0.34">
      <circle cx="980" cy="170" r="80" stroke="var(--magenta)" strokeWidth="1.1" strokeDasharray="2 12" />
      <circle cx="980" cy="90" r="4" fill="var(--coral)" />
    </g>
    <Sparks />
  </>
);

const insight = (
  <>
    <g className="doodle-float-a" opacity="0.48" strokeLinecap="round" strokeLinejoin="round">
      <path className="doodle-draw" style={D(0.1)} d="M110 420h300M110 420V180M150 380v-90M210 380v-150M270 380v-70M330 380v-190" stroke="var(--magenta)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.9)} d="M140 300l70-80 60 40 90-120" stroke="var(--coral)" strokeWidth="1.6" />
      <path className="doodle-draw" style={D(1.2)} d="M330 140h30v30" stroke="var(--coral)" strokeWidth="1.6" />
    </g>
    <g className="doodle-float-b" opacity="0.45" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.5)} d="M1010 300a48 48 0 1 0-70 0c10 12 14 20 14 32h42c0-12 4-20 14-32z" stroke="var(--amber)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(1.1)} d="M958 352h34M962 368h26" stroke="var(--amber)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(1.3)} d="M900 210l-26-16M1050 210l26-16M975 176v-30" stroke="var(--coral)" strokeWidth="1.3" />
    </g>
    <g className="doodle-float-a" opacity="0.4" strokeLinecap="round">
      <path className="doodle-draw" style={D(1.4)} d="M420 600c90-60 190-60 280 0" stroke="var(--magenta)" strokeWidth="1.2" strokeDasharray="5 9" />
    </g>
    <Sparks />
  </>
);

const globe = (
  <>
    <g className="doodle-spin" style={{ transformOrigin: "220px 350px" }} opacity="0.35">
      <circle cx="220" cy="350" r="120" stroke="var(--magenta)" strokeWidth="1.2" strokeDasharray="4 10" />
    </g>
    <g className="doodle-float-a" opacity="0.45" strokeLinecap="round">
      <circle cx="220" cy="350" r="86" stroke="var(--coral)" strokeWidth="1.3" />
      <path className="doodle-draw" style={D(0.5)} d="M134 350h172M220 264c34 40 34 132 0 172M220 264c-34 40-34 132 0 172" stroke="var(--amber)" strokeWidth="1.2" />
    </g>
    <g className="doodle-float-b" opacity="0.4" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.8)} d="M420 260c160-90 380-90 540 40" stroke="var(--magenta)" strokeWidth="1.2" strokeDasharray="6 10" />
      <path className="doodle-draw" style={D(1.1)} d="M470 470c180 70 380 40 520-70" stroke="var(--coral)" strokeWidth="1.2" strokeDasharray="6 10" />
      <circle cx="960" cy="300" r="6" fill="var(--amber)" />
      <circle cx="470" cy="470" r="6" fill="var(--magenta)" />
    </g>
    <Sparks />
  </>
);

const radar = (
  <>
    <g className="doodle-float-a" opacity="0.42" strokeLinecap="round">
      <circle cx="260" cy="340" r="40" stroke="var(--coral)" strokeWidth="1.3" />
      <circle cx="260" cy="340" r="90" stroke="var(--magenta)" strokeWidth="1.1" strokeDasharray="4 9" />
      <circle cx="260" cy="340" r="140" stroke="var(--amber)" strokeWidth="1" strokeDasharray="2 12" />
    </g>
    <g className="doodle-spin" style={{ transformOrigin: "260px 340px" }} opacity="0.5">
      <path d="M260 340L260 200" stroke="var(--coral)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="260" cy="200" r="4" fill="var(--coral)" />
    </g>
    <g className="doodle-float-b" opacity="0.42" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.6)} d="M700 520l60-90 70 50 80-140 90 60" stroke="var(--magenta)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(1)} d="M690 570h330" stroke="var(--amber)" strokeWidth="1.2" strokeDasharray="5 9" />
      <circle cx="900" cy="340" r="5" fill="var(--coral)" />
    </g>
    <Sparks />
  </>
);

const toolkit = (
  <>
    <g className="doodle-float-a" opacity="0.48" strokeLinecap="round" strokeLinejoin="round">
      <path className="doodle-draw" style={D(0.1)} d="M120 260h180v190H120z" stroke="var(--magenta)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.5)} d="M210 300v90m0 0l-32-32m32 32l32-32" stroke="var(--coral)" strokeWidth="1.7" />
      <path className="doodle-draw" style={D(0.9)} d="M150 420h120" stroke="var(--amber)" strokeWidth="1.5" />
    </g>
    <g className="doodle-float-b" opacity="0.44" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.4)} d="M900 200h190v130H900z" stroke="var(--amber)" strokeWidth="1.4" />
      <path className="doodle-draw" style={D(0.7)} d="M930 240h120M930 270h90" stroke="var(--coral)" strokeWidth="1.3" />
      <path className="doodle-draw" style={D(1)} d="M880 380h190v130H880z" stroke="var(--magenta)" strokeWidth="1.4" />
      <path className="doodle-draw" style={D(1.2)} d="M910 420h120M910 450h70" stroke="var(--coral)" strokeWidth="1.3" />
    </g>
    <g className="doodle-spin-rev" style={{ transformOrigin: "600px 600px" }} opacity="0.3">
      <circle cx="600" cy="600" r="70" stroke="var(--magenta)" strokeWidth="1.1" strokeDasharray="3 11" />
    </g>
    <Sparks />
  </>
);

function Sparks() {
  return (
    <g className="doodle-twinkle">
      <path d="M640 84l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill="var(--amber)" opacity="0.55" />
      <path className="doodle-twinkle-b" d="M240 400l4.5 10 10 4.5-10 4.5-4.5 10-4.5-10-10-4.5 10-4.5z" fill="var(--magenta)" opacity="0.5" />
      <path className="doodle-twinkle-c" d="M960 250l4.5 10 10 4.5-10 4.5-4.5 10-4.5-10-10-4.5 10-4.5z" fill="var(--coral)" opacity="0.5" />
    </g>
  );
}

const SCENES: Record<DoodleVariant, ReactElement> = {
  orbit,
  shield,
  compliance,
  network,
  insight,
  globe,
  radar,
  toolkit,
};
