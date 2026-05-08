import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export const FREE_MONTHLY_CHATS = 10;
/** Per-built-in-agent monthly run caps for free tier. */
export const FREE_MONTHLY_LEAD_RUNS = 1;
export const FREE_MONTHLY_CONTENT_RUNS = 3;
/** Per-custom-agent daily run cap for free tier. */
export const FREE_DAILY_CUSTOM_AGENT_RUNS = 2;
/** Maximum number of saved custom agents on free tier. */
export const FREE_MAX_CUSTOM_AGENTS = 2;

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
