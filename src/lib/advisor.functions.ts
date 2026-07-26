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

