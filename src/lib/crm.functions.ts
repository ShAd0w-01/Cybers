import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  service_interest: string | null;
  source: string;
  status: string;
  priority: string;
  estimated_value: number | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
};

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;
export const LEAD_PRIORITIES = ["low", "medium", "high"] as const;

const COLUMNS =
  "id, name, email, phone, company, message, service_interest, source, status, priority, estimated_value, next_follow_up, created_at, updated_at";

export type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service_interest?: string;
  source?: string;
};

/** Public: website contact form / advisor handoff creates a lead. */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: LeadInput) => input)
  .handler(async ({ data }) => {
    const name = String(data.name ?? "").trim().slice(0, 120);
    const email = String(data.email ?? "").trim().slice(0, 255);
    const message = String(data.message ?? "").trim().slice(0, 4000);
    if (!name) throw new Error("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("Please enter a valid email.");
    if (!message) throw new Error("Please tell us briefly what you need.");

    const { publicDb } = await import("@/lib/public-db.server");
    const { error } = await publicDb()
      .from("crm_leads")
      .insert({
        name,
        email,
        message,
        phone: String(data.phone ?? "").trim().slice(0, 40) || null,
        company: String(data.company ?? "").trim().slice(0, 160) || null,
        service_interest: String(data.service_interest ?? "").slice(0, 160) || null,
        source: String(data.source ?? "website").slice(0, 60),
      });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ----------------------------- admin ----------------------------- */

export const adminListLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("crm_leads")
      .select(COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  });

export const adminUpdateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id: string;
      status?: string;
      priority?: string;
      estimated_value?: number | null;
      next_follow_up?: string | null;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const patch: {
      status?: string;
      priority?: string;
      estimated_value?: number | null;
      next_follow_up?: string | null;
    } = {};
    if (data.status && (LEAD_STATUSES as readonly string[]).includes(data.status))
      patch.status = data.status;
    if (data.priority && (LEAD_PRIORITIES as readonly string[]).includes(data.priority))
      patch.priority = data.priority;
    if (data.estimated_value !== undefined) patch.estimated_value = data.estimated_value;
    if (data.next_follow_up !== undefined) patch.next_follow_up = data.next_follow_up || null;
    const { error } = await context.supabase.from("crm_leads").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("crm_leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type LeadNote = { id: string; body: string; created_at: string };

export const adminListNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { leadId: string }) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const { data: rows, error } = await context.supabase
      .from("crm_lead_notes")
      .select("id, body, created_at")
      .eq("lead_id", data.leadId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []) as LeadNote[];
  });

export const adminAddNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { leadId: string; body: string }) => input)
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    const body = String(data.body ?? "").trim().slice(0, 4000);
    if (!body) throw new Error("Note cannot be empty.");
    const { error } = await context.supabase
      .from("crm_lead_notes")
      .insert({ lead_id: data.leadId, body, author_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
