import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sparkles, Trophy, XCircle, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { STATUS_LABEL, type LeadStatus } from '@/lib/leads';

type CountMap = Record<string, number>;
type Activity = {
  id: string;
  lead_id: string;
  type: string;
  details: Record<string, unknown> | null;
  created_at: string;
  leads: { name: string | null; email: string | null } | null;
};

const AdminOverview = () => {
  const [counts, setCounts] = useState<CountMap>({});
  const [total, setTotal] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [leadsRes, actsRes] = await Promise.all([
        supabase.from('leads').select('status'),
        supabase
          .from('lead_activities')
          .select('id, lead_id, type, details, created_at, leads!inner(name, email)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (cancelled) return;

      const grouped: CountMap = {};
      (leadsRes.data ?? []).forEach((row: { status: string }) => {
        grouped[row.status] = (grouped[row.status] ?? 0) + 1;
      });
      setCounts(grouped);
      setTotal(leadsRes.data?.length ?? 0);
      setActivities((actsRes.data ?? []) as unknown as Activity[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const cards = [
    { label: 'Total leads', value: total, icon: Users, tone: 'text-base-content' },
    { label: 'New', value: counts.new ?? 0, icon: Sparkles, tone: 'text-primary' },
    { label: 'Qualified', value: counts.qualified ?? 0, icon: Sparkles, tone: 'text-sky-300' },
    { label: 'Won', value: counts.won ?? 0, icon: Trophy, tone: 'text-emerald-300' },
    { label: 'Lost', value: counts.lost ?? 0, icon: XCircle, tone: 'text-rose-300' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-base-content/45">Overview</p>
          <h1 className="premium-heading mt-1 text-2xl font-medium sm:text-3xl">Pipeline at a glance</h1>
        </div>
        <Link
          to="/admin/leads"
          className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
        >
          View all leads <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="surface-panel p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-base-content/45">{label}</p>
              <Icon className={`h-4 w-4 ${tone}`} />
            </div>
            <p className="mt-2 font-syne text-3xl font-semibold">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <section className="surface-panel p-5 sm:p-6">
        <h2 className="text-base font-semibold">Recent activity</h2>
        <p className="mt-1 text-xs text-base-content/45">Last 5 events across all leads.</p>

        {loading ? (
          <p className="mt-6 text-sm text-base-content/45">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="mt-6 text-sm text-base-content/45">No activity yet. Submissions from the contact form will appear here.</p>
        ) : (
          <ul className="mt-5 divide-y divide-base-content/[0.06]">
            {activities.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <Link
                    to={`/admin/leads/${a.lead_id}`}
                    className="font-medium text-base-content hover:text-primary"
                  >
                    {a.leads?.name ?? 'Unknown lead'}
                  </Link>
                  <p className="truncate text-xs text-base-content/55">{describeActivity(a)}</p>
                </div>
                <time className="font-mono text-xs text-base-content/45">
                  {new Date(a.created_at).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

function describeActivity(a: Activity): string {
  if (a.type === 'created') return 'Created from ' + (a.details as { source?: string })?.source?.replace('_', ' ');
  if (a.type === 'status_change') {
    const d = a.details as { from?: string; to?: string };
    return `Status changed: ${STATUS_LABEL[d.from as LeadStatus] ?? d.from} → ${STATUS_LABEL[d.to as LeadStatus] ?? d.to}`;
  }
  if (a.type === 'note_added') return 'Note added';
  return a.type;
}

export default AdminOverview;
