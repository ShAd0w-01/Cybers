/**
 * HeroVisual — a lightweight, CSS-driven brand centerpiece for the homepage hero.
 * Uses the Cybersentinels three-arc mark as a slowly rotating orbital lockup.
 * Motion pauses automatically when the user prefers reduced motion.
 */
export function HeroVisual() {
  return (
    <div className="hero-visual relative mx-auto mb-10 flex size-48 items-center justify-center md:size-56" aria-hidden="true">
      {/* Soft ambient glow behind the mark */}
      <div className="hero-visual-glow absolute inset-0 rounded-full blur-2xl" />

      {/* Outer rotating ring */}
      <svg
        className="hero-visual-ring absolute inset-0 size-full"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle
          cx="100"
          cy="100"
          r="94"
          stroke="url(#ringGradient)"
          strokeWidth="1"
          strokeDasharray="12 18"
          opacity="0.35"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="var(--magenta)" />
            <stop offset="55%" stopColor="var(--coral)" />
            <stop offset="100%" stopColor="var(--amber)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Middle counter-rotating ring */}
      <svg
        className="hero-visual-ring-reverse absolute inset-4 size-[calc(100%-2rem)]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle
          cx="100"
          cy="100"
          r="86"
          stroke="url(#ringGradient2)"
          strokeWidth="1.5"
          strokeDasharray="28 14"
          opacity="0.45"
        />
        <defs>
          <linearGradient id="ringGradient2" x1="200" y1="0" x2="0" y2="200">
            <stop offset="0%" stopColor="var(--amber)" />
            <stop offset="45%" stopColor="var(--coral)" />
            <stop offset="100%" stopColor="var(--magenta)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central three-arc brand mark */}
      <div className="hero-visual-core relative flex size-28 items-center justify-center rounded-2xl border border-ink-border bg-ink-soft/60 backdrop-blur-sm md:size-32">
        <svg
          className="hero-visual-arc size-16 md:size-20"
          viewBox="0 0 120 120"
          fill="none"
        >
          {/* Three arc segments forming the brand circular mark */}
          <path
            d="M60 10 A50 50 0 0 1 108 42"
            stroke="url(#arcGradient)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M108 78 A50 50 0 0 1 60 110"
            stroke="url(#arcGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M12 78 A50 50 0 0 1 12 42"
            stroke="url(#arcGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.65"
          />
          <defs>
            <linearGradient id="arcGradient" x1="0" y1="0" x2="120" y2="120">
              <stop offset="0%" stopColor="var(--magenta)" />
              <stop offset="50%" stopColor="var(--coral)" />
              <stop offset="100%" stopColor="var(--amber)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle orbiting status dots */}
      <span className="hero-visual-particle absolute size-1.5 rounded-full bg-coral-ink shadow-[0_0_8px_var(--coral)]" />
      <span className="hero-visual-particle hero-visual-particle--second absolute size-1 rounded-full bg-amber shadow-[0_0_6px_var(--amber)]" />
    </div>
  );
}
