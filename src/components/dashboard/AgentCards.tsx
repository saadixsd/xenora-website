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
  content: 'bg-[#00c896]',
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
        <p className="text-[12px] text-[#8a9bb0]">No agents available yet.</p>
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
            className="dash-panel min-w-0 p-3 transition-all duration-200 hover:border-[#00c896]/35 hover:shadow-[0_2px_24px_rgba(0,200,150,0.08)] sm:p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 shrink-0 rounded-full', AGENT_COLORS[kind] || 'bg-[#00c896]')} />
                <span className="text-[10px] font-medium text-[#8a9bb0] sm:text-[11px]">Live</span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00c896]/10">
                <Icon className="h-4 w-4 text-[#00c896]" />
              </div>
            </div>

            <h3 className="text-[13px] font-medium text-[#f0f4f8] sm:text-sm">{t.name}</h3>
            <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-[#8a9bb0] sm:text-[12px]">
              {t.description}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-2.5 sm:mt-3 sm:gap-2">
              <button
                type="button"
                onClick={() => navigate(`${ROUTES.dashboard.runNew}?template=${t.id}`)}
                className="min-h-[32px] rounded-md bg-[#00c896] px-2.5 py-1 text-[10px] font-medium text-[#041a12] transition-opacity hover:opacity-90 sm:min-h-0 sm:text-[11px]"
              >
                Run now
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.dashboard.history)}
                className="min-h-[32px] rounded-md border border-white/[0.08] bg-transparent px-2.5 py-1 text-[10px] text-[#8a9bb0] transition-colors hover:border-[#00c896]/40 hover:text-[#f0f4f8] sm:min-h-0 sm:text-[11px]"
              >
                History
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
