import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Role checks go through the caller's own RLS-scoped client and the
 * `has_role` security-definer function — never the service-role client, which
 * would let any signed-in caller read every role row.
 */
export async function isAdmin(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) return false;
  return data === true;
}

export async function requireAdmin(supabase: SupabaseClient, userId: string) {
  if (!(await isAdmin(supabase, userId))) {
    throw new Error("Forbidden");
  }
}
