import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CaseStudyMetric = { value: string; label: string };
export type CaseStudyService = { title: string; url: string };

export type CaseStudyRow = {
  id: string;
  slug: string;
  sector: string;
  title: string;
  challenge: string;
  approach: string[];
  metrics: CaseStudyMetric[];
  outcome: string;
  services: CaseStudyService[];
  status: string;
  sort_order: number;
};

const COLUMNS =
  "id, slug, sector, title, challenge, approach, metrics, outcome, services, status, sort_order";

/** Public: published case studies, ordered for the website. */
export const listPublishedCaseStudies = createServerFn({ method: "GET" }).handler(async () => {
  const { publicDb } = await import("@/lib/public-db.server");
  const { data, error } = await publicDb()
    .from("case_studies")
    .select(COLUMNS)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as CaseStudyRow[];
});

/* ----------------------------- admin ----------------------------- */

export const adminListCaseStudies = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("case_studies")
      .select(COLUMNS)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as CaseStudyRow[];
  });

export type CaseStudyInput = {
  id?: string;
  slug: string;
  sector: string;
  title: string;
  challenge: string;
  approach: string[];
  metrics: CaseStudyMetric[];
  outcome: string;
  services: CaseStudyService[];
  status: "draft" | "published";
  sort_order: number;
};

function clean(input: CaseStudyInput) {
  const title = String(input.title ?? "").trim().slice(0, 220);
  if (!title) throw new Error("Title is required");
  const slug = String(input.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
  if (!slug) throw new Error("Slug is required");
  return {
    slug,
    title,
    sector: String(input.sector ?? "").slice(0, 200),
    challenge: String(input.challenge ?? "").slice(0, 4000),
    approach: (input.approach ?? []).slice(0, 12).map((a) => String(a).slice(0, 300)),
    metrics: (input.metrics ?? []).slice(0, 6).map((m) => ({
      value: String(m.value ?? "").slice(0, 40),
      label: String(m.label ?? "").slice(0, 120),
    })),
    outcome: String(input.outcome ?? "").slice(0, 4000),
    services: (input.services ?? []).slice(0, 8).map((s) => ({
      title: String(s.title ?? "").slice(0, 160),
      url: String(s.url ?? "").slice(0, 300),
    })),
    status: input.status === "draft" ? "draft" : "published",
    sort_order: Math.min(9999, Math.max(0, Number(input.sort_order) || 0)),
  };
}

export const adminSaveCaseStudy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CaseStudyInput) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const values = clean(data);
    if (data.id) {
      const { error } = await context.supabase
        .from("case_studies")
        .update(values)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: row, error } = await context.supabase
      .from("case_studies")
      .insert({ ...values, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const adminDeleteCaseStudy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("case_studies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
