import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { CtaLink } from "./CtaLink";
import { industries, legalLinks, pillars } from "@/content/site";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="ink-grid border-b border-ink-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="max-w-2xl font-display text-2xl font-semibold sm:text-3xl">
              Discuss your security, privacy or compliance requirement
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
              Share your objective, scope and timeline. We will help identify an appropriate
              starting point and engagement structure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaLink to="/contact">Book a Consultation</CtaLink>
            <CtaLink to="/contact" variant="ghost-dark">
              Request an Assessment
            </CtaLink>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-6 lg:px-8">
        <div className="lg:col-span-2">
          <Logo tone="dark" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            Cybersentinels Consulting delivers cybersecurity testing, governance and compliance,
            privacy and managed advisory services across India, the UAE and international
            engagements.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-ink-muted">
            India • UAE • International
          </p>
        </div>

        {pillars.map((p) => (
          <div key={p.url}>
            <h3 className="font-display text-sm font-semibold">{p.short}</h3>
            <div className="brand-rule mt-2 mb-3 w-7" />
            <ul className="space-y-2">
              <li>
                <FooterLink to={p.url}>Overview</FooterLink>
              </li>
              {p.services.slice(0, 6).map((s) => (
                <li key={s.url}>
                  <FooterLink to={s.url}>{s.title}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 border-t border-ink-border px-5 py-10 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-sm font-semibold">Industries</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <FooterLink to="/industries">Industries Overview</FooterLink>
            </li>
            {industries.map((i) => (
              <li key={i.url}>
                <FooterLink to={i.url}>{i.title}</FooterLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <FooterLink to="/about-us">About Cybersentinels</FooterLink>
            </li>
            <li>
              <FooterLink to="/services">All Services</FooterLink>
            </li>
            <li>
              <FooterLink to="/case-studies">Case Studies</FooterLink>
            </li>
            <li>
              <FooterLink to="/insights">Insights &amp; Resources</FooterLink>
            </li>
            <li>
              <FooterLink to="/careers">Careers</FooterLink>
            </li>
            <li>
              <FooterLink to="/contact">Contact</FooterLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Legal &amp; Trust</h3>
          <ul className="mt-3 space-y-2">
            {legalLinks.map((l) => (
              <li key={l.url}>
                <FooterLink to={l.url}>{l.title}</FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-border">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <p className="max-w-4xl text-xs leading-relaxed text-ink-muted">
            Cybersentinels Consulting provides advisory, assessment and implementation support.
            Certification, attestation and formal assessment outcomes are determined by the
            relevant independent body and are not guaranteed or implied by any service described
            on this website.
          </p>
          <p className="mt-4 text-xs text-ink-muted">
            © {year} Cybersentinels Consulting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-[13px] leading-snug text-ink-muted transition-colors hover:text-ink-foreground"
    >
      {children}
    </Link>
  );
}
