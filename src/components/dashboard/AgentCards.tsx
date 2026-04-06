import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';

interface DbTemplate {
  id: string;
  name: string;
}

interface Agent {
  name: string;
  description: string;
  status: 'live' | 'beta' | 'soon';
  actionLabel: string;
  match: (name: string) => boolean;
  footer: 'drafts' | 'beta' | 'research';
}

const agents: Agent[] = [
  {
    name: 'Content Agent',
    description: 'Rough notes in. Posts, hooks, and captions out — ready to review.',
    status: 'live',
    actionLabel: 'Run →',
    match: (n) => n.includes('content'),
    footer: 'drafts',
  },
  {
    name: 'Lead Agent',
    description: 'Scores inbound, drafts a reply, queues follow-up after ~48h if needed. You approve before send.',
    status: 'beta',
    actionLabel: 'Run →',
    match: (n) => n.includes('lead'),
    footer: 'beta',
  },
  {
    name: 'Research Agent',
    description: 'Fetches public thread data when possible and returns pain signals and content angles.',
    status: 'live',
    actionLabel: 'Run →',
    match: (n) => n.includes('research'),
    footer: 'research',
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
}

export function AgentCards({ draftsCount = 0 }: AgentCardsProps) {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<DbTemplate[]>([]);

  useEffect(() => {
    supabase
      .from('workflow_templates')
      .select('id, name')
      .then(({ data }) => {
        if (data) setTemplates(data as DbTemplate[]);
      });
  }, []);

  const resolveTemplateId = (a: Agent): string | undefined => {
    const row = templates.find((t) => a.match(t.name.toLowerCase()));
    return row?.id;
  };

  const handleRun = (agent: Agent) => {
    const tid = resolveTemplateId(agent);
    if (!tid) return;
    navigate(`${ROUTES.dashboard.runNew}?template=${tid}`);
  };

  const pathForAgent = (agent: Agent): string => {
    if (agent.name.startsWith('Content')) return ROUTES.dashboard.agents.content;
    if (agent.name.startsWith('Lead')) return ROUTES.dashboard.agents.lead;
    return ROUTES.dashboard.agents.research;
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {agents.map((a) => {
        const tid = resolveTemplateId(a);
        const canRun = Boolean(tid);
        const interactive = canRun || a.status !== 'soon';
        return (
          <div
            key={a.name}
            className={cn(
              'rounded-xl border border-border bg-card p-4 transition-all duration-200',
              interactive && 'cursor-pointer hover:border-primary/40 hover:shadow-[0_2px_12px_rgba(45,90,61,0.08)]',
              a.status === 'soon' && 'opacity-70',
            )}
            onClick={interactive ? () => navigate(pathForAgent(a)) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(pathForAgent(a));
                    }
                  }
                : undefined
            }
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
                    className="shrink-0 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                    disabled={!canRun}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRun(a);
                    }}
                  >
                    {a.actionLabel}
                  </button>
                </div>
              )}
              {a.footer === 'beta' && (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] text-muted-foreground leading-snug">Beta — review drafts before sending.</p>
                  <button
                    type="button"
                    className="shrink-0 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                    disabled={!canRun}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRun(a);
                    }}
                  >
                    {a.actionLabel}
                  </button>
                </div>
              )}
              {a.footer === 'research' && (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] text-muted-foreground leading-snug">Add URLs on the run screen when useful.</p>
                  <button
                    type="button"
                    className="shrink-0 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary disabled:opacity-40"
                    disabled={!canRun}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRun(a);
                    }}
                  >
                    {a.actionLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
