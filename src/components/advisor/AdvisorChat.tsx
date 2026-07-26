import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

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
  className?: string;
};

export function AdvisorChat({
  threadId,
  visitorId,
  initialMessages,
  onActivity,
  className,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { threadId, visitorId },
    }),
    onError: (err) => setError(err.message || "The advisor is unavailable right now."),
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
    void sendMessage({ text: value });
  };

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className ?? ""}`}>
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
            </Message>
          ))}

          {status === "submitted" ? <Shimmer className="text-sm">Thinking...</Shimmer> : null}

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}{" "}
              <Link to="/contact" className="underline">
                Contact the team instead
              </Link>
              .
            </p>
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
