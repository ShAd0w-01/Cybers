import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getAdvisorAnalytics, getMyAdminStatus } from "@/lib/advisor.functions";
import { useSession } from "@/lib/useSession";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/advisor-analytics")({
  // Session lives in browser storage, so this dashboard is client-rendered.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Advisor analytics | CyberSentinels" },
      {
        name: "description",
        content:
          "Admin dashboard for CyberSentinels AI Advisor conversations: topics, engagement, scoping and contact handoffs.",
      },
      { property: "og:title", content: "Advisor analytics | CyberSentinels" },
      {
        property: "og:description",
        content: "Topics, engagement and handoff outcomes for the CyberSentinels AI Advisor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { user, loading } = useSession();
  const adminStatus = useServerFn(getMyAdminStatus);
  const analytics = useServerFn(getAdvisorAnalytics);

  const admin = useQuery({
    queryKey: ["advisor-admin", user?.id],
    queryFn: () => adminStatus(),
    enabled: Boolean(user),
  });

  const data = useQuery({
    queryKey: ["advisor-analytics", user?.id],
    queryFn: () => analytics({ data: { days: 30 } }),
    enabled: Boolean(admin.data?.isAdmin),
  });

  if (loading) return <Shell>Loading…</Shell>;

  if (!user) {
    return (
      <Shell>
        <p className="text-muted-foreground">Advisor analytics is available to administrators.</p>
        <Button asChild className="mt-4">
          <Link to="/auth" search={{ redirect: "/advisor-analytics" }}>
            Sign in
          </Link>
        </Button>
      </Shell>
    );
  }

  if (admin.isLoading) return <Shell>Checking access…</Shell>;

  if (!admin.data?.isAdmin) {
    return (
      <Shell>
        <p className="text-muted-foreground">
          Your account doesn’t have administrator access to advisor analytics.
        </p>
      </Shell>
    );
  }

  const stats = data.data;

  return (
    <Shell>
      {data.isLoading || !stats ? (
        <p className="text-muted-foreground">Loading conversation data…</p>
      ) : (
        <div className="space-y-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Conversations (30d)" value={stats.totals.threads} />
            <Stat label="Messages" value={stats.totals.messages} />
            <Stat label="Engagement rate" value={`${stats.successRate}%`} />
            <Stat label="Contact handoffs" value={`${stats.totals.handoffs} (${stats.handoffRate}%)`} />
            <Stat label="Scoped assessments" value={stats.totals.scoped} />
            <Stat label="Signed-in conversations" value={stats.totals.signedIn} />
            <Stat label="Rate-limited attempts" value={stats.totals.rateLimited} />
          </div>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Top topics</h2>
            <ul className="mt-4 space-y-2">
              {stats.topics.length === 0 ? (
                <li className="text-sm text-muted-foreground">No tagged topics yet.</li>
              ) : (
                stats.topics.map((topic) => {
                  const max = stats.topics[0].count || 1;
                  return (
                    <li key={topic.topic} className="flex items-center gap-3">
                      <span className="w-64 shrink-0 text-sm text-foreground">{topic.topic}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${(topic.count / max) * 100}%` }}
                        />
                      </span>
                      <span className="w-10 text-right text-sm tabular-nums text-muted-foreground">
                        {topic.count}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Outcomes</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {stats.outcomes.map((outcome) => (
                <span
                  key={outcome.outcome}
                  className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
                >
                  {outcome.outcome}: <strong className="tabular-nums">{outcome.count}</strong>
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Daily volume</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Conversations</th>
                  <th className="py-2 font-medium">Handoffs</th>
                </tr>
              </thead>
              <tbody>
                {stats.daily.map((day) => (
                  <tr key={day.date} className="border-b border-border/60">
                    <td className="py-2 text-foreground">{day.date}</td>
                    <td className="py-2 tabular-nums text-foreground">{day.threads}</td>
                    <td className="py-2 tabular-nums text-foreground">{day.handoffs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-foreground">Advisor analytics</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last 30 days of AI Advisor conversations — topics, engagement and handoffs to the contact
        team.
      </p>
      <div className="mt-8">{children}</div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}
