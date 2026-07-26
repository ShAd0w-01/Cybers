import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquarePlus, Trash2 } from "lucide-react";

import { createThread, deleteThread, listThreads } from "@/lib/advisor.functions";

export function useAdvisorThreads(visitorId: string) {
  const list = useServerFn(listThreads);
  return useQuery({
    queryKey: ["advisor-threads", visitorId],
    queryFn: () => list({ data: { visitorId } }),
    enabled: Boolean(visitorId),
  });
}

export function ThreadSidebar({ visitorId }: { visitorId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: threads = [], isLoading } = useAdvisorThreads(visitorId);
  const create = useServerFn(createThread);
  const remove = useServerFn(deleteThread);
  const activePath = useRouterState({ select: (s) => s.location.pathname });

  const newChat = useMutation({
    mutationFn: () => create({ data: { visitorId } }),
    onSuccess: async (thread) => {
      await queryClient.invalidateQueries({ queryKey: ["advisor-threads", visitorId] });
      navigate({ to: "/ai-advisor/$threadId", params: { threadId: thread.id } });
    },
  });

  const del = useMutation({
    mutationFn: (threadId: string) => remove({ data: { visitorId, threadId } }),
    onSuccess: async (_data, threadId) => {
      await queryClient.invalidateQueries({ queryKey: ["advisor-threads", visitorId] });
      if (activePath.endsWith(threadId)) navigate({ to: "/ai-advisor" });
    },
  });

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-card/40 md:h-full md:w-72 md:border-b-0 md:border-r">
      <div className="p-3">
        <button
          type="button"
          onClick={() => newChat.mutate()}
          disabled={newChat.isPending}
          className="brand-gradient inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New conversation
        </button>
      </div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {isLoading ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">Loading conversations…</p>
        ) : threads.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">
            Your conversations are saved in this browser.
          </p>
        ) : (
          threads.map((thread) => {
            const active = activePath.endsWith(thread.id);
            return (
              <div
                key={thread.id}
                className={`flex items-center gap-1 rounded-lg pr-1 ${
                  active ? "bg-accent" : "hover:bg-accent/60"
                }`}
              >
                <Link
                  to="/ai-advisor/$threadId"
                  params={{ threadId: thread.id }}
                  className="min-w-0 flex-1 truncate px-3 py-2 text-sm text-foreground"
                >
                  {thread.title}
                </Link>
                <button
                  type="button"
                  aria-label={`Delete ${thread.title}`}
                  onClick={() => del.mutate(thread.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
