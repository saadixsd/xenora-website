import { cn } from '@/lib/utils';

interface BreakdownItem {
  type: string;
  label: string;
  minutes: number;
}

interface HoursSavedBreakdownProps {
  breakdown: BreakdownItem[];
  totalMinutes: number;
}

function formatMinutes(m: number): string {
  if (m <= 0) return '0m';
  const h = Math.floor(m / 60);
  const mins = m % 60;
  if (h === 0) return `${mins}m`;
  if (mins === 0) return `${h}h`;
  return `${h}h ${mins}m`;
}

const BAR_COLORS: Record<string, string> = {
  content: 'bg-emerald-500',
  leads: 'bg-amber-500',
  research: 'bg-teal-500',
};

export function HoursSavedBreakdown({ breakdown, totalMinutes }: HoursSavedBreakdownProps) {
  const max = Math.max(...breakdown.map((b) => b.minutes), 1);

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex items-baseline justify-between mb-2.5 sm:mb-3 gap-2">
        <p className="text-[12px] sm:text-[13px] font-medium text-foreground">Hours Saved This Month</p>
        <p className="text-[11px] sm:text-[12px] text-muted-foreground shrink-0">{formatMinutes(totalMinutes)} total</p>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {breakdown.map((item) => {
          const pct = totalMinutes > 0 ? Math.round((item.minutes / max) * 100) : 0;
          return (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] sm:text-[12px] text-foreground truncate mr-2">{item.label}</span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground shrink-0">{formatMinutes(item.minutes)}</span>
              </div>
              <div className="h-1.5 sm:h-2 w-full rounded-full bg-muted">
                <div
                  className={cn('h-1.5 sm:h-2 rounded-full transition-all duration-500', BAR_COLORS[item.type] || 'bg-primary')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {totalMinutes === 0 && (
        <p className="mt-3 text-center text-[11px] sm:text-[12px] text-muted-foreground">
          Complete runs to see your time saved breakdown.
        </p>
      )}
    </div>
  );
}
