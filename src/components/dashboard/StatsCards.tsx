import { cn } from '@/lib/utils';

interface StatsCardsProps {
  hoursSavedDisplay: string;
  hoursHint: string;
  runsThisWeek: number;
  runsWeekHint: string;
  draftsGenerated: number;
  draftsHint: string;
  emptyOverall: boolean;
  onHoursClick?: () => void;
  onRunsClick?: () => void;
  onDraftsClick?: () => void;
}

export function StatsCards({
  hoursSavedDisplay,
  hoursHint,
  runsThisWeek,
  runsWeekHint,
  draftsGenerated,
  draftsHint,
  emptyOverall,
  onHoursClick,
  onRunsClick,
  onDraftsClick,
}: StatsCardsProps) {
  const emptyHint = 'Run your first workflow to start tracking';

  const cards = [
    {
      label: 'Hours saved',
      value: hoursSavedDisplay,
      hint: emptyOverall ? emptyHint : hoursHint,
      onClick: onHoursClick,
    },
    {
      label: 'Runs this week',
      value: String(runsThisWeek),
      hint: emptyOverall ? emptyHint : runsWeekHint,
      onClick: onRunsClick,
    },
    {
      label: 'Drafts ready',
      value: String(draftsGenerated),
      hint: emptyOverall ? emptyHint : draftsHint,
      onClick: onDraftsClick,
    },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c) => {
        const interactive = Boolean(c.onClick);
        const className = cn(
          'min-w-0 rounded-xl border border-border bg-card p-4 text-left',
          interactive &&
            'cursor-pointer transition-colors hover:border-primary/35 hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        );
        const inner = (
          <>
            <p className="text-[11.5px] uppercase tracking-[0.5px] text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-dm-serif text-[26px] tracking-tight text-foreground">{c.value}</p>
            <p className="mt-0.5 break-words text-[11.5px] text-muted-foreground">{c.hint}</p>
            {!emptyOverall && interactive && (
              <p className="mt-1.5 text-[10px] font-medium text-primary/90">Tap for details →</p>
            )}
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
