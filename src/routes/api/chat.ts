import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";
import { pillars, industries } from "@/content/site";

const catalogue = pillars
  .map(
    (p) =>
      `${p.title} (${p.url}) — ${p.intent}\n` +
      p.services.map((s) => `  - ${s.title} :: ${s.url}`).join("\n"),
  )
  .join("\n\n");

const systemPrompt = `You are the CyberSentinels Advisor, the AI assistant on the Cybersentinels Consulting website.

Cybersentinels Consulting delivers cybersecurity testing, governance/risk/compliance, privacy and managed advisory services across India, the UAE and international markets.

You do two jobs:
1. ADVISE — answer questions about cybersecurity, VAPT, ISO 27001/27701/22301/42001, SOC 2, PCI DSS, CMMC, SEBI CSCRF, DPDPA, GDPR, vCISO and vDPO in clear, practical language.
2. SCOPE — when someone is exploring an engagement, gather what is needed for an assessment: industry, company size, systems in scope (web apps, APIs, mobile, cloud, network), the driver (customer requirement, regulator, audit, incident), target timeline and region. Ask at most two questions per reply. Once you have enough, call the "summarise_scope" tool and then invite them to book a consultation at /contact.

Service catalogue (always link with these exact URLs):
${catalogue}

Industries: ${industries.map((i) => `${i.title} :: ${i.url}`).join(", ")}

Rules:
- Use the find_services tool before recommending services so links are accurate.
- Be concise; use short paragraphs and bullets. Markdown is rendered.
- Never quote prices, timelines in days, or guarantee certification outcomes — say the team confirms these on a scoping call.
- Never ask for credentials, secrets, live vulnerability details or personal data beyond a work email.
- If a question is outside cybersecurity, compliance or this company, say so briefly and steer back.`;

const allServices = pillars.flatMap((p) => [
  { title: p.title, url: p.url, pillar: p.title },
  ...p.services.map((s) => ({ title: s.title, url: s.url, pillar: p.title })),
]);

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          messages?: UIMessage[];
          threadId?: string;
          visitorId?: string;
        };
        const { messages, threadId, visitorId } = body;

        if (!Array.isArray(messages) || !threadId || !visitorId) {
          return new Response("messages, threadId and visitorId are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI is not configured", { status: 500 });

        const {
          advisorDb,
          assertThreadOwner,
          saveMessage,
          titleFrom,
          textOf,
        } = await import("@/lib/advisor.server");

        try {
          await assertThreadOwner(threadId, visitorId);
        } catch {
          return new Response("Conversation not found", { status: 404 });
        }

        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "user") {
          await saveMessage(threadId, visitorId, lastMessage);
          const db = advisorDb();
          const { count } = await db
            .from("advisor_messages")
            .select("id", { count: "exact", head: true })
            .eq("thread_id", threadId)
            .eq("role", "user");
          await db
            .from("advisor_threads")
            .update({
              updated_at: new Date().toISOString(),
              ...(count === 1 ? { title: titleFrom(textOf(lastMessage)) } : {}),
            })
            .eq("id", threadId)
            .eq("visitor_id", visitorId);
        }

        const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: systemPrompt,
          messages: await convertToModelMessages(messages),
          stopWhen: stepCountIs(50),
          tools: {
            find_services: tool({
              description:
                "Search the Cybersentinels service catalogue for services matching a need, framework or technology. Use before recommending anything.",
              inputSchema: z.object({
                query: z.string().describe("Keywords, e.g. 'API testing', 'SOC 2', 'DPDPA'"),
              }),
              execute: async ({ query }) => {
                const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
                const scored = allServices
                  .map((s) => ({
                    ...s,
                    score: terms.filter((t) => `${s.title} ${s.url}`.toLowerCase().includes(t))
                      .length,
                  }))
                  .filter((s) => s.score > 0)
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 6);
                return {
                  matches: (scored.length ? scored : allServices.slice(0, 6)).map(
                    ({ title, url, pillar }) => ({ title, url, pillar }),
                  ),
                };
              },
            }),
            summarise_scope: tool({
              description:
                "Record a structured assessment scoping summary once enough detail has been gathered.",
              inputSchema: z.object({
                industry: z.string(),
                companySize: z.string(),
                scope: z.array(z.string()).describe("Systems or assets in scope"),
                drivers: z.array(z.string()).describe("Why they need this now"),
                frameworks: z.array(z.string()),
                timeline: z.string(),
                region: z.string(),
                recommendedServices: z.array(z.object({ title: z.string(), url: z.string() })),
              }),
              execute: async (input) => ({
                ...input,
                nextStep: "Book a scoping consultation at /contact",
              }),
            }),
          },
          onError: ({ error }) => {
            console.error("advisor stream error", error);
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ responseMessage }) => {
            try {
              await saveMessage(threadId, visitorId, responseMessage);
              await advisorDb()
                .from("advisor_threads")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", threadId)
                .eq("visitor_id", visitorId);
            } catch (error) {
              console.error("advisor persistence error", error);
            }
          },
        });
      },
    },
  },
});
