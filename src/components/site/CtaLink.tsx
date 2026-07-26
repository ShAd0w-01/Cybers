import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost-dark" | "link";

// Focus styling is inherited from the global focus-visible rule in styles.css
// so every link and button in the design shares one ring.
const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 type-button transition-all duration-200";


const styles: Record<Variant, string> = {
  primary:
    "brand-gradient anim-glow text-white hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_color-mix(in_oklab,var(--coral)_70%,transparent)] active:translate-y-0",
  outline:
    "border border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-coral hover:text-coral-ink hover:shadow-[0_12px_28px_-14px_color-mix(in_oklab,var(--ink)_45%,transparent)] active:translate-y-0",
  "ghost-dark":
    "border border-ink-border bg-white/5 text-ink-foreground hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] active:translate-y-0",
  link: "px-0 py-0 text-coral-ink hover:gap-3",
};

export function CtaLink({
  to,
  children,
  variant = "primary",
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link to={to} className={cn(base, styles[variant], className)} onClick={onClick}>
      {children}
      {variant === "link" ? <span aria-hidden="true">→</span> : null}
    </Link>
  );
}

/** Maps an approved button label to the route it should carry the visitor to. */
export function routeForLabel(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("service") && (l.includes("explore") || l.includes("all") || l.includes("view")))
    return "/services";
  if (l.includes("cybersecurity testing")) return "/services/cybersecurity-testing-assurance";
  if (l.includes("compliance services")) return "/services/governance-risk-compliance";
  if (l.includes("privacy services")) return "/services/privacy-data-protection";
  if (l.includes("advisory") || l.includes("managed"))
    return "/services/advisory-risk-managed-services";
  if (l.includes("industr")) return "/industries";
  if (l.includes("case stud")) return "/case-studies";
  if (l.includes("insight") || l.includes("resource")) return "/insights";
  if (l.includes("about") || l.includes("approach")) return "/about-us";
  if (l.includes("career") || l.includes("role")) return "/careers";
  return "/contact";
}
