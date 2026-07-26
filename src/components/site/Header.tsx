import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { CtaLink } from "./CtaLink";
import { industries, pillars } from "@/content/site";
import { cn } from "@/lib/utils";

const resources = [
  { title: "Case Studies", url: "/case-studies" },
  { title: "Insights & Resources", url: "/insights" },
];

const about = [
  { title: "About Cybersentinels", url: "/about-us" },
  { title: "Careers", url: "/careers" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/92 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link to="/" aria-label="Cybersentinels Consulting — home" onClick={() => setMobile(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <TopLink to="/">Home</TopLink>
          <MenuTrigger label="Services" id="services" open={open} setOpen={setOpen}>
            <div className="grid grid-cols-4 gap-8 p-8">
              {pillars.map((p) => (
                <div key={p.url}>
                  <Link
                    to={p.url}
                    className="font-display text-sm font-semibold text-foreground hover:text-coral-ink"
                    onClick={() => setOpen(null)}
                  >
                    {p.title}
                  </Link>
                  <div className="brand-rule mt-2 mb-3 w-8" />
                  <ul className="space-y-1.5">
                    {p.services.map((svc) => (
                      <li key={svc.url}>
                        <Link
                          to={svc.url}
                          className="block text-[13px] leading-snug text-muted-foreground transition-colors hover:text-coral-ink"
                          onClick={() => setOpen(null)}
                        >
                          {svc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border bg-surface px-8 py-4">
              <p className="text-sm text-muted-foreground">
                36 specialized services across four connected practice areas.
              </p>
              <Link
                to="/services"
                className="text-sm font-semibold text-coral-ink"
                onClick={() => setOpen(null)}
              >
                View all services →
              </Link>
            </div>
          </MenuTrigger>
          <MenuTrigger label="Industries" id="industries" open={open} setOpen={setOpen} narrow>
            <SimpleList
              items={[{ title: "Industries Overview", url: "/industries" }, ...industries]}
              onNavigate={() => setOpen(null)}
            />
          </MenuTrigger>
          <MenuTrigger label="About" id="about" open={open} setOpen={setOpen} narrow>
            <SimpleList items={about} onNavigate={() => setOpen(null)} />
          </MenuTrigger>
          <MenuTrigger label="Resources" id="resources" open={open} setOpen={setOpen} narrow>
            <SimpleList items={resources} onNavigate={() => setOpen(null)} />
          </MenuTrigger>
          <TopLink to="/contact">Contact</TopLink>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CtaLink to="/contact" variant="outline" className="px-4 py-2.5">
            Request an Assessment
          </CtaLink>
          <CtaLink to="/contact" className="px-4 py-2.5">
            Book a Consultation
          </CtaLink>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium lg:hidden"
          aria-expanded={mobile}
          aria-label={mobile ? "Close menu" : "Open menu"}
          onClick={() => setMobile((v) => !v)}
        >
          {mobile ? <X className="size-4" /> : <Menu className="size-4" />}
          Menu
        </button>
      </div>

      {mobile ? (
        <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border bg-background px-5 pb-10 lg:hidden">
          <MobileGroup label="Services" state={mobileGroup} set={setMobileGroup}>
            {pillars.map((p) => (
              <div key={p.url} className="py-2">
                <Link
                  to={p.url}
                  className="font-display text-sm font-semibold"
                  onClick={() => setMobile(false)}
                >
                  {p.title}
                </Link>
                <ul className="mt-2 space-y-2 border-l border-border pl-3">
                  {p.services.map((svc) => (
                    <li key={svc.url}>
                      <Link
                        to={svc.url}
                        className="block text-[13px] text-muted-foreground"
                        onClick={() => setMobile(false)}
                      >
                        {svc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </MobileGroup>
          <MobileGroup label="Industries" state={mobileGroup} set={setMobileGroup}>
            <MobileList
              items={[{ title: "Industries Overview", url: "/industries" }, ...industries]}
              close={() => setMobile(false)}
            />
          </MobileGroup>
          <MobileGroup label="About" state={mobileGroup} set={setMobileGroup}>
            <MobileList items={about} close={() => setMobile(false)} />
          </MobileGroup>
          <MobileGroup label="Resources" state={mobileGroup} set={setMobileGroup}>
            <MobileList items={resources} close={() => setMobile(false)} />
          </MobileGroup>
          <Link
            to="/contact"
            className="block border-b border-border py-4 font-display text-sm font-semibold"
            onClick={() => setMobile(false)}
          >
            Contact
          </Link>
          <div className="mt-6 flex flex-col gap-3">
            <CtaLink to="/contact" onClick={() => setMobile(false)}>
              Book a Consultation
            </CtaLink>
            <CtaLink to="/contact" variant="outline">
              Request an Assessment
            </CtaLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function TopLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-coral-ink"
      activeProps={{ className: "text-coral-ink" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

function MenuTrigger({
  label,
  id,
  open,
  setOpen,
  children,
  narrow,
}: {
  label: string;
  id: string;
  open: string | null;
  setOpen: (v: string | null) => void;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  const isOpen = open === id;
  return (
    <div className="static" onMouseEnter={() => setOpen(id)}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isOpen ? "text-coral-ink" : "text-foreground/80 hover:text-coral-ink",
        )}
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        {label}
        <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen ? (
        <div
          className={cn(
            "absolute left-1/2 top-full z-50 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/8",
            narrow ? "w-72" : "w-[min(76rem,calc(100vw-3rem))]",
          )}
        >
          <div className="brand-gradient h-0.5 w-full" />
          {children}
        </div>
      ) : null}
    </div>
  );
}

function SimpleList({
  items,
  onNavigate,
}: {
  items: { title: string; url: string }[];
  onNavigate: () => void;
}) {
  return (
    <ul className="p-3">
      {items.map((i) => (
        <li key={i.url}>
          <Link
            to={i.url}
            className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-coral-ink"
            onClick={onNavigate}
          >
            {i.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MobileGroup({
  label,
  state,
  set,
  children,
}: {
  label: string;
  state: string | null;
  set: (v: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = state === label;
  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 font-display text-sm font-semibold"
        aria-expanded={isOpen}
        onClick={() => set(isOpen ? null : label)}
      >
        {label}
        <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen ? <div className="pb-4">{children}</div> : null}
    </div>
  );
}

function MobileList({
  items,
  close,
}: {
  items: { title: string; url: string }[];
  close: () => void;
}) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.url}>
          <Link to={i.url} className="block text-sm text-muted-foreground" onClick={close}>
            {i.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
