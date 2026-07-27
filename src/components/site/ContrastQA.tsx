import { useCallback, useEffect, useState } from "react";

type Finding = { rule: string; target: string; summary: string };
type AuroraMode = "normal" | "max" | "off";

const MODES: { id: AuroraMode; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "max", label: "Max glow" },
  { id: "off", label: "No glow" },
];

/**
 * Visual QA helper. Append `?qa=contrast` to any URL to run an in-page
 * axe-core contrast pass: failing elements get a dashed outline and a
 * summary panel lists every pairing that misses AA. Dev-only, never
 * rendered in production builds.
 *
 * The aurora preview toggle forces every <AuroraBloom /> on the page to
 * full strength (or off) so text and buttons can be verified against the
 * worst-case glow before shipping a page.
 */
export function ContrastQA() {
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<AuroraMode>("normal");

  const active =
    typeof window !== "undefined" &&
    ["contrast", "aurora"].includes(
      new URLSearchParams(window.location.search).get("qa") ?? "",
    );

  const scan = useCallback(async () => {
    setBusy(true);
    document
      .querySelectorAll<HTMLElement>("[data-qa-outlined]")
      .forEach((el) => {
        el.style.outline = "";
        el.style.outlineOffset = "";
        el.removeAttribute("data-qa-outlined");
      });

    const axe = (await import("axe-core")).default;
    const result = await axe.run(document, {
      runOnly: ["color-contrast", "link-in-text-block"],
    });

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
          el.dataset.qaOutlined = "true";
        }
      }
    }
    setFindings(list);
    setBusy(false);
  }, []);

  // Apply the aurora preview mode to the document, then re-scan.
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    if (mode === "normal") root.removeAttribute("data-aurora-preview");
    else root.setAttribute("data-aurora-preview", mode);

    const t = window.setTimeout(() => void scan(), 260);
    return () => window.clearTimeout(t);
  }, [active, mode, scan]);

  useEffect(() => {
    return () => document.documentElement.removeAttribute("data-aurora-preview");
  }, []);

  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[10000] max-h-[45vh] w-80 overflow-auto rounded-xl border border-border bg-card p-4 shadow-lg"
    >
      <p className="type-eyebrow text-coral-ink">Contrast QA</p>

      <div className="mt-3 flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Aurora glow preview">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            aria-pressed={mode === m.id}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
              mode === m.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {busy || findings === null ? (
        <p className="mt-3 type-small text-muted-foreground">Scanning page…</p>
      ) : findings.length === 0 ? (
        <p className="mt-3 type-small text-muted-foreground">
          No AA contrast failures at “{MODES.find((m) => m.id === mode)?.label}”.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
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
