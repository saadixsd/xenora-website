import { memo } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  hoursSaved: string;
  ideasCaptured: number;
  postsApproved: number;
  followupsDrafted: number;
  isEmpty: boolean;
  onHoursClick?: () => void;
  onIdeasClick?: () => void;
  onPostsClick?: () => void;
  onFollowupsClick?: () => void;
}

export const StatsCards = memo(function StatsCards({
  hoursSaved,
  ideasCaptured,
  postsApproved,
  followupsDrafted,
  isEmpty,
  onHoursClick,
  onIdeasClick,
  onPostsClick,
  onFollowupsClick,
}: StatsCardsProps) {
  const emptyHint = 'Capture an idea or run a workflow to populate this metric';

  const cards = [
    {
      label: 'Hours saved',
      value: hoursSaved,
      hint: isEmpty ? emptyHint : 'This month from completed runs',
      onClick: onHoursClick,
    },
    {
      label: 'Ideas captured',
      value: String(ideasCaptured),
      hint: isEmpty ? 'Use Capture to seed your first idea' : 'Sitting in your board, ready to draft',
      onClick: onIdeasClick,
    },
    {
      label: 'Posts approved',
      value: String(postsApproved),
      hint: isEmpty ? emptyHint : 'Marked Ready or Sent on the board',
      onClick: onPostsClick,
    },
    {
      label: 'Follow-ups drafted',
      value: String(followupsDrafted),
      hint: isEmpty ? emptyHint : 'Replies Nora has prepared for you',
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
            'cursor-pointer transition-colors hover:border-[var(--dash-accent-hover)] hover:bg-[var(--dash-accent-subtle)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-accent)]/40',
        );
        const inner = (
          <>
            <p className="dash-label truncate">{c.label}</p>
            <p className="mt-1 font-syne text-[22px] font-semibold tracking-tight text-[var(--dash-text)] sm:text-[26px]">
              {c.value}
            </p>
            <p className="mt-0.5 line-clamp-2 break-words text-[10px] text-[var(--dash-muted)] sm:text-[11px]">{c.hint}</p>
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
});
