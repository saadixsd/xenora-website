import type { Tables } from '@/integrations/supabase/types';

export type BillingSubscriptionRow = Tables<'billing_subscriptions'>;

export function isPaidNoraSubscription(row: BillingSubscriptionRow | null): boolean {
  if (!row) return false;
  if (row.plan !== 'plus' && row.plan !== 'pro') return false;
  return row.status === 'active' || row.status === 'trialing';
}
