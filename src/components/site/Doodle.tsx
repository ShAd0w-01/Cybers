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
  | "toolkit" // starter kit / downloads
  | "analyst" // character line-art — engineer with gear-loaded backpack
  | "operator"; // character line-art — analyst at a floating console


const D = (delay: number) => ({ animationDelay: `${delay}s` } as CSSProperties);

export function Doodle({
  variant = "orbit",
  className,
  opacity = 0.72,
}: {
  variant?: DoodleVariant;
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={cn("hero-doodle pointer-events-none absolute inset-0 size-full", className)}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid meet"
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

/* ---- character line-art -------------------------------------------- */

/** Side-profile engineer, chin up, hands in pockets, gear-loaded backpack. */
function Figure({ x, y, scale = 1, flip = false }: { x: number; y: number; scale?: number; flip?: boolean }) {
  return (
    <g
      className="doodle-float-a"
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      stroke="var(--ink)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      {/* hair bun + back hair */}
      <path className="doodle-draw" style={D(0.05)} d="M58 30a13 13 0 1 1 20 10" stroke="var(--magenta)" />
      <path className="doodle-draw" style={D(0.15)} d="M66 40c-8 12-11 26-8 40l6 14" stroke="var(--magenta)" />
      {/* head profile, tilted up */}
      <path
        className="doodle-draw"
        style={D(0.2)}
        d="M70 46c4-14 18-22 32-18 13 4 20 16 18 30-1 8-5 12-4 18l-6 4-2 10-14 4c-16 0-28-16-24-48z"
        stroke="var(--ink)"
      />
      <path className="doodle-draw" style={D(0.45)} d="M112 62l6 4-6 5" stroke="var(--coral)" strokeWidth="2" />
      <path className="doodle-draw" style={D(0.5)} d="M100 50c4-2 8-1 10 2" stroke="var(--ink)" strokeWidth="2" />
      {/* collar + hoodie body */}
      <path className="doodle-draw" style={D(0.55)} d="M74 96c12 10 30 10 40-2" stroke="var(--coral)" />
      <path
        className="doodle-draw"
        style={D(0.6)}
        d="M76 100c-18 6-27 22-29 42l-6 60c-1 12 5 19 16 21 21 4 45 4 63-2 9-3 13-10 12-19l-9-64c-2-19-11-31-26-37"
      />
      {/* arm, hand in pocket */}
      <path className="doodle-draw" style={D(0.8)} d="M60 148c-7 27-7 54 2 76 4 10 13 14 24 12" stroke="var(--coral)" />
      {/* backpack + gear */}
      <g stroke="var(--magenta)">
        <path className="doodle-draw" style={D(0.9)} d="M40 116c-13 3-20 13-20 27v66c0 13 8 21 21 21l14-2" />
        <path className="doodle-draw" style={D(1)} d="M30 150h26M30 182h26" strokeWidth="2" />
        <circle className="doodle-twinkle-b" cx="20" cy="140" r="6" fill="var(--amber)" stroke="none" />
        <path className="doodle-draw" style={D(1.1)} d="M16 196h12v14H16zM14 218l10 12" strokeWidth="2" />
      </g>
      {/* shorts */}
      <path className="doodle-draw" style={D(1.15)} d="M48 232l-2 58c0 7 4 11 11 11h58c8 0 12-6 11-15l-7-54" stroke="var(--ink)" />
      <path className="doodle-draw" style={D(1.25)} d="M86 301v-58" stroke="var(--coral)" strokeWidth="2" />
      {/* legs */}
      <path className="doodle-draw" style={D(1.3)} d="M62 301l-3 88 4 62M110 301l6 86-3 64" />
      <path className="doodle-draw" style={D(1.45)} d="M52 372h20M104 368h20" stroke="var(--amber)" strokeWidth="2" />
      {/* boots */}
      <path className="doodle-draw" style={D(1.5)} d="M63 451c-16 4-26 10-26 17h44l4-17zM113 451c-14 5-22 10-22 17h44l3-17z" />
      {/* ground shadow */}
      <path className="doodle-draw" style={D(1.7)} d="M22 476h140" stroke="var(--coral)" strokeWidth="2" strokeDasharray="6 10" />
    </g>
  );
}

const analyst = (
  <>
    <Figure x={132} y={118} scale={0.76} />
    <g className="doodle-spin" style={{ transformOrigin: "980px 240px" }} opacity="0.4">
      <circle cx="980" cy="240" r="86" stroke="var(--amber)" strokeWidth="1.2" strokeDasharray="3 10" />
      <circle cx="980" cy="154" r="4" fill="var(--coral)" />
    </g>
    <g className="doodle-float-b" opacity="0.45" strokeLinecap="round">
      <path className="doodle-draw" style={D(0.7)} d="M700 560c130-40 250-30 360 40" stroke="var(--magenta)" strokeWidth="1.3" strokeDasharray="6 10" />
      <path className="doodle-draw" style={D(1)} d="M760 460h180M760 500h120" stroke="var(--coral)" strokeWidth="1.4" />
    </g>
    <Sparks />
  </>
);

const operator = (
  <>
    <Figure x={1076} y={130} scale={0.72} flip />
    <g className="doodle-float-a" opacity="0.48" strokeLinecap="round" strokeLinejoin="round">
      <path className="doodle-draw" style={D(0.3)} d="M120 220h260v160H120z" stroke="var(--magenta)" strokeWidth="1.5" />
      <path className="doodle-draw" style={D(0.7)} d="M156 268h150M156 302h110M156 336h180" stroke="var(--coral)" strokeWidth="1.4" />
      <path className="doodle-draw" style={D(1.1)} d="M100 412h300" stroke="var(--amber)" strokeWidth="1.4" strokeDasharray="5 9" />
    </g>
    <g className="doodle-spin-rev" style={{ transformOrigin: "560px 560px" }} opacity="0.32">
      <circle cx="560" cy="560" r="72" stroke="var(--magenta)" strokeWidth="1.1" strokeDasharray="3 11" />
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
  analyst,
  operator,

};
