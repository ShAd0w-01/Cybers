import { useCallback, useEffect, useSyncExternalStore } from "react";

export type MotionPref = "system" | "reduced" | "full";

const KEY = "cs-motion-pref";
const listeners = new Set<() => void>();
let current: MotionPref = "system";
let hydrated = false;

function emit() {
  for (const l of listeners) l();
}

/** Writes the resolved verdict to `html[data-motion]` so CSS can react without re-rendering. */
function apply(pref: MotionPref) {
  if (typeof document === "undefined") return;
  const system = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reduced = pref === "reduced" || (pref === "system" && system);
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    const stored = window.localStorage.getItem(KEY) as MotionPref | null;
    if (stored === "reduced" || stored === "full" || stored === "system") current = stored;
    apply(current);
  }
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => {
    apply(current);
    emit();
  };
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onChange);
  };
}

export function useMotionPref() {
  const pref = useSyncExternalStore(
    subscribe,
    () => current,
    () => "system" as MotionPref,
  );

  const setPref = useCallback((next: MotionPref) => {
    current = next;
    window.localStorage.setItem(KEY, next);
    apply(next);
    emit();
  }, []);

  return { pref, setPref };
}

/** True when motion should be suppressed (user setting or OS preference). */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (current === "reduced") return true;
  if (current === "full") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reactive version for components that must branch in JSX. */
export function useReducedMotion() {
  const { pref } = useMotionPref();
  const [reduced, setReduced] = [
    prefersReducedMotion(),
    (_: boolean) => {},
  ] as const;
  useEffect(() => {}, [pref]);
  return reduced;
}
