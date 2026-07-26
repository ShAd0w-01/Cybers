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

/* ------------------------------------------------------------------ */
/* Optional sign-in                                                     */
/* ------------------------------------------------------------------ */

/**
 * Resolves the signed-in user from the request bearer token, if any.
 * Sign-in is optional for the advisor: anonymous visitors still get a
 * (more tightly rate limited) conversation.
 */
export async function userFromRequest(request: Request): Promise<{
  id: string;
  email: string | null;
} | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

/* ------------------------------------------------------------------ */
/* Rate limiting                                                        */
/* ------------------------------------------------------------------ */

export const RATE_LIMITS = {
  anonymous: { hour: 15, day: 40 },
  signedIn: { hour: 60, day: 200 },
};

/**
 * Counts the visitor's own prompts in the trailing hour / day. The advisor has
 * no other abuse control, so this is what stops a single browser from burning
 * the gateway budget. Signed-in visitors get a higher allowance.
 */
export async function checkRateLimit(visitorId: string, userId: string | null) {
  const limits = userId ? RATE_LIMITS.signedIn : RATE_LIMITS.anonymous;
  const db = advisorDb();
  const since = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

  const countSince = async (iso: string) => {
    const { count, error } = await db
      .from("advisor_messages")
      .select("id", { count: "exact", head: true })
      .eq("role", "user")
      .eq("visitor_id", visitorId)
      .gte("created_at", iso);
    if (error) throw new Error(error.message);
    return count ?? 0;
  };

  const [hour, day] = await Promise.all([countSince(since(60)), countSince(since(60 * 24))]);

  if (hour >= limits.hour) {
    return {
      ok: false as const,
      retryAfterSeconds: 900,
      message: userId
        ? "You've reached the hourly message limit for the advisor. Please try again shortly."
        : "You've reached the hourly message limit. Sign in to continue with a higher allowance, or book a consultation.",
    };
  }
  if (day >= limits.day) {
    return {
      ok: false as const,
      retryAfterSeconds: 3600,
      message: userId
        ? "You've reached today's message limit for the advisor."
        : "You've reached today's message limit. Sign in for a higher allowance, or book a consultation with the team.",
    };
  }
  return { ok: true as const };
}

/* ------------------------------------------------------------------ */
/* Analytics tagging                                                    */
/* ------------------------------------------------------------------ */

/** Keyword → topic map used to label conversations for the analytics view. */
const TOPIC_RULES: Array<[string, RegExp]> = [
  ["VAPT & Penetration Testing", /\b(vapt|pen ?test|penetration|owasp|red team)\b/i],
  ["Application & API Security", /\b(web app|application|api|mobile app|source code)\b/i],
  ["Cloud & Infrastructure", /\b(cloud|aws|azure|gcp|network|infrastructure)\b/i],
  ["ISO Certification", /\biso[ /-]?\d{4,5}\b/i],
  ["SOC 2", /\bsoc ?2\b/i],
  ["PCI DSS", /\bpci\b/i],
  ["Privacy (DPDPA / GDPR)", /\b(dpdpa|gdpr|privacy|dpo|dpia|consent)\b/i],
  ["Regulatory (SEBI / CERT-In / CMMC)", /\b(sebi|cscrf|cert-?in|cmmc|rbi)\b/i],
  ["vCISO & Advisory", /\b(vciso|ciso|advisory|maturity|roadmap)\b/i],
  ["Third-party Risk", /\b(vendor|third[- ]party|tprm|supply chain)\b/i],
  ["Awareness & Training", /\b(training|awareness|phishing simulation)\b/i],
];

export function detectTopics(text: string): string[] {
  return TOPIC_RULES.filter(([, pattern]) => pattern.test(text)).map(([topic]) => topic);
}

export async function tagThread(
  threadId: string,
  updates: { topics?: string[]; outcome?: string; handoffAt?: string },
) {
  const db = advisorDb();
  const { data: current } = await db
    .from("advisor_threads")
    .select("topics, outcome")
    .eq("id", threadId)
    .maybeSingle();

  const rank: Record<string, number> = { open: 0, answered: 1, scoped: 2, handoff: 3 };
  const nextOutcome =
    updates.outcome && rank[updates.outcome] > (rank[current?.outcome as string] ?? 0)
      ? updates.outcome
      : (current?.outcome ?? "open");

  const topics = Array.from(
    new Set([...(((current?.topics as string[] | null) ?? []) as string[]), ...(updates.topics ?? [])]),
  );

  await db
    .from("advisor_threads")
    .update({
      topics,
      outcome: nextOutcome,
      ...(updates.handoffAt ? { handoff_at: updates.handoffAt } : {}),
    })
    .eq("id", threadId);
}

export async function logEvent(input: {
  threadId: string | null;
  visitorId: string;
  userId?: string | null;
  type: string;
  metadata?: Record<string, unknown>;
}) {
  await advisorDb().from("advisor_events").insert({
    thread_id: input.threadId,
    visitor_id: input.visitorId,
    user_id: input.userId ?? null,
    type: input.type,
    metadata: input.metadata ?? {},
  });
}
