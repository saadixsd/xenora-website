import { cn } from '@/lib/utils';

type Stage = 'input' | 'parsing' | 'matching' | 'scoring' | 'done';

const STEPS: { key: Stage; label: string }[] = [
  { key: 'parsing', label: 'Parse' },
  { key: 'matching', label: 'Profile' },
  { key: 'scoring', label: 'Score' },
  { key: 'done', label: 'Done' },
];

const stageIndex = (s: Stage): number => {
  const idx = STEPS.findIndex((step) => step.key === s);
  return idx === -1 ? -1 : idx;
};

export function StageProgress({ stage }: { stage: Stage }) {
  const current = stageIndex(stage);
  if (current < 0) return null;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, i) => {
        const done = i < current || stage === 'done';
        const active = i === current && stage !== 'done';
        return (
          <div key={step.key} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <div
                className={cn(
                  'h-px w-4 sm:w-6 transition-colors duration-500',
                  done ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-medium transition-all duration-500',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary bg-primary/20 text-primary animate-pulse',
                  !done && !active && 'border-border bg-card/40 text-muted-foreground',
                )}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs transition-colors',
                  done || active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
