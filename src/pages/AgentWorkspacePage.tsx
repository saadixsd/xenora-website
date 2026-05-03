import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { QuickRunInput } from '@/components/dashboard/QuickRunInput';
import { Button } from '@/components/ui/button';
import { ROUTES, dashboardRunPath } from '@/config/routes';

const SLUG_COPY: Record<string, { title: string; blurb: string; footer: string }> = {
  content: {
    title: 'Content Agent',
    blurb: 'Turn rough notes into X posts, hooks, LinkedIn drafts, and a CTA. Review and edit outputs on each run.',
    footer: 'Uses the Content Agent template — same engine as the dashboard quick run.',
  },
  lead: {
    title: 'Lead Agent',
    blurb: 'From notes or inbound context: summary, score rationale, first reply, 48h follow-up, and objections to watch. You approve before send.',
    footer: 'Uses the Lead Follow-up template.',
  },
  research: {
    title: 'Research Agent',
    blurb: 'Combine your notes with optional public URLs (e.g. Reddit threads). Nora fetches what it can server-side and returns pain signals and angles.',
    footer: 'Uses the Research template. Add URLs on the new-run screen when you are ready.',
  },
};

interface RunRow {
  id: string;
  input_text: string;
  status: string;
  created_at: string;
}

export default function AgentWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [recent, setRecent] = useState<RunRow[]>([]);

  const copy = slug && SLUG_COPY[slug] ? SLUG_COPY[slug] : null;

  const matcher = useMemo(() => {
    if (slug === 'content') return (n: string) => n.toLowerCase().includes('content');
    if (slug === 'lead') return (n: string) => n.toLowerCase().includes('lead');
    if (slug === 'research') return (n: string) => n.toLowerCase().includes('research');
    return () => false;
  }, [slug]);

  useEffect(() => {
    if (!slug || !copy) return;
    supabase
      .from('workflow_templates')
      .select('id, name')
      .then(({ data }) => {
        const row = (data ?? []).find((t) => matcher(t.name.toLowerCase()));
        if (row) setTemplateId(row.id);
      });
  }, [slug, copy, matcher]);

  useEffect(() => {
    if (!user || !templateId) return;
    supabase
      .from('workflow_runs')
      .select('id, input_text, status, created_at')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .is('archived_at' as any, null)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setRecent(data as RunRow[]);
      });
  }, [user, templateId]);

  if (!slug || !copy) {
    return (
      <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Unknown agent.</p>
        <Link to={ROUTES.dashboard.root} className="mt-2 inline-block text-sm text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <h1 className="font-syne text-2xl font-semibold tracking-tight text-foreground">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{copy.blurb}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.dashboard.agents.manage)}>
          Manage agents
        </Button>
        {templateId && (
          <Button size="sm" onClick={() => navigate(`${ROUTES.dashboard.runNew}?template=${templateId}`)}>
            New run
          </Button>
        )}
      </div>

      <div className="mt-8">
        <QuickRunInput templateId={templateId ?? undefined} footerNote={copy.footer} />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-foreground">Recent runs</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No runs for this agent yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recent.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => navigate(dashboardRunPath(r.id))}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary/30"
                >
                  <span className="line-clamp-1 text-foreground">{r.input_text}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {r.status} · {new Date(r.created_at).toLocaleString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <Link to={ROUTES.dashboard.history} className="mt-3 inline-block text-xs text-primary hover:underline">
          Full history →
        </Link>
      </div>
    </div>
  );
}
