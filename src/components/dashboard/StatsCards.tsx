interface StatsCardsProps {
  totalRuns: number;
  draftsGenerated: number;
  leadsQueued?: number;
}

export function StatsCards({ totalRuns, draftsGenerated, leadsQueued = 0 }: StatsCardsProps) {
  const hoursSaved = Math.round(totalRuns * 25 / 60);

  const stats = [
    { label: 'Hours saved', value: hoursSaved || '—', delta: '↑ this week', down: false },
    { label: 'Runs this week', value: totalRuns || '—', delta: totalRuns > 0 ? `${totalRuns} total` : 'No runs yet', down: false },
    { label: 'Drafts ready', value: draftsGenerated || '—', delta: draftsGenerated > 0 ? 'Waiting to publish' : 'Run a workflow', down: false },
    { label: 'Leads queued', value: leadsQueued || '—', delta: leadsQueued > 0 ? `${leadsQueued} need reply` : 'Coming soon', down: leadsQueued > 0 },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11.5px] uppercase tracking-[0.5px] text-muted-foreground">{s.label}</p>
          <p className="mt-1 font-dm-serif text-[26px] tracking-tight text-foreground">{s.value}</p>
          <p className={`mt-0.5 text-[11.5px] ${s.down ? 'text-destructive' : 'text-primary'}`}>{s.delta}</p>
        </div>
      ))}
    </div>
  );
}
