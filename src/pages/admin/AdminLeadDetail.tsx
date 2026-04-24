import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  LEAD_STATUSES, SOURCE_LABEL, STATUS_LABEL, STATUS_TONE,
  generateLeadSummary, type LeadStatus,
} from '@/lib/leads';
import { toast } from '@/hooks/use-toast';

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  biggest_pain: string | null;
  preferred_time: string | null;
  source: string;
  status: LeadStatus;
  created_at: string;
};
type Note = { id: string; body: string; created_at: string };
type Activity = { id: string; type: string; details: Record<string, unknown> | null; created_at: string };

const AdminLeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (!id) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const refresh = async () => {
    if (!id) return;
    const [leadRes, notesRes, actsRes] = await Promise.all([
      supabase.from('leads').select('*').eq('id', id).maybeSingle(),
      supabase.from('lead_notes').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
      supabase.from('lead_activities').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
    ]);
    setLead((leadRes.data as Lead) ?? null);
    setNotes((notesRes.data ?? []) as Note[]);
    setActivities((actsRes.data ?? []) as Activity[]);
  };

  const handleStatusChange = async (next: LeadStatus) => {
    if (!lead || next === lead.status) return;
    setUpdating(true);
    const prev = lead.status;
    const { error: upErr } = await supabase.from('leads').update({ status: next }).eq('id', lead.id);
    if (upErr) {
      toast({ title: 'Update failed', description: upErr.message, variant: 'destructive' });
      setUpdating(false);
      return;
    }
    await supabase.from('lead_activities').insert({
      lead_id: lead.id,
      type: 'status_change',
      details: { from: prev, to: next },
    });
    setUpdating(false);
    await refresh();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !noteDraft.trim()) return;
    setSavingNote(true);
    const { error: noteErr } = await supabase.from('lead_notes').insert({
      lead_id: lead.id,
      body: noteDraft.trim(),
    });
    if (noteErr) {
      toast({ title: 'Could not save note', description: noteErr.message, variant: 'destructive' });
      setSavingNote(false);
      return;
    }
    await supabase.from('lead_activities').insert({
      lead_id: lead.id,
      type: 'note_added',
      details: { length: noteDraft.trim().length },
    });
    setNoteDraft('');
    setSavingNote(false);
    await refresh();
  };

  const handleSummary = async () => {
    if (!lead) return;
    setLoadingSummary(true);
    const text = await generateLeadSummary(lead.id);
    setSummary(text);
    setLoadingSummary(false);
  };

  if (!lead) {
    return <p className="text-sm text-base-content/55">Loading lead…</p>;
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/admin/leads')}
        className="inline-flex items-center gap-1.5 text-sm text-base-content/55 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All leads
      </button>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="premium-heading text-2xl font-medium sm:text-3xl">{lead.name}</h1>
          <p className="mt-1 text-sm text-base-content/55">
            {lead.email}{lead.company ? ` · ${lead.company}` : ''}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[lead.status]}`}>
          {STATUS_LABEL[lead.status]}
        </span>
      </header>

      <section className="surface-panel p-5 sm:p-6">
        <h2 className="text-sm font-semibold">Status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={updating || s === lead.status}
              onClick={() => handleStatusChange(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                s === lead.status
                  ? STATUS_TONE[s]
                  : 'border border-base-content/15 text-base-content/65 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface-panel space-y-4 p-5 lg:col-span-2 sm:p-6">
          <h2 className="text-sm font-semibold">Lead details</h2>
          <Detail label="Email"><a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a></Detail>
          <Detail label="Company">{lead.company || '—'}</Detail>
          <Detail label="Website">
            {lead.website
              ? <a href={lead.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{lead.website}</a>
              : '—'}
          </Detail>
          <Detail label="Source">{SOURCE_LABEL[lead.source] ?? lead.source}</Detail>
          <Detail label="Preferred time">{lead.preferred_time || '—'}</Detail>
          <Detail label="Created">{new Date(lead.created_at).toLocaleString()}</Detail>
          <Detail label="Biggest pain">
            <p className="whitespace-pre-wrap leading-relaxed text-base-content/80">{lead.biggest_pain || '—'}</p>
          </Detail>
        </section>

        <section className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Xenora AI summary</h2>
            <span className="rounded-full bg-base-content/[0.05] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-base-content/45">
              Stub
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-base-content/55">
            Once enabled, this panel will summarize the lead and suggest the next best action using your notes and activity.
          </p>
          <button
            type="button"
            onClick={handleSummary}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
          >
            {loadingSummary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Generate placeholder
          </button>
          {summary ? (
            <p className="mt-3 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-base-content/75">
              {summary}
            </p>
          ) : null}
        </section>
      </div>

      <section className="surface-panel p-5 sm:p-6">
        <h2 className="text-sm font-semibold">Notes</h2>
        <form onSubmit={handleAddNote} className="mt-3 space-y-2">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Add a note about this lead..."
            rows={3}
            className="form-input resize-y"
          />
          <button
            type="submit"
            disabled={savingNote || !noteDraft.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {savingNote ? 'Saving...' : 'Add note'}
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="mt-5 text-sm text-base-content/45">No notes yet.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-md border border-base-content/[0.06] p-3">
                <p className="whitespace-pre-wrap text-sm text-base-content/80">{n.body}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-base-content/45">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-panel p-5 sm:p-6">
        <h2 className="text-sm font-semibold">Timeline</h2>
        {activities.length === 0 ? (
          <p className="mt-3 text-sm text-base-content/45">No activity yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activities.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <div className="flex-1">
                  <p className="text-sm text-base-content/80">{describe(a)}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/45">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr]">
      <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/45">{label}</p>
      <div className="text-sm text-base-content/80">{children}</div>
    </div>
  );
}

function describe(a: Activity): string {
  if (a.type === 'created') {
    const d = a.details as { source?: string };
    return `Lead created from ${d?.source?.replace('_', ' ') ?? 'unknown source'}`;
  }
  if (a.type === 'status_change') {
    const d = a.details as { from?: string; to?: string };
    return `Status changed: ${STATUS_LABEL[d.from as LeadStatus] ?? d.from} → ${STATUS_LABEL[d.to as LeadStatus] ?? d.to}`;
  }
  if (a.type === 'note_added') return 'Note added';
  return a.type;
}

export default AdminLeadDetail;
