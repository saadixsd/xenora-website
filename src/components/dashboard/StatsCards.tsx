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
  const emptyHint = 'Run a workflow to start tracking';

  const cards = [
    {
      label: 'Hours saved',
      value: hoursSaved,
      hint: isEmpty ? emptyHint : 'This month from completed runs',
      onClick: onHoursClick,
    },
    {
      label: 'Leads processed',
      value: String(leadsProcessed),
      hint: isEmpty ? emptyHint : 'Classified and scored by Leads Agent',
      onClick: onLeadsClick,
    },
    {
      label: 'Posts generated',
      value: String(postsGenerated),
      hint: isEmpty ? emptyHint : 'X posts, hooks, and LinkedIn drafts',
      onClick: onPostsClick,
    },
    {
      label: 'Follow-ups queued',
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
          'dash-panel min-w-0 p-3 text-left sm:p-4',
          interactive &&
            'cursor-pointer transition-colors hover:border-[#00c896]/35 hover:bg-[#00c896]/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c896]/40',
        );
        const inner = (
          <>
            <p className="dash-label truncate">{c.label}</p>
            <p className="mt-1 font-syne text-[22px] font-semibold tracking-tight text-[#f0f4f8] sm:text-[26px]">
              {c.value}
            </p>
            <p className="mt-0.5 line-clamp-2 break-words text-[10px] text-[#8a9bb0] sm:text-[11px]">{c.hint}</p>
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
