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
  content: 'bg-[#00c896]',
  leads: 'bg-amber-500',
  research: 'bg-teal-500',
};

export function HoursSavedBreakdown({ breakdown, totalMinutes }: HoursSavedBreakdownProps) {
  const max = Math.max(...breakdown.map((b) => b.minutes), 1);

  return (
    <div className="dash-panel min-w-0 p-3 sm:p-4">
      <div className="mb-2.5 flex items-baseline justify-between gap-2 sm:mb-3">
        <p className="dash-label">Time saved (month)</p>
        <p className="shrink-0 font-space-mono text-[10px] text-[#8a9bb0] sm:text-[11px]">{formatMinutes(totalMinutes)} total</p>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {breakdown.map((item) => {
          const pct = totalMinutes > 0 ? Math.round((item.minutes / max) * 100) : 0;
          return (
            <div key={item.type}>
              <div className="mb-1 flex items-center justify-between">
                <span className="truncate text-[11px] text-[#f0f4f8] sm:text-[12px]">{item.label}</span>
                <span className="shrink-0 font-space-mono text-[10px] text-[#3f5060] sm:text-[11px]">
                  {formatMinutes(item.minutes)}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.06] sm:h-2">
                <div
                  className={cn('h-1.5 rounded-full transition-all duration-500 sm:h-2', BAR_COLORS[item.type] || 'bg-[#00c896]')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {totalMinutes === 0 && (
        <p className="mt-3 text-center text-[11px] text-[#3f5060] sm:text-[12px]">
          Finish a few runs to see how time stacks by agent.
        </p>
      )}
    </div>
  );
}
