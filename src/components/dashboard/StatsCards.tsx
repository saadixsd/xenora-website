interface StatsCardsProps {
  totalRuns: number;
  runsThisWeek: number;
  draftsGenerated: number;
}

export function StatsCards({ totalRuns, runsThisWeek, draftsGenerated }: StatsCardsProps) {
  const emptyHint = 'Run your first workflow to start tracking';

  const cards = [
    {
      label: 'Hours saved',
      value: '0',
      hint: totalRuns === 0 ? emptyHint : "Time saved isn't tracked yet — we're focused on accurate run history first.",
    },
    {
      label: 'Runs this week',
      value: String(runsThisWeek),
      hint: totalRuns === 0 ? emptyHint : runsThisWeek === 0 ? 'No runs in the last 7 days.' : `${runsThisWeek} in the last 7 days`,
    },
    {
      label: 'Drafts ready',
      value: String(draftsGenerated),
      hint: totalRuns === 0 ? emptyHint : draftsGenerated === 0 ? 'Complete a run to generate outputs.' : 'Outputs from your latest runs',
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11.5px] uppercase tracking-[0.5px] text-muted-foreground">{c.label}</p>
          <p className="mt-1 font-dm-serif text-[26px] tracking-tight text-foreground">{c.value}</p>
          <p className="mt-0.5 text-[11.5px] text-muted-foreground">{c.hint}</p>
        </div>
      ))}
    </div>
  );
}
