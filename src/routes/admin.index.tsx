import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, LayoutTemplate, TrendingUp, Users } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminShell";
import { adminListLeads } from "@/lib/crm.functions";
import { adminListPosts } from "@/lib/blog.functions";
import { adminListPages } from "@/lib/cms.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const leadsFn = useServerFn(adminListLeads);
  const postsFn = useServerFn(adminListPosts);
  const pagesFn = useServerFn(adminListPages);

  const leads = useQuery({ queryKey: ["admin-leads"], queryFn: () => leadsFn() });
  const posts = useQuery({ queryKey: ["admin-posts"], queryFn: () => postsFn() });
  const pages = useQuery({ queryKey: ["admin-pages"], queryFn: () => pagesFn() });

  const openLeads = (leads.data ?? []).filter((l) => !["won", "lost"].includes(l.status)).length;
  const won = (leads.data ?? []).filter((l) => l.status === "won").length;

  const cards = [
    { label: "Total leads", value: leads.data?.length ?? "—", icon: Users, to: "/admin/leads" },
    { label: "Open pipeline", value: leads.isSuccess ? openLeads : "—", icon: TrendingUp, to: "/admin/leads" },
    {
      label: "Blog posts",
      value: posts.data ? `${posts.data.filter((p) => p.status === "published").length}/${posts.data.length}` : "—",
      icon: FileText,
      to: "/admin/blog",
    },
    { label: "Edited pages", value: pages.data?.length ?? "—", icon: LayoutTemplate, to: "/admin/pages" },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Everything happening across the website, the blog and the sales pipeline."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-xl border border-border bg-background p-6 transition-colors hover:border-coral"
          >
            <c.icon className="size-5 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
            <p className="mt-4 font-display text-3xl font-semibold text-foreground">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="type-h4 text-foreground">Latest enquiries</h2>
          <Link to="/admin/leads" className="text-sm font-medium text-coral-ink">
            View all →
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {(leads.data ?? []).slice(0, 6).map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {l.name} {l.company ? <span className="text-muted-foreground">· {l.company}</span> : null}
                </p>
                <p className="text-xs text-muted-foreground">{l.email}</p>
              </div>
              <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                {l.status}
              </span>
            </li>
          ))}
          {leads.isSuccess && leads.data.length === 0 && (
            <li className="px-6 py-8 text-sm text-muted-foreground">
              No enquiries yet. They will appear here as soon as the contact form is used.
            </li>
          )}
        </ul>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Won deals to date: <strong className="text-foreground">{leads.isSuccess ? won : "—"}</strong>
      </p>
    </>
  );
}
