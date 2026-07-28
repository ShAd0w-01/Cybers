import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const D = (delay: number) => ({ animationDelay: `${delay}s` } as CSSProperties);

/**
 * Rich, animated hero doodle layer.
 * Uses a tall viewBox so decorative accents land in the screen margins
 * under `xMidYMid slice` scaling. Dark ink strokes + brand-color accents
 * keep the shapes readable on the warm hero background.
 * Purely decorative — always aria-hidden.
 */
export function HeroDoodle({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        "hero-doodle pointer-events-none absolute inset-0 size-full",
        className,
      )}
      viewBox="0 0 1200 1600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Top-left floating orbit cluster */}
      <g className="doodle-float-a" opacity="0.92">
        <circle
          cx="130"
          cy="130"
          r="95"
          stroke="var(--ink)"
          strokeWidth="2.4"
          strokeDasharray="6 14"
          opacity="0.35"
        />
        <circle
          cx="130"
          cy="130"
          r="54"
          stroke="var(--magenta)"
          strokeWidth="2.8"
          opacity="0.9"
        />
        <circle cx="130" cy="76" r="9" fill="var(--amber)" />
        <path
          className="doodle-draw"
          style={D(0.2)}
          d="M130 130 L210 88"
          stroke="var(--coral)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          className="doodle-draw"
          style={D(0.5)}
          d="M130 130 L78 200"
          stroke="var(--magenta)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      {/* Top-right shield cluster */}
      <g className="doodle-float-b" opacity="0.94">
        <path
          className="doodle-draw"
          style={D(0.3)}
          d="M1035 125 L1110 82 L1185 125 L1185 210 L1110 253 L1035 210 Z"
          stroke="var(--coral)"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          className="doodle-draw"
          style={D(0.8)}
          d="M1072 175 L1098 201 L1152 148"
          stroke="var(--amber)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="1110" cy="253" r="8" fill="var(--magenta)" />
        <path
          className="doodle-draw"
          style={D(1.1)}
          d="M1110 253 L1110 350"
          stroke="var(--magenta)"
          strokeWidth="2.2"
          strokeDasharray="6 10"
          strokeLinecap="round"
        />
        <circle cx="1110" cy="366" r="8" fill="var(--coral)" />
      </g>

      {/* Bottom-left compliance / document motif */}
      <g className="doodle-float-a" opacity="0.88">
        <path
          className="doodle-draw"
          style={D(0.6)}
          d="M45 1285 L45 1455 L215 1455 L215 1365 L145 1285 Z"
          stroke="var(--ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <path
          className="doodle-draw"
          style={D(0.9)}
          d="M145 1285 L145 1365 L215 1365"
          stroke="var(--amber)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          className="doodle-draw"
          style={D(1.2)}
          d="M85 1360 L185 1360 M85 1390 L200 1390 M85 1420 L175 1420"
          stroke="var(--coral)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          className="doodle-draw"
          style={D(1.5)}
          d="M105 1475 L135 1505 L182 1455"
          stroke="var(--magenta)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Bottom-right connected nodes */}
      <g className="doodle-float-b" opacity="0.86">
        <circle cx="1065" cy="1325" r="10" fill="var(--amber)" />
        <circle cx="1165" cy="1405" r="9" fill="var(--coral)" />
        <circle cx="1030" cy="1440" r="9" fill="var(--magenta)" />
        <path
          className="doodle-draw"
          style={D(1.0)}
          d="M1065 1325 L1165 1405 M1165 1405 L1030 1440 M1030 1440 L1065 1325"
          stroke="var(--coral)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          className="doodle-draw"
          style={D(1.3)}
          d="M1210 1290 L1265 1350"
          stroke="var(--magenta)"
          strokeWidth="2"
          strokeDasharray="6 10"
          strokeLinecap="round"
        />
      </g>

      {/* Left mid accent */}
      <g className="doodle-float-b" opacity="0.8">
        <path
          className="doodle-draw"
          style={D(0.7)}
          d="M60 720 L60 900"
          stroke="var(--magenta)"
          strokeWidth="2.2"
          strokeDasharray="8 12"
          strokeLinecap="round"
        />
        <circle cx="60" cy="700" r="8" fill="var(--coral)" />
        <circle cx="60" cy="920" r="8" fill="var(--amber)" />
      </g>

      {/* Right mid accent */}
      <g className="doodle-float-a" opacity="0.8">
        <path
          className="doodle-draw"
          style={D(0.9)}
          d="M1140 720 L1140 900"
          stroke="var(--coral)"
          strokeWidth="2.2"
          strokeDasharray="8 12"
          strokeLinecap="round"
        />
        <circle cx="1140" cy="700" r="8" fill="var(--amber)" />
        <circle cx="1140" cy="920" r="8" fill="var(--magenta)" />
      </g>

      {/* Top-center sweeping arc (above headline) */}
      <g className="doodle-spin" style={{ transformOrigin: "600px 245px" }} opacity="0.7">
        <path
          d="M420 245 A180 180 0 0 1 780 245"
          stroke="var(--magenta)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="10 18"
        />
      </g>

      {/* Shooting sparks / stars */}
      <g className="doodle-twinkle" opacity="0.95">
        <path
          d="M270 75 L277 98 L300 105 L277 112 L270 135 L263 112 L240 105 L263 98 Z"
          fill="var(--amber)"
        />
        <path
          className="doodle-twinkle-b"
          d="M930 360 L937 383 L960 390 L937 397 L930 420 L923 397 L900 390 L923 383 Z"
          fill="var(--coral)"
        />
        <path
          className="doodle-twinkle-c"
          d="M210 1200 L217 1223 L240 1230 L217 1237 L210 1260 L203 1237 L180 1230 L203 1223 Z"
          fill="var(--magenta)"
        />
      </g>

      {/* Small orbiting dots */}
      <g className="doodle-spin-rev" style={{ transformOrigin: "1110px 168px" }} opacity="0.75">
        <circle cx="1110" cy="82" r="7" fill="var(--amber)" />
      </g>
      <g className="doodle-spin" style={{ transformOrigin: "130px 130px" }} opacity="0.75">
        <circle cx="130" cy="225" r="7" fill="var(--coral)" />
      </g>

      {/* Soft corner blobs for extra warmth */}
      <g className="doodle-float-a" opacity="0.55">
        <circle cx="70" cy="280" r="42" fill="var(--magenta)" opacity="0.22" />
        <circle cx="1135" cy="1180" r="48" fill="var(--coral)" opacity="0.2" />
      </g>
    </svg>
  );
}
