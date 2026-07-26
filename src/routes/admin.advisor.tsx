import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { AdminHeader } from "@/components/admin/AdminShell";
import { getAdvisorAnalytics } from "@/lib/advisor.functions";

export const Route = createFileRoute("/admin/advisor")({
  component: AdvisorTab,
});

function AdvisorTab() {
  const fn = useServerFn(getAdvisorAnalytics);
  const data = useQuery({
    queryKey: ["admin-advisor-analytics"],
    queryFn: () => fn({ data: { days: 30 } }),
  });

  const totals = data.data?.totals;

  return (
    <>
      <AdminHeader
        title="Advisor analytics"
        description="How visitors are using the AI advisor over the last 30 days."
      />
      {data.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {data.isError && (
        <p className="text-sm text-destructive">{(data.error as Error).message}</p>
      )}
      {totals && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(totals).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-border bg-background p-6">
              <p className="font-display text-3xl font-semibold text-foreground">{String(value)}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
              </p>
            </div>
          ))}
        </div>
      )}
      {data.data?.topics && (
        <div className="mt-8 rounded-xl border border-border bg-background p-6">
          <h2 className="type-h4 text-foreground">Top topics</h2>
          <ul className="mt-4 space-y-2">
            {data.data.topics.map((t) => (
              <li key={t.topic} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{t.topic}</span>
                <span className="text-muted-foreground">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
