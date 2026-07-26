import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { MessageCircle, X, Maximize2 } from "lucide-react";
import type { UIMessage } from "ai";

import { AdvisorChat } from "@/components/advisor/AdvisorChat";
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
            <AdvisorChat
              key={threadId}
              threadId={threadId}
              visitorId={visitorId}
              initialMessages={initialMessages}
              onActivity={() =>
                queryClient.invalidateQueries({ queryKey: ["advisor-threads", visitorId] })
              }
            />
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
        aria-label="Open the CyberSentinels AI Advisor"
        className={`brand-gradient fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-[1.03] ${
          open ? "hidden sm:inline-flex" : ""
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Ask the Advisor</span>
      </button>
    </>
  );
}
