import { useEffect, useRef } from "react";

/**
 * Subtle iOS-style background parallax. Returns a ref to attach to a
 * decorative layer; the layer is translated a fraction of the distance
 * its section has scrolled, driven by a single rAF-throttled listener.
 *
 * Fully disabled under `prefers-reduced-motion` and when the device has
 * been flagged as low-end (`html[data-glass="off"]`).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.glass === "off") return;

    let frame = 0;
    let visible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(node);

    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = node.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      node.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return ref;
}
