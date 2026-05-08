export type BillingSubscriptionRow = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export function isPaidNoraSubscription(row: BillingSubscriptionRow | null): boolean {
  if (!row) return false;
  if (row.plan !== 'plus' && row.plan !== 'pro') return false;
  return row.status === 'active' || row.status === 'trialing';
}

/** Free-tier monthly Ask Nora chat allowance (per UTC calendar month). */
export const FREE_MONTHLY_CHATS = 10;
/** Per-built-in-agent monthly run caps for free tier. */
export const FREE_MONTHLY_LEAD_RUNS = 1;
export const FREE_MONTHLY_CONTENT_RUNS = 3;
/** Per-custom-agent daily run cap for free tier. */
export const FREE_DAILY_CUSTOM_AGENT_RUNS = 2;
/** Maximum number of saved custom agents on free tier. */
export const FREE_MAX_CUSTOM_AGENTS = 2;
/** Soft fair-use cap for paid (Plus/Pro) custom agents. */
export const PAID_MAX_CUSTOM_AGENTS = 50;

/** Custom-agent cap for the user's current plan. */
export function maxCustomAgentsForPlan(row: BillingSubscriptionRow | null): number {
  return isPaidNoraSubscription(row) ? PAID_MAX_CUSTOM_AGENTS : FREE_MAX_CUSTOM_AGENTS;
}
