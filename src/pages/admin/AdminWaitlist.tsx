import { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  focus_killer: string | null;
  created_at: string;
};

const AdminWaitlist = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Note: the existing waitlist RLS blocks SELECT for everyone. We rely on
      // the admin reading via the service role through an edge function later;
      // for now, surface the signed-up emails through the same table only if
      // the linter loosens. Here we attempt the read and gracefully degrade.
      const { data, error } = await supabase
        .from('waitlist')
        .select('id, name, email, focus_killer, created_at')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('waitlist read blocked by RLS', error);
      }
      setEntries((data ?? []) as WaitlistEntry[]);
      setLoading(false);
    })();
  }, []);

  const handleConvert = async (entry: WaitlistEntry) => {
    setConvertingId(entry.id);
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: entry.name,
        email: entry.email,
        biggest_pain: entry.focus_killer ?? null,
        source: 'waitlist_convert',
        status: 'new',
      })
      .select('id')
      .single();
    if (error || !lead) {
      toast({ title: 'Conversion failed', description: error?.message, variant: 'destructive' });
      setConvertingId(null);
      return;
    }
    await supabase.from('lead_activities').insert({
      lead_id: lead.id,
      type: 'created',
      details: { source: 'waitlist_convert', waitlist_id: entry.id },
    });
    toast({ title: 'Lead created', description: `${entry.name} moved into the pipeline.` });
    setConvertingId(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-base-content/45">Waitlist</p>
        <h1 className="premium-heading mt-1 text-2xl font-medium sm:text-3xl">Product updates list</h1>
        <p className="mt-2 text-sm text-base-content/55">
          People who joined from the public site. Convert anyone you want to actively pursue into a lead.
        </p>
      </header>

      <div className="surface-panel overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-base-content/[0.07] text-left text-[11px] font-medium uppercase tracking-wider text-base-content/45">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Pain shared</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-base-content/45">Loading…</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-base-content/45">No entries yet, or read access not enabled. Submissions still land in the database.</td></tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="border-b border-base-content/[0.04] last:border-0">
                  <td className="px-4 py-3 font-medium">{e.name}</td>
                  <td className="px-4 py-3 text-base-content/70">{e.email}</td>
                  <td className="px-4 py-3 max-w-[280px] truncate text-base-content/65">{e.focus_killer || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-base-content/55">{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleConvert(e)}
                      disabled={convertingId === e.id}
                      className="inline-flex items-center gap-1 rounded-md border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                    >
                      {convertingId === e.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                      Convert
                    </button>
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

export default AdminWaitlist;
