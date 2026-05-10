import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import type { WorkflowItemType } from '@/lib/workflowItems';
import { getCurrentWorkspaceId } from '@/lib/currentWorkspace';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

/**
 * Right-side drawer for quickly capturing an idea, reply, or follow-up. Items land in
 * the `idea` stage (no run linked) and surface on the workflow board immediately.
 */
export function CaptureSidePanel({ open, onClose, onCreated }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [type, setType] = useState<WorkflowItemType>('idea');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const reset = () => {
    setType('idea');
    setTitle('');
    setBody('');
  };

  const submit = async () => {
    if (!user || !body.trim()) return;
    setSaving(true);
    let workspaceId: string;
    try {
      workspaceId = await getCurrentWorkspaceId(user.id);
    } catch (e) {
      setSaving(false);
      toast({ title: 'Workspace unavailable', description: (e as Error).message, variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('workflow_items').insert({
      user_id: user.id,
      workspace_id: workspaceId,
      type,
      stage: 'idea',
      title: title.trim() || null,
      input_text: body.trim(),
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Captured', description: 'Item added to the Ideas lane.' });
    reset();
    onCreated?.();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50" aria-hidden onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-[85] flex h-[100dvh] w-full max-w-[min(26rem,100vw)] flex-col border-l border-[var(--dash-border)] bg-[var(--dash-surface)] pt-[env(safe-area-inset-top,0px)] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[var(--dash-border)] px-4 py-3">
          <div>
            <p className="font-space-mono text-[10.5px] uppercase tracking-wider text-[var(--dash-faint)]">Capture</p>
            <p className="text-[13px] font-medium text-[var(--dash-text)]">Add to your workspace</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-m-1 rounded-md p-1 text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)]"
            aria-label="Close capture panel"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="dash-label mb-1 block">Type</label>
            <div className="flex flex-wrap gap-1.5">
              {(['idea', 'post', 'reply', 'follow_up'] as WorkflowItemType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={
                    'rounded-md border px-2.5 py-1 text-[11px] capitalize transition-colors ' +
                    (type === t
                      ? 'border-[var(--dash-accent)] bg-[var(--dash-accent-dim)] text-[var(--dash-accent)]'
                      : 'border-[var(--dash-border)] text-[var(--dash-muted)] hover:text-[var(--dash-text)]')
                  }
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="dash-label mb-1 block">Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short label"
              className="w-full rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-deep)] px-3 py-2 text-[13px] text-[var(--dash-text)] outline-none focus:border-[var(--dash-accent)]"
            />
          </div>

          <div>
            <label className="dash-label mb-1 block">What's on your mind?</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Drop the raw thought, the lead context, or the reply you want Nora to handle later."
              className="w-full resize-y rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-deep)] px-3 py-2 text-[13px] text-[var(--dash-text)] outline-none focus:border-[var(--dash-accent)]"
            />
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-[var(--dash-border)] px-4 py-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" disabled={saving || !body.trim()} onClick={() => void submit()}>
            {saving ? 'Saving…' : 'Capture'}
          </Button>
        </footer>
      </aside>
    </>
  );
}
