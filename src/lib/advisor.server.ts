import { createClient } from "@supabase/supabase-js";
import type { UIMessage } from "ai";

/**
 * Service-role client. Visitors are anonymous (no Supabase auth), so RLS is
 * deny-all on the advisor tables and every query here MUST be scoped by
 * visitor_id explicitly.
 */
export function advisorDb() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function assertUuid(value: string, label: string) {
  if (!UUID.test(value)) throw new Error(`Invalid ${label}`);
  return value;
}

export async function assertThreadOwner(threadId: string, visitorId: string) {
  const db = advisorDb();
  const { data, error } = await db
    .from("advisor_threads")
    .select("id")
    .eq("id", assertUuid(threadId, "thread id"))
    .eq("visitor_id", assertUuid(visitorId, "visitor id"))
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Conversation not found");
  return data.id as string;
}

export async function saveMessage(
  threadId: string,
  visitorId: string,
  message: UIMessage,
) {
  const db = advisorDb();
  const { error } = await db.from("advisor_messages").insert({
    thread_id: threadId,
    visitor_id: visitorId,
    role: message.role,
    parts: message.parts ?? [],
  });
  if (error) throw new Error(error.message);
}

export function titleFrom(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New conversation";
  return clean.length > 60 ? `${clean.slice(0, 57)}…` : clean;
}

export function textOf(message: UIMessage) {
  return (message.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");
}
