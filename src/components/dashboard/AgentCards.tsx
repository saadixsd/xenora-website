import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';
import { FileText, Search, Mail, type LucideIcon } from 'lucide-react';

interface TemplateRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  PenLine: FileText,
  FileText,
  Search,
  Mail,
};

const AGENT_COLORS: Record<string, string> = {
  content: 'bg-[var(--dash-accent)]',
  lead: 'bg-amber-500',
  research: 'bg-blue-500',
};

function classifyTemplate(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('lead')) return 'lead';
  if (n.includes('research')) return 'research';
  return 'content';
}

export function AgentCards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TemplateRow[]>([]);

  useEffect(() => {
    supabase
      .from('workflow_templates')
      .select('id, name, description, icon, status')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setTemplates(data);
      });
  }, []);

  if (templates.length === 0) {
    return (
      <div className="dash-panel p-4 text-center">
        <p className="text-[12px] text-[var(--dash-muted)]">No agents loaded yet. Run your first workflow to activate agent history.</p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((t) => {
        const kind = classifyTemplate(t.name);
        const Icon = ICON_MAP[t.icon] || FileText;

        return (
          <div
            key={t.id}
            className="dash-panel min-w-0 p-3 transition-all duration-200 hover:border-[var(--dash-accent-hover)] hover:shadow-[0_2px_24px_var(--dash-accent-dim)] sm:p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 shrink-0 rounded-full', AGENT_COLORS[kind] || 'bg-[var(--dash-accent)]')} />
                <span className="text-[10px] font-medium text-[var(--dash-muted)] sm:text-[11px]">Ready</span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-accent-subtle)]">
                <Icon className="h-4 w-4 text-[var(--dash-accent)]" />
              </div>
            </div>

            <h3 className="text-[13px] font-medium text-[var(--dash-text)] sm:text-sm">{t.name}</h3>
            <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-[var(--dash-muted)] sm:text-[12px]">
              {t.description}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-[var(--dash-border)] pt-2.5 sm:mt-3 sm:gap-2">
              <button
                type="button"
                onClick={() => navigate(`${ROUTES.dashboard.runNew}?template=${t.id}`)}
                className="min-h-[36px] rounded-md bg-[var(--dash-accent)] px-2.5 py-1 text-[10px] font-medium text-[var(--dash-accent-fg)] transition-opacity hover:opacity-90 sm:min-h-0 sm:text-[11px]"
              >
                Run workflow
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.dashboard.history)}
                className="min-h-[36px] rounded-md border border-[var(--dash-border)] bg-transparent px-2.5 py-1 text-[10px] text-[var(--dash-muted)] transition-colors hover:border-[var(--dash-accent-hover)] hover:text-[var(--dash-text)] sm:min-h-0 sm:text-[11px]"
              >
                Open history
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
