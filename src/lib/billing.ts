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
