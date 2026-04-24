import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LEAD_STATUSES, SOURCE_LABEL, STATUS_LABEL, STATUS_TONE, type LeadStatus } from '@/lib/leads';

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  source: string;
  status: LeadStatus;
  created_at: string;
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | string>('all');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, email, company, source, status, created_at')
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      setLeads((data ?? []) as Lead[]);
      setLoading(false);
    })();
  }, []);

  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))), [leads]);
  const filtered = leads.filter(
    (l) => (statusFilter === 'all' || l.status === statusFilter) && (sourceFilter === 'all' || l.source === sourceFilter),
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-base-content/45">Pipeline</p>
        <h1 className="premium-heading mt-1 text-2xl font-medium sm:text-3xl">Leads</h1>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as 'all' | LeadStatus)}
          options={[{ value: 'all', label: 'All statuses' }, ...LEAD_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))]}
        />
        <FilterSelect
          label="Source"
          value={sourceFilter}
          onChange={setSourceFilter}
          options={[
            { value: 'all', label: 'All sources' },
            ...sources.map((s) => ({ value: s, label: SOURCE_LABEL[s] ?? s })),
          ]}
        />
        <p className="ml-auto text-xs text-base-content/45">
          {filtered.length} of {leads.length}
        </p>
      </div>

      <div className="surface-panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-base-content/[0.07] text-left text-[11px] font-medium uppercase tracking-wider text-base-content/45">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-base-content/45">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-base-content/45">No leads match these filters yet.</td></tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className="border-b border-base-content/[0.04] last:border-0 hover:bg-base-content/[0.02]">
                  <td className="px-4 py-3">
                    <Link to={`/admin/leads/${l.id}`} className="font-medium text-base-content hover:text-primary">
                      {l.name}
                    </Link>
                    <p className="text-xs text-base-content/45">{l.email}</p>
                  </td>
                  <td className="px-4 py-3 text-base-content/70">{l.company || '—'}</td>
                  <td className="px-4 py-3 text-base-content/70">{SOURCE_LABEL[l.source] ?? l.source}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[l.status]}`}>
                      {STATUS_LABEL[l.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-base-content/55">
                    {new Date(l.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-base-content/55">
      <span className="font-mono uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-base-content/15 bg-base-100/60 px-2 py-1 text-sm text-base-content focus:border-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export default AdminLeads;
