import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminShell";
import {
  adminDeleteCaseStudy,
  adminListCaseStudies,
  adminSaveCaseStudy,
  type CaseStudyInput,
  type CaseStudyRow,
} from "@/lib/casestudies.functions";

export const Route = createFileRoute("/admin/case-studies")({
  component: CaseStudiesAdmin,
});

const field = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

const blank: CaseStudyInput = {
  slug: "",
  sector: "",
  title: "",
  challenge: "",
  approach: [],
  metrics: [],
  outcome: "",
  services: [],
  status: "draft",
  sort_order: 0,
};

const toLines = (v: string[]) => v.join("\n");
const fromLines = (v: string) =>
  v
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function CaseStudiesAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListCaseStudies);
  const saveFn = useServerFn(adminSaveCaseStudy);
  const deleteFn = useServerFn(adminDeleteCaseStudy);

  const [draft, setDraft] = useState<CaseStudyInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useQuery({ queryKey: ["admin-case-studies"], queryFn: () => listFn() });

  const save = useMutation({
    mutationFn: () => saveFn({ data: draft! }),
    onSuccess: () => {
      setDraft(null);
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin-case-studies"] });
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Could not save."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-case-studies"] }),
  });

  const edit = (c: CaseStudyRow) =>
    setDraft({
      id: c.id,
      slug: c.slug,
      sector: c.sector,
      title: c.title,
      challenge: c.challenge,
      approach: c.approach ?? [],
      metrics: c.metrics ?? [],
      outcome: c.outcome,
      services: c.services ?? [],
      status: c.status === "published" ? "published" : "draft",
      sort_order: c.sort_order,
    });

  const patch = (v: Partial<CaseStudyInput>) => setDraft((d) => (d ? { ...d, ...v } : d));

  return (
    <div>
      <AdminHeader
        title="Case studies"
        description="Write and publish the engagement stories shown on the Case Studies page."
        action={
          <button
            onClick={() => setDraft({ ...blank })}
            className="brand-gradient inline-flex items-center gap-2 rounded-md px-4 py-2.5 type-button text-white"
          >
            <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" /> New case study
          </button>
        }
      />

      {error && (
        <p className="mb-5 rounded-lg border border-coral-ink/30 bg-coral-ink/5 px-4 py-3 text-sm text-coral-ink">
          {error}
        </p>
      )}

      {draft && (
        <form
          className="mb-8 grid gap-4 rounded-xl border border-border bg-background p-5"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Labeled label="Title">
              <input
                className={field}
                value={draft.title}
                onChange={(e) => patch({ title: e.target.value })}
                required
              />
            </Labeled>
            <Labeled label="Slug">
              <input
                className={field}
                value={draft.slug}
                onChange={(e) => patch({ slug: e.target.value })}
                placeholder="saas-soc2-readiness"
                required
              />
            </Labeled>
            <Labeled label="Sector / client descriptor">
              <input
                className={field}
                value={draft.sector}
                onChange={(e) => patch({ sector: e.target.value })}
              />
            </Labeled>
            <div className="grid grid-cols-2 gap-4">
              <Labeled label="Status">
                <select
                  className={field}
                  value={draft.status}
                  onChange={(e) =>
                    patch({ status: e.target.value === "published" ? "published" : "draft" })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Labeled>
              <Labeled label="Order">
                <input
                  type="number"
                  className={field}
                  value={draft.sort_order}
                  onChange={(e) => patch({ sort_order: Number(e.target.value) })}
                />
              </Labeled>
            </div>
          </div>

          <Labeled label="The challenge">
            <textarea
              className={`${field} min-h-24`}
              value={draft.challenge}
              onChange={(e) => patch({ challenge: e.target.value })}
            />
          </Labeled>

          <Labeled label="What we did (one bullet per line)">
            <textarea
              className={`${field} min-h-28`}
              value={toLines(draft.approach)}
              onChange={(e) => patch({ approach: fromLines(e.target.value) })}
            />
          </Labeled>

          <Labeled label="Outcome">
            <textarea
              className={`${field} min-h-24`}
              value={draft.outcome}
              onChange={(e) => patch({ outcome: e.target.value })}
            />
          </Labeled>

          <Labeled label="Metrics — one per line as value | label">
            <textarea
              className={`${field} min-h-24`}
              placeholder={"94% | Critical and high findings closed"}
              value={draft.metrics.map((m) => `${m.value} | ${m.label}`).join("\n")}
              onChange={(e) =>
                patch({
                  metrics: fromLines(e.target.value).map((line) => {
                    const [value, ...rest] = line.split("|");
                    return { value: (value ?? "").trim(), label: rest.join("|").trim() };
                  }),
                })
              }
            />
          </Labeled>

          <Labeled label="Services used — one per line as Title | /services/url">
            <textarea
              className={`${field} min-h-24`}
              placeholder={"SOC 2 Compliance Assistance | /services/soc-2-compliance-assistance"}
              value={draft.services.map((s) => `${s.title} | ${s.url}`).join("\n")}
              onChange={(e) =>
                patch({
                  services: fromLines(e.target.value).map((line) => {
                    const [title, ...rest] = line.split("|");
                    return { title: (title ?? "").trim(), url: rest.join("|").trim() };
                  }),
                })
              }
            />
          </Labeled>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={save.isPending}
              className="brand-gradient rounded-md px-4 py-2.5 type-button text-white disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Save case study"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-md border border-border px-4 py-2.5 text-sm text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-background">
        {rows.isLoading ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Loading case studies…</p>
        ) : rows.isError ? (
          <p className="px-5 py-8 text-sm text-coral-ink">Could not load case studies.</p>
        ) : (rows.data ?? []).length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">No case studies yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {(rows.data ?? []).map((c) => (
              <li
                key={c.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.status === "published" ? "Published" : "Draft"} · /{c.slug} · order{" "}
                    {c.sort_order}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => edit(c)}
                    className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-surface"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete “${c.title}”?`)) remove.mutate(c.id);
                    }}
                    aria-label={`Delete ${c.title}`}
                    className="rounded-md border border-border p-2 text-muted-foreground hover:text-coral-ink"
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
