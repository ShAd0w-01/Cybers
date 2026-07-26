import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Palette, RotateCcw, TriangleAlert, Wand2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminShell";
import { adminGetTheme, adminSaveTheme } from "@/lib/theme.functions";
import {
  adjustForContrast,
  contrastChecks,
  DEFAULT_THEME,
  FONT_OPTIONS,
  normaliseHex,
  themeCss,
  type SiteTheme,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/theme")({
  component: ThemeSettingsPage,
});

const COLOR_FIELDS: { key: keyof SiteTheme; label: string; help: string }[] = [
  { key: "color_ink", label: "Ink (dark bands)", help: "Hero, CTA and footer background" },
  { key: "color_magenta", label: "Brand magenta", help: "Gradient start" },
  { key: "color_coral", label: "Brand coral", help: "Buttons, focus ring, gradient mid" },
  { key: "color_coral_ink", label: "Accent text", help: "Coral text and links on light" },
  { key: "color_amber", label: "Brand amber", help: "Gradient end" },
  { key: "color_background", label: "Page background", help: "Base white surface" },
  { key: "color_surface", label: "Panel surface", help: "Alternating section background" },
  { key: "color_foreground", label: "Body text", help: "Primary text colour" },
  { key: "color_muted_foreground", label: "Muted text", help: "Secondary copy, captions" },
];

function ThemeSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const load = useServerFn(adminGetTheme);
  const save = useServerFn(adminSaveTheme);

  const query = useQuery({ queryKey: ["admin-theme"], queryFn: () => load() });
  const [draft, setDraft] = useState<SiteTheme>(DEFAULT_THEME);
  const [id, setId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (query.data) {
      setDraft(query.data.theme);
      setId(query.data.id);
    }
  }, [query.data]);

  const checks = useMemo(() => contrastChecks(draft), [draft]);
  const failing = checks.filter((c) => !c.passes);

  const mutation = useMutation({
    mutationFn: () => save({ data: { ...draft, id } }),
    onSuccess: (res) => {
      setId(res.id);
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["admin-theme"] });
      router.invalidate();
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const set = (key: keyof SiteTheme, value: string | number) =>
    setDraft((d) => ({ ...d, [key]: value }) as SiteTheme);

  function fixAllContrast() {
    setDraft((d) => ({
      ...d,
      color_foreground: adjustForContrast(d.color_foreground, d.color_background, 4.5),
      color_muted_foreground: adjustForContrast(d.color_muted_foreground, d.color_surface, 4.5),
      color_coral_ink: adjustForContrast(d.color_coral_ink, d.color_background, 4.5),
    }));
  }

  return (
    <div>
      <AdminHeader
        title="Theme settings"
        description="Update typography and brand colours for the whole website. Every change is checked against WCAG AA contrast rules before you publish it."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft(DEFAULT_THEME)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 type-button text-foreground hover:border-coral hover:text-coral-ink"
            >
              <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" /> Reset
            </button>
            <button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="brand-gradient inline-flex items-center gap-2 rounded-md px-4 py-2.5 type-button text-white disabled:opacity-60"
            >
              {saved ? (
                <Check className="size-4" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Palette className="size-4" strokeWidth={1.75} aria-hidden="true" />
              )}
              {mutation.isPending ? "Saving…" : saved ? "Saved" : "Save & publish"}
            </button>
          </div>
        }
      />

      {mutation.isError && (
        <p className="mb-5 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {(mutation.error as Error).message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          {/* Typography */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="type-h4 text-foreground">Typography</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Heading font">
                <select
                  value={draft.heading_font}
                  onChange={(e) => set("heading_font", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Body font">
                <select
                  value={draft.body_font}
                  onChange={(e) => set("body_font", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={`Base text size — ${draft.base_font_size}px`}>
                <input
                  type="range"
                  min={14}
                  max={20}
                  step={0.5}
                  value={draft.base_font_size}
                  onChange={(e) => set("base_font_size", Number(e.target.value))}
                  className="w-full accent-coral"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  16px or larger keeps body copy comfortably readable.
                </p>
              </Field>
              <Field label={`Heading scale — ${draft.heading_scale.toFixed(2)}×`}>
                <input
                  type="range"
                  min={0.85}
                  max={1.25}
                  step={0.01}
                  value={draft.heading_scale}
                  onChange={(e) => set("heading_scale", Number(e.target.value))}
                  className="w-full accent-coral"
                />
              </Field>
            </div>
          </section>

          {/* Colours */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="type-h4 text-foreground">Brand colours</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {COLOR_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-3">
                  <input
                    type="color"
                    aria-label={f.label}
                    value={normaliseHex(String(draft[f.key]))}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="size-11 shrink-0 cursor-pointer rounded-md border border-border bg-background"
                  />
                  <div className="min-w-0 flex-1">
                    <label className="block text-sm font-medium text-foreground">{f.label}</label>
                    <input
                      value={String(draft[f.key])}
                      onChange={(e) => set(f.key, e.target.value)}
                      onBlur={(e) => set(f.key, normaliseHex(e.target.value, DEFAULT_THEME[f.key] as string))}
                      className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 font-mono text-xs uppercase"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{f.help}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contrast audit */}
          <section className="rounded-xl border border-border bg-background p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="type-h4 text-foreground">WCAG AA contrast audit</h2>
              {failing.length > 0 && (
                <button
                  type="button"
                  onClick={fixAllContrast}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold text-coral-ink hover:border-coral"
                >
                  <Wand2 className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Fix text
                  colours to AA
                </button>
              )}
            </div>
            <ul className="mt-4 divide-y divide-border">
              {checks.map((c, i) => (
                <li key={`${c.label}-${i}`} className="flex items-center gap-3 py-2.5">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-xs font-bold"
                    style={{ background: c.bg, color: c.fg }}
                    aria-hidden="true"
                  >
                    Aa
                  </span>
                  <span className="min-w-0 flex-1 text-sm text-foreground">{c.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.ratio.toFixed(2)}:1
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                      c.passes
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {c.passes ? (
                      <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                      <TriangleAlert className="size-3" strokeWidth={2.5} aria-hidden="true" />
                    )}
                    {c.level}
                  </span>
                </li>
              ))}
            </ul>
            {failing.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {failing.length} pairing{failing.length > 1 ? "s" : ""} below AA. Saving is still
                allowed, but fix these before publishing to keep the site accessible.
              </p>
            )}
          </section>
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border">
            <style dangerouslySetInnerHTML={{ __html: scopedPreviewCss(draft) }} />
            <div className="theme-preview">
              <div className="tp-hero">
                <p className="tp-eyebrow">Live preview</p>
                <h3 className="tp-h">Security that stands up to audit</h3>
                <p className="tp-muted-dark">
                  VAPT, ISO 27001, SOC 2 and privacy programmes delivered end to end.
                </p>
                <span className="tp-btn">Book a consultation</span>
              </div>
              <div className="tp-body">
                <h4 className="tp-h4">Section heading</h4>
                <p className="tp-p">
                  Body copy renders in {draft.body_font} at {draft.base_font_size}px.
                </p>
                <p className="tp-muted">Muted caption text for supporting detail.</p>
                <a className="tp-link" href="#preview">
                  Accent link →
                </a>
                <div className="tp-panel">Surface panel</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

/** Preview styles are scoped so editing does not repaint the admin panel itself. */
function scopedPreviewCss(t: SiteTheme) {
  return `${themeCss(t).replace(":root{", ".theme-preview{").split("\n").slice(0, -5).join("\n")}
.theme-preview{font-family:"${t.body_font}",sans-serif;background:${t.color_background};}
.theme-preview .tp-hero{background:${t.color_ink};padding:1.75rem;}
.theme-preview .tp-eyebrow{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:${t.color_amber};}
.theme-preview .tp-h{font-family:"${t.heading_font}",sans-serif;font-weight:600;color:#fff;font-size:${1.5 * t.heading_scale}rem;line-height:1.2;margin:.5rem 0;}
.theme-preview .tp-muted-dark{color:#d9d9e0;font-size:${t.base_font_size * 0.85}px;}
.theme-preview .tp-btn{display:inline-block;margin-top:1rem;border-radius:.375rem;padding:.6rem 1rem;font-weight:600;font-size:.85rem;color:#fff;background-image:linear-gradient(135deg,${t.color_magenta},${t.color_coral} 52%,${t.color_amber});}
.theme-preview .tp-body{padding:1.75rem;}
.theme-preview .tp-h4{font-family:"${t.heading_font}",sans-serif;font-weight:600;color:${t.color_foreground};font-size:${1.05 * t.heading_scale}rem;}
.theme-preview .tp-p{color:${t.color_foreground};font-size:${t.base_font_size}px;margin-top:.4rem;}
.theme-preview .tp-muted{color:${t.color_muted_foreground};font-size:${t.base_font_size * 0.85}px;margin-top:.4rem;}
.theme-preview .tp-link{color:${t.color_coral_ink};font-weight:600;font-size:.9rem;display:inline-block;margin-top:.6rem;}
.theme-preview .tp-panel{margin-top:1rem;border-radius:.5rem;background:${t.color_surface};padding:.9rem;color:${t.color_muted_foreground};font-size:.85rem;}`;
}
