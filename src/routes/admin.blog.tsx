import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminShell";
import {
  adminDeletePost,
  adminListPosts,
  adminSavePost,
  type BlogPost,
  type BlogPostInput,
} from "@/lib/blog.functions";

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdmin,
});

const blank: BlogPostInput = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  cover_image_url: "",
  tags: [],
  author: "CyberSentinels",
  read_minutes: 5,
  status: "draft",
  seo_title: "",
  meta_description: "",
};

const field = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

function BlogAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListPosts);
  const saveFn = useServerFn(adminSavePost);
  const deleteFn = useServerFn(adminDeletePost);

  const [draft, setDraft] = useState<(BlogPostInput & { id?: string }) | null>(null);

  const posts = useQuery({ queryKey: ["admin-posts"], queryFn: () => listFn() });

  const save = useMutation({
    mutationFn: () => saveFn({ data: draft! }),
    onSuccess: () => {
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const edit = (p: BlogPost) =>
    setDraft({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      cover_image_url: p.cover_image_url ?? "",
      tags: p.tags,
      author: p.author,
      read_minutes: p.read_minutes,
      status: p.status === "published" ? "published" : "draft",
      seo_title: p.seo_title ?? "",
      meta_description: p.meta_description ?? "",
    });

  if (draft) {
    const set = <K extends keyof BlogPostInput>(k: K, v: BlogPostInput[K]) =>
      setDraft((d) => ({ ...(d as BlogPostInput), [k]: v }));

    return (
      <>
        <AdminHeader
          title={draft.id ? "Edit post" : "New post"}
          description="Body supports simple markdown: ## heading, **bold**, - lists and [links](/services)."
          action={
            <button onClick={() => setDraft(null)} className="text-sm text-muted-foreground">
              Cancel
            </button>
          }
        />
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4 rounded-xl border border-border bg-background p-6">
            <Label text="Title">
              <input
                className={field}
                value={draft.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!draft.id && !draft.slug)
                    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
              />
            </Label>
            <Label text="URL slug">
              <input className={field} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
            </Label>
            <Label text="Excerpt">
              <textarea
                className={`${field} min-h-20`}
                value={draft.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
              />
            </Label>
            <Label text="Body">
              <textarea
                className={`${field} min-h-[420px] font-mono text-[13px]`}
                value={draft.body}
                onChange={(e) => set("body", e.target.value)}
              />
            </Label>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-background p-6">
            <Label text="Status">
              <select
                className={field}
                value={draft.status}
                onChange={(e) => set("status", e.target.value as "draft" | "published")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Label>
            <Label text="Author">
              <input className={field} value={draft.author} onChange={(e) => set("author", e.target.value)} />
            </Label>
            <Label text="Read time (minutes)">
              <input
                type="number"
                className={field}
                value={draft.read_minutes}
                onChange={(e) => set("read_minutes", Number(e.target.value))}
              />
            </Label>
            <Label text="Tags (comma separated)">
              <input
                className={field}
                value={draft.tags.join(", ")}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  )
                }
              />
            </Label>
            <Label text="Cover image URL">
              <input
                className={field}
                value={draft.cover_image_url ?? ""}
                onChange={(e) => set("cover_image_url", e.target.value)}
              />
            </Label>
            <Label text="SEO title">
              <input
                className={field}
                value={draft.seo_title ?? ""}
                onChange={(e) => set("seo_title", e.target.value)}
              />
            </Label>
            <Label text="Meta description">
              <textarea
                className={`${field} min-h-20`}
                value={draft.meta_description ?? ""}
                onChange={(e) => set("meta_description", e.target.value)}
              />
            </Label>

            {save.isError && (
              <p className="text-sm text-destructive">{(save.error as Error).message}</p>
            )}
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="brand-gradient w-full rounded-md px-4 py-2.5 type-button text-white disabled:opacity-60"
            >
              {save.isPending ? "Saving…" : "Save post"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Blog posts"
        description="Write, publish and unpublish articles. Published posts appear instantly on /blog."
        action={
          <button
            onClick={() => setDraft({ ...blank })}
            className="brand-gradient inline-flex items-center gap-2 rounded-md px-4 py-2.5 type-button text-white"
          >
            <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" /> New post
          </button>
        }
      />
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <ul className="divide-y divide-border">
          {(posts.data ?? []).map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <button className="text-left" onClick={() => edit(p)}>
                <p className="text-sm font-medium text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground">/blog/{p.slug}</p>
              </button>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide ${
                    p.status === "published"
                      ? "bg-coral/12 text-coral-ink"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {p.status}
                </span>
                <button
                  aria-label={`Delete ${p.title}`}
                  onClick={() => remove.mutate(p.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
          {posts.isSuccess && posts.data.length === 0 && (
            <li className="px-6 py-10 text-sm text-muted-foreground">
              No posts yet — create your first article.
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {text}
      </span>
      {children}
    </label>
  );
}
