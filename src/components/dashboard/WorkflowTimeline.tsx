import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type StepStatus = 'pending' | 'running' | 'complete';

interface WorkflowStep {
  key: string;
  label: string;
  status: StepStatus;
}

const STEP_LABELS: Record<string, string> = {
  input_received: 'Input received',
  classifying: 'Classifying request',
  generating: 'Generating content',
  formatting: 'Formatting outputs',
  done: 'Complete',
};

export function WorkflowTimeline({ steps, currentStep }: { steps: string[]; currentStep: string }) {
  const currentIdx = steps.indexOf(currentStep);

  const resolvedSteps: WorkflowStep[] = steps.map((key, i) => ({
    key,
    label: STEP_LABELS[key] || key,
    status: currentStep === 'done' || i < currentIdx ? 'complete' : i === currentIdx ? 'running' : 'pending',
  }));

  return (
    <div className="flex flex-col gap-0">
      {resolvedSteps.map((step, i) => (
        <div key={step.key} className="flex gap-3">
          {/* Vertical line + dot */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500',
                step.status === 'complete' && 'border-primary bg-primary',
                step.status === 'running' && 'border-primary bg-primary/20 animate-pulse',
                step.status === 'pending' && 'border-border bg-card/40'
              )}
            >
              {step.status === 'complete' ? (
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              ) : (
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    step.status === 'running' ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
            {i < resolvedSteps.length - 1 && (
              <div
                className={cn(
                  'w-0.5 flex-1 min-h-[24px] transition-colors duration-500',
                  step.status === 'complete' ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>

          {/* Label */}
          <div className="pb-6 pt-1">
            <p
              className={cn(
                'text-sm transition-colors',
                step.status === 'complete' && 'text-foreground font-medium',
                step.status === 'running' && 'text-primary font-medium',
                step.status === 'pending' && 'text-muted-foreground'
              )}
            >
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
