import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { isPaidNoraSubscription, type BillingSubscriptionRow } from '@/lib/billing';
import { cn } from '@/lib/utils';

type PlanTag = 'Free' | 'Plus' | 'Pro';

function planLabel(row: BillingSubscriptionRow | null): PlanTag {
  if (!row || !isPaidNoraSubscription(row)) return 'Free';
  if (row.plan === 'pro') return 'Pro';
  if (row.plan === 'plus') return 'Plus';
  return 'Free';
}

/** Compact pill showing the user's current plan. Hidden until loaded to avoid flash. */
export function PlanBadge({ className, hideFree = false }: { className?: string; hideFree?: boolean }) {
  const { user } = useAuth();
  const [tag, setTag] = useState<PlanTag | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    void supabase
      .from('billing_subscriptions' as any)
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setTag(planLabel((data as unknown as BillingSubscriptionRow | null) ?? null)));
  }, [user?.id]);

  if (!tag) return null;
  if (hideFree && tag === 'Free') return null;

  const isPaid = tag !== 'Free';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 font-space-mono text-[10px] font-medium uppercase tracking-[0.08em]',
        isPaid
          ? 'border-[var(--dash-accent)]/40 bg-[var(--dash-accent)]/10 text-[var(--dash-accent)]'
          : 'border-[var(--dash-border)] bg-[var(--dash-surface-deep)] text-[var(--dash-muted)]',
        className,
      )}
      aria-label={`Current plan: ${tag}`}
    >
      {tag}
    </span>
  );
}
