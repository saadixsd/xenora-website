import { cn } from '@/lib/utils';

interface StatsCardsProps {
  hoursSaved: string;
  leadsProcessed: number;
  postsGenerated: number;
  followupsQueued: number;
  isEmpty: boolean;
  onHoursClick?: () => void;
  onLeadsClick?: () => void;
  onPostsClick?: () => void;
  onFollowupsClick?: () => void;
}

export function StatsCards({
  hoursSaved,
  leadsProcessed,
  postsGenerated,
  followupsQueued,
  isEmpty,
  onHoursClick,
  onLeadsClick,
  onPostsClick,
  onFollowupsClick,
}: StatsCardsProps) {
  const emptyHint = 'Run your first workflow to start tracking';

  const cards = [
    {
      label: 'Hours Saved',
      value: hoursSaved,
      hint: isEmpty ? emptyHint : 'This month from completed runs',
      onClick: onHoursClick,
    },
    {
      label: 'Leads Processed',
      value: String(leadsProcessed),
      hint: isEmpty ? emptyHint : 'Classified and scored by Leads Agent',
      onClick: onLeadsClick,
    },
    {
      label: 'Posts Generated',
      value: String(postsGenerated),
      hint: isEmpty ? emptyHint : 'X posts, hooks, and LinkedIn drafts',
      onClick: onPostsClick,
    },
    {
      label: 'Follow-ups Queued',
      value: String(followupsQueued),
      hint: isEmpty ? emptyHint : 'Awaiting your approval',
      onClick: onFollowupsClick,
    },
  ];

  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
      {cards.map((c) => {
        const interactive = Boolean(c.onClick);
        const className = cn(
          'min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4 text-left',
          interactive &&
            'cursor-pointer transition-colors hover:border-primary/35 hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        );
        const inner = (
          <>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.5px] text-muted-foreground truncate">{c.label}</p>
            <p className="mt-0.5 sm:mt-1 font-dm-serif text-[22px] sm:text-[26px] tracking-tight text-foreground">{c.value}</p>
            <p className="mt-0.5 break-words text-[10px] sm:text-[11px] text-muted-foreground line-clamp-2">{c.hint}</p>
          </>
        );
        return interactive ? (
          <button key={c.label} type="button" onClick={c.onClick} className={className}>
            {inner}
          </button>
        ) : (
          <div key={c.label} className={className}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
