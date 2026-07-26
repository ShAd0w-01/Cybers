import { createServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";

export type AdvisorThread = {
  id: string;
  title: string;
  updated_at: string;
};

export const listThreads = createServerFn({ method: "POST" })
  .inputValidator((input: { visitorId: string }) => input)
  .handler(async ({ data }): Promise<AdvisorThread[]> => {
    const { advisorDb, assertUuid } = await import("@/lib/advisor.server");
    const db = advisorDb();
    const { data: rows, error } = await db
      .from("advisor_threads")
      .select("id, title, updated_at")
      .eq("visitor_id", assertUuid(data.visitorId, "visitor id"))
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (rows ?? []) as AdvisorThread[];
  });

export const createThread = createServerFn({ method: "POST" })
  .inputValidator((input: { visitorId: string }) => input)
  .handler(async ({ data }): Promise<AdvisorThread> => {
    const { advisorDb, assertUuid } = await import("@/lib/advisor.server");
    const db = advisorDb();
    const { data: row, error } = await db
      .from("advisor_threads")
      .insert({ visitor_id: assertUuid(data.visitorId, "visitor id") })
      .select("id, title, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return row as AdvisorThread;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .inputValidator((input: { visitorId: string; threadId: string }) => input)
  .handler(async ({ data }) => {
    const { advisorDb, assertThreadOwner } = await import("@/lib/advisor.server");
    await assertThreadOwner(data.threadId, data.visitorId);
    const { error } = await advisorDb()
      .from("advisor_threads")
      .delete()
      .eq("id", data.threadId)
      .eq("visitor_id", data.visitorId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "POST" })
  .inputValidator((input: { visitorId: string; threadId: string }) => input)
  .handler(async ({ data }): Promise<StoredMessage[]> => {
    const { advisorDb, assertThreadOwner } = await import("@/lib/advisor.server");
    await assertThreadOwner(data.threadId, data.visitorId);
    const { data: rows, error } = await advisorDb()
      .from("advisor_messages")
      .select("id, role, parts")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows ?? []).map((row) => ({
      id: String(row.id),
      role: String(row.role),
      parts: (row.parts ?? []) as Json[],
    }));
  });

/** Serializable row shape; cast to UIMessage on the client. */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type StoredMessage = { id: string; role: string; parts: Json[] };

export function toUiMessages(rows: StoredMessage[]): UIMessage[] {
  return rows.map((row) => ({
    id: row.id,
    role: row.role as UIMessage["role"],
    parts: row.parts as UIMessage["parts"],
  }));
}


/* ------------------------------------------------------------------ */
/* Events + analytics                                                   */
/* ------------------------------------------------------------------ */

/** Records a handoff (visitor clicking through to contact from the advisor). */
export const recordHandoff = createServerFn({ method: "POST" })
  .inputValidator((input: { visitorId: string; threadId: string | null; target: string }) => input)
  .handler(async ({ data }) => {
    const { assertUuid, logEvent, tagThread } = await import("@/lib/advisor.server");
    assertUuid(data.visitorId, "visitor id");
    await logEvent({
      threadId: data.threadId,
      visitorId: data.visitorId,
      type: "handoff",
      metadata: { target: data.target },
    });
    if (data.threadId) {
      await tagThread(data.threadId, {
        outcome: "handoff",
        handoffAt: new Date().toISOString(),
      });
    }
    return { ok: true };
  });

export type AdvisorAnalytics = {
  totals: {
    threads: number;
    messages: number;
    scoped: number;
    handoffs: number;
    rateLimited: number;
    signedIn: number;
  };
  successRate: number;
  handoffRate: number;
  topics: Array<{ topic: string; count: number }>;
  outcomes: Array<{ outcome: string; count: number }>;
  daily: Array<{ date: string; threads: number; handoffs: number }>;
};

/** Admin-only aggregate view of advisor conversations. */
export const getAdvisorAnalytics = createServerFn({ method: "POST" })
  .inputValidator((input: { days?: number }) => input)
  .handler(async ({ data, context }): Promise<AdvisorAnalytics> => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);

    const { advisorDb } = await import("@/lib/advisor.server");
    const db = advisorDb();
    const days = Math.min(Math.max(data.days ?? 30, 1), 365);
    const since = new Date(Date.now() - days * 86_400_000).toISOString();

    const [threadsRes, messagesRes, eventsRes] = await Promise.all([
      db
        .from("advisor_threads")
        .select("id, created_at, topics, outcome, handoff_at, user_id")
        .gte("created_at", since),
      db.from("advisor_messages").select("id", { count: "exact", head: true }).gte("created_at", since),
      db.from("advisor_events").select("type, created_at").gte("created_at", since),
    ]);
    if (threadsRes.error) throw new Error(threadsRes.error.message);

    const threads = (threadsRes.data ?? []) as Array<{
      id: string;
      created_at: string;
      topics: string[] | null;
      outcome: string;
      handoff_at: string | null;
      user_id: string | null;
    }>;
    const events = (eventsRes.data ?? []) as Array<{ type: string; created_at: string }>;

    const topicCounts = new Map<string, number>();
    const outcomeCounts = new Map<string, number>();
    const dayMap = new Map<string, { threads: number; handoffs: number }>();

    for (const thread of threads) {
      for (const topic of thread.topics ?? []) {
        topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
      }
      outcomeCounts.set(thread.outcome, (outcomeCounts.get(thread.outcome) ?? 0) + 1);
      const day = thread.created_at.slice(0, 10);
      const entry = dayMap.get(day) ?? { threads: 0, handoffs: 0 };
      entry.threads += 1;
      if (thread.handoff_at) entry.handoffs += 1;
      dayMap.set(day, entry);
    }

    const engaged = threads.filter((t) => t.outcome !== "open").length;
    const handoffs = threads.filter((t) => t.outcome === "handoff").length;
    const scoped = threads.filter((t) => t.outcome === "scoped" || t.outcome === "handoff").length;

    return {
      totals: {
        threads: threads.length,
        messages: messagesRes.count ?? 0,
        scoped,
        handoffs,
        rateLimited: events.filter((e) => e.type === "rate_limited").length,
        signedIn: threads.filter((t) => t.user_id).length,
      },
      successRate: threads.length ? Math.round((engaged / threads.length) * 100) : 0,
      handoffRate: threads.length ? Math.round((handoffs / threads.length) * 100) : 0,
      topics: [...topicCounts.entries()]
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count),
      outcomes: [...outcomeCounts.entries()].map(([outcome, count]) => ({ outcome, count })),
      daily: [...dayMap.entries()]
        .map(([date, value]) => ({ date, ...value }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  });

export const getMyAdminStatus = createServerFn({ method: "POST" }).handler(async ({ context }) => {
  const { isAdmin } = await import("@/lib/admin.server");
  return { isAdmin: await isAdmin(context.supabase, context.userId) };
});
