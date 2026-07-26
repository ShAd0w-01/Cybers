import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";

import { AdvisorChat } from "@/components/advisor/AdvisorChat";
import { getThreadMessages, toUiMessages } from "@/lib/advisor.functions";
import { useVisitorId } from "./ai-advisor";

export const Route = createFileRoute("/ai-advisor/$threadId")({
  ssr: false,
  component: AdvisorThreadPage,
});

function AdvisorThreadPage() {
  const { threadId } = Route.useParams();
  const visitorId = useVisitorId();
  const queryClient = useQueryClient();
  const fetchMessages = useServerFn(getThreadMessages);

  const { data, isLoading, error } = useQuery({
    queryKey: ["advisor-messages", threadId, visitorId],
    queryFn: () => fetchMessages({ data: { threadId, visitorId } }),
    enabled: Boolean(visitorId && threadId),
    staleTime: Infinity,
  });

  if (!visitorId || isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-destructive">
        This conversation could not be loaded.
      </div>
    );
  }

  const initialMessages: UIMessage[] = toUiMessages(data ?? []);

  return (
    <AdvisorChat
      key={threadId}
      threadId={threadId}
      visitorId={visitorId}
      initialMessages={initialMessages}
      onActivity={() =>
        queryClient.invalidateQueries({ queryKey: ["advisor-threads", visitorId] })
      }
    />
  );
}
