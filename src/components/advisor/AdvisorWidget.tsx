import { Link, useRouterState } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, lazy, useEffect, useState } from "react";
import { MessageCircle, X, Maximize2 } from "lucide-react";
import type { UIMessage } from "ai";

// The chat surface pulls in the AI SDK and markdown/syntax renderers; it is
// only fetched once the visitor actually opens the panel.
const AdvisorChat = lazy(() =>
  import("@/components/advisor/AdvisorChat").then((m) => ({ default: m.AdvisorChat })),
);
import { createThread, getThreadMessages, listThreads, toUiMessages } from "@/lib/advisor.functions";
import { getVisitorId } from "@/lib/visitor";


/**
 * Sitewide launcher. It continues the visitor's most recent conversation and
 * links out to the full /ai-advisor workspace for thread management.
 */
export function AdvisorWidget() {
  const [open, setOpen] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const fetchMessages = useServerFn(getThreadMessages);

  useEffect(() => setVisitorId(getVisitorId()), []);

  const bootstrap = useMutation({
    mutationFn: async () => {
      const threads = await list({ data: { visitorId } });
      const latest = threads[0] ?? (await create({ data: { visitorId } }));
      const rows = threads[0]
        ? await fetchMessages({ data: { visitorId, threadId: latest.id } })
        : [];
      return { id: latest.id, messages: toUiMessages(rows) };
    },
    onSuccess: ({ id, messages }) => {
      setThreadId(id);
      setInitialMessages(messages);
      void queryClient.invalidateQueries({ queryKey: ["advisor-threads", visitorId] });
    },
  });

  useEffect(() => {
    if (open && visitorId && !threadId && bootstrap.isIdle) bootstrap.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, visitorId, threadId]);

  // The dedicated workspace already is the advisor; no floating duplicate there.
  if (pathname.startsWith("/ai-advisor")) return null;

  return (
    <>
      {open ? (
        <div className="fixed inset-x-3 bottom-3 z-50 flex h-[min(78vh,620px)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[420px]">
          <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold text-foreground">
                CyberSentinels Advisor
              </p>
              <p className="text-xs text-muted-foreground">Guidance & assessment scoping</p>
            </div>
            <div className="flex items-center gap-1">
              {threadId ? (
                <Link
                  to="/ai-advisor/$threadId"
                  params={{ threadId }}
                  onClick={() => setOpen(false)}
                  aria-label="Open full advisor workspace"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Maximize2 className="h-4 w-4" />
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close advisor"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {threadId && initialMessages ? (
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                  Loading the advisor…
                </div>
              }
            >
              <AdvisorChat
                key={threadId}
                threadId={threadId}
                visitorId={visitorId}
                initialMessages={initialMessages}
                onActivity={() =>
                  queryClient.invalidateQueries({ queryKey: ["advisor-threads", visitorId] })
                }
              />
            </Suspense>

          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Starting the advisor…
            </div>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(true)}
        // Warm the chat chunk on intent so the panel opens instantly.
        onPointerEnter={() => void import("@/components/advisor/AdvisorChat")}
        onFocus={() => void import("@/components/advisor/AdvisorChat")}
        aria-label="Open the CyberSentinels AI Advisor"
        title="Open the CyberSentinels AI Advisor"
        style={{ bottom: "calc(1rem + var(--sticky-book-h, 0px))" }}
        className={`brand-gradient advisor-pulse fixed right-4 z-40 inline-flex size-14 items-center justify-center rounded-full text-white shadow-[0_10px_28px_-10px_color-mix(in_oklab,var(--coral)_60%,transparent)] transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.44,1)] hover:scale-110 hover:shadow-[0_14px_36px_-10px_color-mix(in_oklab,var(--magenta)_65%,transparent)] active:scale-95 ${
          open ? "hidden sm:inline-flex" : ""
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="advisorIcon" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff8f5" />
            </linearGradient>
          </defs>
          {/* Bot head — centered in the 24×24 viewbox so it sits perfectly inside the circular button */}
          <rect
            x="4.5"
            y="7.5"
            width="15"
            height="12"
            rx="3"
            stroke="url(#advisorIcon)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 4v3.5"
            stroke="url(#advisorIcon)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="4" r="1.4" fill="url(#advisorIcon)" />
          <circle cx="9" cy="12" r="1.3" fill="url(#advisorIcon)" />
          <circle cx="15" cy="12" r="1.3" fill="url(#advisorIcon)" />
          <path
            d="M9 15c1.2 1.2 2.8 1.2 4 0"
            stroke="url(#advisorIcon)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
