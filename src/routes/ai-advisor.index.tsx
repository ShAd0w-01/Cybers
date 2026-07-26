import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";

import { createThread } from "@/lib/advisor.functions";
import { useVisitorId } from "./ai-advisor";

export const Route = createFileRoute("/ai-advisor/")({
  ssr: false,
  component: AdvisorIndex,
});

/**
 * Every conversation lives at its own /ai-advisor/:threadId URL, so the index
 * route just creates (or reuses) a thread and redirects to it.
 */
function AdvisorIndex() {
  const visitorId = useVisitorId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const create = useServerFn(createThread);

  const bootstrap = useMutation({
    mutationFn: () => create({ data: { visitorId } }),
    onSuccess: async (thread) => {
      await queryClient.invalidateQueries({ queryKey: ["advisor-threads", visitorId] });
      navigate({ to: "/ai-advisor/$threadId", params: { threadId: thread.id }, replace: true });
    },
  });

  useEffect(() => {
    if (visitorId && bootstrap.isIdle) bootstrap.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitorId]);

  return (
    <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
      Starting your conversation…
    </div>
  );
}
