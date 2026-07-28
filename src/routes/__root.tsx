import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CRITICAL_CSS } from "@/lib/critical-css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { StickyBookBar } from "@/components/site/StickyBookBar";
import { ContrastQA } from "@/components/site/ContrastQA";
import { GlassGuard } from "@/components/site/GlassGuard";

// The chat widget pulls in the AI SDK, so it is kept out of the first load
// and mounted once the browser is idle.
const AdvisorWidget = lazy(() =>
  import("@/components/advisor/AdvisorWidget").then((m) => ({ default: m.AdvisorWidget })),
);

function IdleAdvisor() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true));
      return () => (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(t);
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <AdvisorWidget />
    </Suspense>
  );
}



import { ThemeStyle } from "@/components/site/ThemeStyle";
import { getActiveTheme } from "@/lib/theme.functions";
import { DEFAULT_THEME, googleFontsHref } from "@/lib/theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="brand-gradient-text font-display text-7xl font-bold">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="brand-gradient inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="brand-gradient inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => ({ theme: await getActiveTheme() }),
  // The theme rarely changes; keep it out of every client-side navigation.
  staleTime: 5 * 60 * 1000,
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cybersecurity, Compliance & VAPT Services | Cybersentinels" },
      {
        name: "description",
        content:
          "Cybersentinels Consulting provides VAPT, ISO, SOC 2, privacy, vCISO, vDPO and managed GRC services across India, the UAE and beyond.",
      },
      { name: "author", content: "Cybersentinels Consulting" },
      { property: "og:site_name", content: "Cybersentinels Consulting" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      // The app stylesheet is fetched at high priority but does NOT block the
      // first paint — the inlined critical CSS below covers the first screen
      // and the script flips this link to `all` as soon as it is parsed.
      { rel: "preload", as: "style", href: appCss },
      {
        rel: "stylesheet",
        href: appCss,
        media: "print",
        "data-defer-css": "true",
      } as unknown as { rel: string; href: string },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Trimmed to the weights actually used; display=swap keeps text visible
      // while the font files download.
      {
        rel: "preload",
        as: "style",
        href: googleFontsHref(loaderData?.theme ?? DEFAULT_THEME),
      },
      {
        rel: "stylesheet",
        href: googleFontsHref(loaderData?.theme ?? DEFAULT_THEME),
        // Loaded as a non-blocking stylesheet: `media=print` keeps it out of
        // the critical path, the inline script below flips it on once ready.
        media: "print",
        "data-font-css": "true",
      } as unknown as { rel: string; href: string },

      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    styles: [{ children: CRITICAL_CSS }],
    scripts: [
      {
        children:
          "document.querySelectorAll('link[data-font-css],link[data-defer-css]').forEach(function(l){if(l.sheet){l.media='all';}else{l.addEventListener('load',function(){l.media='all';});}});",
      },

      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Cybersentinels Consulting",
          description:
            "Cybersecurity testing, governance and compliance, privacy and managed advisory services.",
          areaServed: ["India", "United Arab Emirates", "Worldwide"],
        }),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Without JS the deferred stylesheet never flips to media="all". */}
        <noscript>
          <link rel="stylesheet" href={appCss} />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { theme } = Route.useLoaderData();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeStyle theme={theme} />
      <GlassGuard />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
        <IdleAdvisor />
        <WhatsAppButton />
        <StickyBookBar />
        {import.meta.env.DEV ? <ContrastQA /> : null}


      </div>
    </QueryClientProvider>
  );
}
