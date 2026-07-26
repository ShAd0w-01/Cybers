import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, ExternalLink, LogIn } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/useSession";
import { citationsFor } from "@/lib/citations";
import { exportThreadPdf } from "@/lib/exportPdf";
import { recordHandoff } from "@/lib/advisor.functions";

const STARTERS = [
  "We need a VAPT for our web app and API — where do we start?",
  "What does ISO 27001 certification actually involve?",
  "A customer is asking for SOC 2. What are our options?",
  "How do we get DPDPA ready before the deadline?",
];

type Props = {
  threadId: string;
  visitorId: string;
  initialMessages: UIMessage[];
  /** Called after the first user message so a thread list can refresh titles. */
  onActivity?: () => void;
  title?: string;
  className?: string;
};

export function AdvisorChat({
  threadId,
  visitorId,
  initialMessages,
  onActivity,
  title,
  className,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { user } = useSession();

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { threadId, visitorId },
      // Sign-in is optional; when present the bearer raises the rate limit and
      // links the conversation to the account.
      headers: async (): Promise<Record<string, string>> => {
        const { data } = await supabase.auth.getSession();
        return data.session ? { authorization: `Bearer ${data.session.access_token}` } : {};
      },

    }),
    onError: (err) => {
      const message = err.message || "The advisor is unavailable right now.";
      setRateLimited(/limit/i.test(message));
      setError(message);
    },
    onFinish: () => onActivity?.(),
  });

  const busy = status === "submitted" || status === "streaming";

  // Keep the composer focused on mount, after sending and when switching threads.
  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setError(null);
    setRateLimited(false);
    void sendMessage({ text: value });
  };

  const handoff = (target: string) => {
    void recordHandoff({ data: { visitorId, threadId, target } }).catch(() => {});
  };


  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className ?? ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
        <p className="text-xs text-muted-foreground">
          {user ? (
            <>Signed in as {user.email} — higher message allowance</>
          ) : (
            <>Guest session — sign in for a higher message allowance</>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={messages.length === 0}
            onClick={() => void exportThreadPdf(title ?? "Advisor conversation", messages)}
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
          {user ? null : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth" search={{ redirect: "/ai-advisor" }}>
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Conversation className="min-h-0 flex-1">

        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
          {messages.length === 0 ? (
            <div className="py-6">
              <Logo tone="light" />
              <h2 className="mt-5 font-display text-xl font-semibold text-foreground">
                Ask the CyberSentinels Advisor
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Get plain-English answers on testing, certification and privacy readiness — or let
                the advisor scope an assessment with you before you speak to the team.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="group rounded-xl border border-border bg-card/60 p-3 text-left text-sm text-foreground transition-colors hover:border-foreground/25 hover:bg-accent"
                  >
                    {s}
                    <ArrowRight className="mt-2 h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent
                className={
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground"
                }
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse>
                    );
                  }
                  if (part.type === "tool-find_services" || part.type === "tool-summarise_scope") {
                    const label =
                      part.type === "tool-find_services"
                        ? "Searching the service catalogue"
                        : "Building your scoping summary";
                    return part.state === "output-available" ? null : (
                      <Shimmer key={`${message.id}-${index}`} className="text-xs">
                        {`${label}…`}
                      </Shimmer>
                    );
                  }
                  return null;
                })}
              </MessageContent>
              {message.role === "assistant" && status !== "streaming" ? (
                <Sources citations={citationsFor(message)} />
              ) : null}
            </Message>
          ))}

          {status === "submitted" ? (
            <Shimmer className="text-sm">The advisor is typing…</Shimmer>
          ) : null}

          {error ? (
            <div role="alert" className="space-y-2 text-sm text-destructive">
              <p>{error}</p>
              <p className="text-muted-foreground">
                {rateLimited && !user ? (
                  <>
                    <Link to="/auth" search={{ redirect: "/ai-advisor" }} className="underline">
                      Sign in
                    </Link>{" "}
                    for a higher allowance, or{" "}
                  </>
                ) : null}
                <Link to="/contact" className="underline" onClick={() => handoff("error-contact")}>
                  contact the team
                </Link>
                .
              </p>
            </div>
          ) : null}

        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={(message, event) => {
              event.preventDefault();
              send(message.text ?? "");
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              placeholder="Ask about VAPT, ISO 27001, SOC 2, DPDPA, vCISO…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={busy} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-xs text-muted-foreground">
            AI-generated guidance. Never share credentials or confidential findings here.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Every answer cites the exact pages the advisor drew on. */
function Sources({ citations }: { citations: Array<{ title: string; url: string }> }) {
  if (!citations.length) return null;
  return (
    <div className="mt-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Sources
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
        {citations.map((citation) => (
          <li key={citation.url}>
            <a
              href={citation.url}
              className="inline-flex items-center gap-1 text-xs text-foreground underline underline-offset-2 hover:text-primary"
            >
              {citation.title}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
