import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AccessUser = {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  confirmed: boolean;
  roles: string[];
};

const email = (v: unknown) => String(v ?? "").trim().toLowerCase().slice(0, 320);

/** Lists every account with its roles. Admin only. */
export const adminListAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (error) throw new Error(error.message);

    const { data: roleRows, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (roleError) throw new Error(roleError.message);

    const byUser = new Map<string, string[]>();
    for (const r of roleRows ?? []) {
      byUser.set(r.user_id, [...(byUser.get(r.user_id) ?? []), r.role as string]);
    }

    return (list.users ?? []).map<AccessUser>((u) => ({
      id: u.id,
      email: u.email ?? "—",
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      confirmed: Boolean(u.email_confirmed_at),
      roles: (byUser.get(u.id) ?? []).sort(),
    }));
  });

/** Grants or revokes a role for one account. Admin only. */
export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: "admin" | "user"; grant: boolean }) => ({
    userId: String(input.userId),
    role: input.role === "admin" ? ("admin" as const) : ("user" as const),
    grant: Boolean(input.grant),
  }))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);

    if (!data.grant && data.role === "admin" && data.userId === context.userId) {
      throw new Error("You cannot remove your own administrator access.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/** Invites a new admin by email, creating the account if needed. Admin only. */
export const adminInviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; makeAdmin: boolean }) => ({
    email: email(input.email),
    makeAdmin: Boolean(input.makeAdmin),
  }))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) throw new Error("Enter a valid email.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let target = (existing.users ?? []).find((u) => u.email?.toLowerCase() === data.email);

    if (!target) {
      const { data: created, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email);
      if (error) throw new Error(error.message);
      target = created.user;
    }
    if (!target) throw new Error("Could not create that account.");

    if (data.makeAdmin) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: target.id, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    }
    return { ok: true, userId: target.id };
  });

/** Permanently removes an account. Admin only. */
export const adminDeleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => ({ userId: String(input.userId) }))
  .handler(async ({ data, context }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    await requireAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You cannot delete your own account.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
