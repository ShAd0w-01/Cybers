import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost-dark" | "link";

// Focus styling is inherited from the global focus-visible rule in styles.css
// so every link and button in the design shares one ring.
const base = "btn-base";

const styles: Record<Variant, string> = {
  primary: "btn-primary anim-glow",
  outline: "btn-secondary",
  "ghost-dark": "btn-quiet",
  link: "link-warm rounded-none px-0 py-0 hover:gap-3",
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
