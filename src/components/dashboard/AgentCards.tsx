import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Agent {
  name: string;
  description: string;
  status: 'live' | 'beta' | 'soon';
  actionLabel: string;
  templateId?: string;
  footer: 'drafts' | 'beta' | 'soon';
}

const agents: Agent[] = [
  {
    name: 'Content Agent',
    description: 'Rough notes in. Posts, hooks, and captions out — ready to review.',
    status: 'live',
    actionLabel: 'Run →',
    footer: 'drafts',
  },
  {
    name: 'Lead Agent',
    description: 'Scores inbound. Drafts replies. Follows up when they go quiet.',
    status: 'beta',
    actionLabel: 'Learn →',
    footer: 'beta',
  },
  {
    name: 'Research Agent',
    description: 'Scans Reddit and comments. Returns real pain signals and content angles.',
    status: 'soon',
    actionLabel: 'Notify →',
    footer: 'soon',
  },
];

const dotColor = { live: 'bg-emerald-500', beta: 'bg-amber-500', soon: 'bg-border' };
const statusStyle = {
  live: 'bg-primary/10 text-primary',
  beta: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  soon: 'bg-muted text-muted-foreground',
};
const statusLabel = { live: 'Live', beta: 'Beta', soon: 'Coming soon' };

interface AgentCardsProps {
  draftsCount?: number;
  contentTemplateId?: string;
}

export function AgentCards({ draftsCount = 0, contentTemplateId }: AgentCardsProps) {
  const navigate = useNavigate();

  const data = agents.map((a, i) => ({
    ...a,
    templateId: i === 0 ? contentTemplateId : undefined,
  }));

  const handleAction = (agent: Agent & { templateId?: string }) => {
    if (agent.status === 'live' && agent.templateId) {
      navigate(`/dashboard/run/new?template=${agent.templateId}`);
    }
    if (agent.footer === 'beta') {
      navigate('/dashboard/settings');
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {data.map((a) => {
        const interactive = a.status !== 'soon';
        return (
        <div
          key={a.name}
          className={cn(
            'rounded-xl border border-border bg-card p-4 transition-all duration-200',
            interactive && 'cursor-pointer hover:border-primary/40 hover:shadow-[0_2px_12px_rgba(45,90,61,0.08)]',
            a.status === 'soon' && 'opacity-70',
          )}
          onClick={interactive ? () => handleAction(a) : undefined}
          onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAction(a); } } : undefined}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className={cn('h-2 w-2 rounded-full', dotColor[a.status])} />
            <span className={cn('rounded-md px-2 py-0.5 text-[10.5px] font-medium', statusStyle[a.status])}>
              {statusLabel[a.status]}
            </span>
          </div>
          <h3 className="text-sm font-medium text-foreground">{a.name}</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{a.description}</p>
          <div className="mt-3 border-t border-border pt-3">
            {a.footer === 'drafts' && (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  {draftsCount > 0 ? (
                    <>
                      <p className="font-dm-serif text-lg text-foreground">{draftsCount}</p>
                      <p className="text-[11px] text-muted-foreground">outputs from your runs</p>
                    </>
                  ) : (
                    <p className="text-[12px] text-muted-foreground leading-snug">
                      No outputs yet — run the Content Agent to generate drafts.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(a);
                  }}
                >
                  {a.actionLabel}
                </button>
              </div>
            )}
            {a.footer === 'beta' && (
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] text-muted-foreground leading-snug">In beta — availability may vary.</p>
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(a);
                  }}
                >
                  {a.actionLabel}
                </button>
              </div>
            )}
            {a.footer === 'soon' && (
              <p className="text-[12px] text-muted-foreground leading-snug">Coming soon — not in the product yet.</p>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}
