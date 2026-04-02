import { Zap, FileText, Clock } from 'lucide-react';

interface StatsCardsProps {
  totalRuns: number;
  draftsGenerated: number;
}

export function StatsCards({ totalRuns, draftsGenerated }: StatsCardsProps) {
  const timeSaved = totalRuns * 25; // ~25 min per run

  const stats = [
    { label: 'Total Runs', value: totalRuns, icon: Zap },
    { label: 'Drafts Generated', value: draftsGenerated, icon: FileText },
    { label: 'Minutes Saved', value: timeSaved, icon: Clock },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="surface-panel flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <s.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
