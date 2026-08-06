import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, ShieldCheck, ShieldX, Trash2, UserPlus } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminShell";
import {
  adminCreateUser,
  adminDeleteUser,
  adminInviteUser,
  adminListAccess,
  adminSetRole,
} from "@/lib/access.functions";
import { useSession } from "@/lib/useSession";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/access")({
  component: AdminAccessPage,
});

function AdminAccessPage() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const list = useServerFn(adminListAccess);
  const setRole = useServerFn(adminSetRole);
  const invite = useServerFn(adminInviteUser);
  const remove = useServerFn(adminDeleteUser);
  const createUser = useServerFn(adminCreateUser);

  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const users = useQuery({ queryKey: ["admin-access"], queryFn: () => list() });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-access"] });
  const fail = (e: unknown) => setError(e instanceof Error ? e.message : "Something went wrong.");

  const roleMutation = useMutation({
    mutationFn: (v: { userId: string; grant: boolean }) =>
      setRole({ data: { userId: v.userId, role: "admin", grant: v.grant } }),
    onSuccess: (_d, v) => {
      setError(null);
      setNotice(v.grant ? "Administrator access granted." : "Administrator access removed.");
      refresh();
    },
    onError: fail,
  });

  const inviteMutation = useMutation({
    mutationFn: () => invite({ data: { email, makeAdmin: true } }),
    onSuccess: () => {
      setError(null);
      setNotice(`Invitation sent to ${email} with administrator access.`);
      setEmail("");
      refresh();
    },
    onError: fail,
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => remove({ data: { userId } }),
    onSuccess: () => {
      setError(null);
      setNotice("Account removed.");
      refresh();
    },
    onError: fail,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createUser({ data: { email: newEmail, password: newPassword, makeAdmin: true } }),
    onSuccess: () => {
      setError(null);
      setNotice(`Account created for ${newEmail} with administrator access.`);
      setNewEmail("");
      setNewPassword("");
      refresh();
    },
    onError: fail,
  });

  const rows = users.data ?? [];
  const admins = rows.filter((r) => r.roles.includes("admin"));

  return (
    <div>
      <AdminHeader
        title="Admin access"
        description="Control who can open the admin panel — invite teammates, grant or revoke administrator rights, and remove accounts."
      />

      {(error || notice) && (
        <div
          role="status"
          className={cn(
            "mb-6 rounded-lg border px-4 py-3 text-sm",
            error
              ? "border-coral-ink/30 bg-coral-ink/5 text-coral-ink"
              : "border-border bg-surface text-foreground",
          )}
        >
          {error ?? notice}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total accounts" value={rows.length} />
        <Stat label="Administrators" value={admins.length} />
        <Stat label="Standard users" value={rows.length - admins.length} />
      </div>

      <section className="mb-8 rounded-xl border border-border bg-background p-5">
        <h2 className="type-h5 flex items-center gap-2 text-foreground">
          <KeyRound className="size-4 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
          Create admin credentials
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Set an email and password yourself and share them with the person. The account is
          confirmed instantly and can sign in right away.
        </p>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <label className="sr-only" htmlFor="new-email">
            Email address
          </label>
          <input
            id="new-email"
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground"
          />
          <label className="sr-only" htmlFor="new-password">
            Password
          </label>
          <input
            id="new-password"
            type="text"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="brand-gradient rounded-md px-4 py-2.5 type-button text-white disabled:opacity-60"
          >
            {createMutation.isPending ? "Creating…" : "Create account"}
          </button>
        </form>
      </section>

      <section className="mb-8 rounded-xl border border-border bg-background p-5">
        <h2 className="type-h5 flex items-center gap-2 text-foreground">
          <UserPlus className="size-4 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
          Invite an administrator
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We email an invitation link. Once they set a password they can open the admin panel.
        </p>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            inviteMutation.mutate();
          }}
        >
          <label className="sr-only" htmlFor="invite-email">
            Email address
          </label>
          <input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground"
          />
          <button
            type="submit"
            disabled={inviteMutation.isPending}
            className="brand-gradient rounded-md px-4 py-2.5 type-button text-white disabled:opacity-60"
          >
            {inviteMutation.isPending ? "Sending…" : "Send invite"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <h2 className="type-h5 flex items-center gap-2 text-foreground">
            <KeyRound className="size-4 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
            Accounts and access
          </h2>
        </div>

        {users.isLoading ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Loading accounts…</p>
        ) : users.isError ? (
          <p className="px-5 py-8 text-sm text-coral-ink">Could not load accounts.</p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">No accounts yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const isAdmin = row.roles.includes("admin");
              const isSelf = row.id === user?.id;
              return (
                <li
                  key={row.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {row.email}
                      {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {isAdmin ? "Administrator" : "Standard user"} ·{" "}
                      {row.confirmed ? "Confirmed" : "Pending invite"} · Last sign-in{" "}
                      {row.lastSignInAt ? new Date(row.lastSignInAt).toLocaleDateString() : "never"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => roleMutation.mutate({ userId: row.id, grant: !isAdmin })}
                      disabled={roleMutation.isPending || (isAdmin && isSelf)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-foreground transition-colors hover:bg-surface disabled:opacity-50"
                    >
                      {isAdmin ? (
                        <>
                          <ShieldX className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                          Revoke admin
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                          Make admin
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete ${row.email}?`))
                          deleteMutation.mutate(row.id);
                      }}
                      disabled={isSelf || deleteMutation.isPending}
                      aria-label={`Delete ${row.email}`}
                      className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-coral-ink disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="type-h3 mt-1 text-foreground">{value}</p>
    </div>
  );
}
