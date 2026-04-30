import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export const FREE_MONTHLY_CHATS = 10;
export const FREE_MONTHLY_RUNS = 5;
export const FREE_MAX_CUSTOM_AGENTS = 3;

export type BillingRow = {
  plan: string;
  status: string;
};

export function isPaidNoraAccess(row: BillingRow | null): boolean {
  if (!row) return false;
  if (row.plan !== "plus" && row.plan !== "pro") return false;
  return row.status === "active" || row.status === "trialing";
}

export async function fetchBillingRow(
  admin: SupabaseClient,
  userId: string,
): Promise<BillingRow | null> {
  const { data, error } = await admin
    .from("billing_subscriptions")
    .select("plan,status")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("fetchBillingRow", error);
    return null;
  }
  return data as BillingRow | null;
}

export type NoraTier = "free" | "plus" | "pro";

export function tierFromBilling(row: BillingRow | null): NoraTier {
  if (!row) return "free";
  if (row.plan === "pro" && isPaidNoraAccess(row)) return "pro";
  if (row.plan === "plus" && isPaidNoraAccess(row)) return "plus";
  return "free";
}
