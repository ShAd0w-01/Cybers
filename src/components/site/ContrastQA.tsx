import { useEffect, useState } from "react";

type Finding = { rule: string; target: string; summary: string };

/**
 * Visual QA helper. Append `?qa=contrast` to any URL to run an in-page
 * axe-core contrast pass: failing elements get a dashed outline and a
 * summary panel lists every pairing that misses AA. Dev-only, never
 * rendered in production builds.
 */
export function ContrastQA() {
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [busy, setBusy] = useState(false);

  const active =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("qa") === "contrast";

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    (async () => {
      setBusy(true);
      const axe = (await import("axe-core")).default;
      const result = await axe.run(document, {
        runOnly: ["color-contrast", "link-in-text-block"],
      });
      if (cancelled) return;

      const list: Finding[] = [];
      for (const v of result.violations) {
        for (const node of v.nodes) {
          list.push({
            rule: v.id,
            target: node.target.join(" "),
            summary: node.failureSummary ?? "",
          });
          const el = document.querySelector(String(node.target[0]));
          if (el instanceof HTMLElement) {
            el.style.outline = "2px dashed #d6006e";
            el.style.outlineOffset = "2px";
          }
        }
      }
      setFindings(list);
      setBusy(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[10000] max-h-[45vh] w-80 overflow-auto rounded-xl border border-border bg-card p-4 shadow-lg"
    >
      <p className="type-eyebrow text-coral-ink">Contrast QA</p>
      {busy || findings === null ? (
        <p className="mt-2 type-small text-muted-foreground">Scanning page…</p>
      ) : findings.length === 0 ? (
        <p className="mt-2 type-small text-muted-foreground">
          No AA contrast failures on this page.
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {findings.map((f, i) => (
            <li key={i} className="type-small text-muted-foreground">
              <span className="font-mono text-xs text-foreground">{f.target}</span>
              <br />
              {f.summary.split("\n")[1] ?? f.rule}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
