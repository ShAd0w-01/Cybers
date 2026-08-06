import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Palette,
  ShieldCheck,
  Users,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/useSession";
import { getMyAdminStatus } from "@/lib/advisor.functions";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "CRM — Leads", icon: Users },
  { to: "/admin/blog", label: "Blog posts", icon: FileText },
  { to: "/admin/case-studies", label: "Case studies", icon: BookOpen },
  { to: "/admin/pages", label: "Website content", icon: LayoutTemplate },
  { to: "/admin/theme", label: "Theme settings", icon: Palette },
  { to: "/admin/advisor", label: "Advisor analytics", icon: BarChart3 },
  { to: "/admin/access", label: "Admin access", icon: ShieldCheck },
];

export function AdminShell({ children }: { children?: React.ReactNode }) {
  const { user, loading } = useSession();
  const adminStatus = useServerFn(getMyAdminStatus);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const admin = useQuery({
    queryKey: ["admin-status", user?.id],
    queryFn: () => adminStatus(),
    enabled: Boolean(user),
  });

  if (loading || (user && admin.isLoading)) return <Gate>Checking your access…</Gate>;

  if (!user) {
    return (
      <Gate>
        <p className="text-sm text-muted-foreground">You need to sign in to open the admin panel.</p>
        <Link
          to="/auth"
          className="brand-gradient mt-5 inline-flex rounded-md px-4 py-2.5 type-button text-white"
        >
          Sign in
        </Link>
      </Gate>
    );
  }

  if (!admin.data?.isAdmin) {
    return (
      <Gate>
        <p className="text-sm text-muted-foreground">
          This account ({user.email}) does not have administrator access yet.
        </p>
      </Gate>
    );
  }

  return (
    <div className="min-h-screen w-full bg-surface">
      <div className="mx-auto flex w-full max-w-[1500px] gap-0">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
          <div className="flex items-center gap-2 border-b border-border px-5 py-5">
            <ShieldCheck className="size-5 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
            <span className="font-display text-sm font-semibold text-foreground">
              CyberSentinels Admin
            </span>
          </div>
          <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-surface font-semibold text-coral-ink"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-3">
            <Link to="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
              ← Back to website
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-3.5" strokeWidth={1.75} aria-hidden="true" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex items-center gap-3 overflow-x-auto border-b border-border bg-background px-4 py-3 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="p-5 lg:p-8">{children ?? <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="max-w-sm rounded-xl border border-border bg-background p-8 text-center">
        <ShieldCheck className="mx-auto size-6 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
        <h1 className="type-h4 mt-4 text-foreground">Admin panel</h1>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="type-h3 text-foreground">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
