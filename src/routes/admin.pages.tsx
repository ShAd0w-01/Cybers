import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminShell";
import { allRoutes, getPageMeta } from "@/content/site";
import { draftToSections, sectionsToDraft } from "@/lib/section-text";
import {
  adminDeletePage,
  adminListPages,
  adminSavePage,
  type SitePage,
} from "@/lib/cms.functions";

export const Route = createFileRoute("/admin/pages")({
  component: PagesAdmin,
});

const field = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

type Draft = {
  url: string;
  name: string;
  seo_title: string;
  meta_description: string;
  is_published: boolean;
  sections: Array<{ heading: string; text: string }>;
};

function PagesAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListPages);
  const saveFn = useServerFn(adminSavePage);
  const deleteFn = useServerFn(adminDeletePage);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [query, setQuery] = useState("");

  const pages = useQuery({ queryKey: ["admin-pages"], queryFn: () => listFn() });

  const save = useMutation({
    mutationFn: () =>
      saveFn({
        data: {
          url: draft!.url,
          name: draft!.name,
          seo_title: draft!.seo_title || null,
          meta_description: draft!.meta_description || null,
          is_published: draft!.is_published,
          sections: draftToSections(draft!.sections),
        },
      }),
    onSuccess: () => {
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-pages"] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-pages"] }),
  });

  const overrides = useMemo(
    () => new Map((pages.data ?? []).map((p) => [p.url, p])),
    [pages.data],
  );

  const routes = useMemo(
    () => allRoutes.filter((r) => r.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  const openRoute = (url: string) => {
    const existing = overrides.get(url);
    if (existing) return openOverride(existing);
    setDraft({
      url,
      name: getPageMeta(url)?.name ?? url,
      seo_title: getPageMeta(url)?.seoTitle ?? "",
      meta_description: getPageMeta(url)?.metaDescription ?? "",
      is_published: true,
      sections: [{ heading: "Hero", text: "" }],
    });
  };

  const openOverride = (p: SitePage) =>
    setDraft({
      url: p.url,
      name: p.name,
      seo_title: p.seo_title ?? "",
      meta_description: p.meta_description ?? "",
      is_published: p.is_published,
      sections: sectionsToDraft(p.sections ?? []),
    });

  if (draft) {
    const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
      setDraft((d) => ({ ...(d as Draft), [k]: v }));

    return (
      <>
        <AdminHeader
          title={`Editing ${draft.url}`}
          description="Saved content replaces the built-in copy for this page. Unpublish to fall back to the original."
          action={
            <button onClick={() => setDraft(null)} className="text-sm text-muted-foreground">
              Cancel
            </button>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            {draft.sections.map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center gap-3">
                  <input
                    className={field}
                    value={s.heading}
                    aria-label={`Section ${i + 1} heading`}
                    placeholder="Section heading (e.g. Hero, What we do)"
                    onChange={(e) =>
                      set(
                        "sections",
                        draft.sections.map((x, j) =>
                          j === i ? { ...x, heading: e.target.value } : x,
                        ),
                      )
                    }
                  />
                  <button
                    aria-label={`Remove section ${i + 1}`}
                    onClick={() =>
                      set(
                        "sections",
                        draft.sections.filter((_, j) => j !== i),
                      )
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
                <textarea
                  className={`${field} mt-3 min-h-52 font-mono text-[13px]`}
                  value={s.text}
                  aria-label={`Section ${i + 1} content`}
                  onChange={(e) =>
                    set(
                      "sections",
                      draft.sections.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)),
                    )
                  }
                />
              </div>
            ))}
            <button
              onClick={() => set("sections", [...draft.sections, { heading: "", text: "" }])}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
            >
              <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" /> Add section
            </button>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-background p-6">
            <p className="rounded-lg bg-surface p-3 text-xs leading-relaxed text-muted-foreground">
              Formatting: <code># Heading</code>, <code>## Sub-heading</code>, <code>- bullet</code>,{" "}
              <code>[Button label]</code>, <code>&gt; Label: Value</code>. Anything else becomes a
              paragraph.
            </p>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Page name
              </span>
              <input className={field} value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                SEO title
              </span>
              <input
                className={field}
                value={draft.seo_title}
                onChange={(e) => set("seo_title", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Meta description
              </span>
              <textarea
                className={`${field} min-h-24`}
                value={draft.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draft.is_published}
                onChange={(e) => set("is_published", e.target.checked)}
              />
              Published (live on the website)
            </label>
            {save.isError && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="brand-gradient w-full rounded-md px-4 py-2.5 type-button text-white disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Save page"}
            </button>
            <a
              href={draft.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Preview page
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Website content"
        description="Edit the copy of any of the site's pages. Pages you have not edited keep their original content."
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages by URL…"
        aria-label="Search pages"
        className="mb-5 w-80 rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <ul className="divide-y divide-border">
          {routes.map((url) => {
            const override = overrides.get(url);
            return (
              <li key={url} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
                <button className="text-left" onClick={() => openRoute(url)}>
                  <p className="text-sm font-medium text-foreground">
                    {getPageMeta(url)?.name ?? url}
                  </p>
                  <p className="text-xs text-muted-foreground">{url}</p>
                </button>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide ${
                      override
                        ? override.is_published
                          ? "bg-coral/12 text-coral-ink"
                          : "border border-border text-muted-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {override ? (override.is_published ? "edited" : "draft") : "original"}
                  </span>
                  {override && (
                    <button
                      aria-label={`Reset ${url} to original content`}
                      onClick={() => remove.mutate(override.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
