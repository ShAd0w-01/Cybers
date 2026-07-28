import * as React from "react";

/**
 * Mounts its children only once the placeholder scrolls near the viewport.
 * Heavy, below-the-fold blocks (third-party iframes, carousels, network
 * widgets) then cost nothing on first paint.
 */
export function Deferred({
  children,
  minHeight = 420,
  rootMargin = "400px",
}: {
  children: React.ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || show) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [show, rootMargin]);

  if (show) return <React.Suspense fallback={null}>{children}</React.Suspense>;
  return <div ref={ref} aria-hidden="true" style={{ minHeight }} />;
}
