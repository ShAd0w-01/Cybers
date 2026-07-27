import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarCheck, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { whatsapp } from "@/content/site";

/**
 * Mobile-only sticky consultation bar. Desktop keeps the header CTAs, so this
 * renders below the lg breakpoint only, and never on pages that already show
 * the booking form.
 */
const HIDDEN_ON = ["/contact", "/auth", "/admin", "/ai-advisor"];

/** Matches the rendered bar height so page content is never covered. */
const BAR_HEIGHT = "4.75rem";

export function StickyBookBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [show, setShow] = useState(false);

  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reserve space at the bottom of the document while the bar is visible so it
  // never sits on top of the footer, the WhatsApp launcher or page content.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sticky-book-h", hidden || !show ? "0px" : BAR_HEIGHT);
    return () => root.style.setProperty("--sticky-book-h", "0px");
  }, [hidden, show]);

  if (hidden) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 lg:hidden",
        "transition-transform duration-300 ease-out motion-reduce:transition-none",
        show ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!show}
    >
      <div className="glass-strong border-t border-border px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold text-foreground">
              Free 30-minute scoping call
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Pick a time — no obligation
            </p>
          </div>
          <a
            href={`tel:+${whatsapp.number}`}
            tabIndex={show ? 0 : -1}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-coral-ink"
            aria-label="Call CyberSentinels"
          >
            <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <Link
            to="/contact"
            hash="book"
            tabIndex={show ? 0 : -1}
            className="brand-gradient inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
          >
            <CalendarCheck className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
