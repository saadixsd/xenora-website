import { useState, useEffect } from 'react';
import { X, Copy, Check, ArrowRight, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  STAGE_LABEL,
  TYPE_LABEL,
  nextStage,
  type WorkflowItem,
  type WorkflowItemStage,
} from '@/lib/workflowItems';
import { cn } from '@/lib/utils';

interface Props {
  item: WorkflowItem;
  onClose: () => void;
  onChange: (item: WorkflowItem) => void;
  onDelete: (id: string) => void;
}

/**
 * Right-rail detail for a single workflow_item. Lets the user edit the AI draft,
 * advance it through the stage pipeline (Review → Ready → Sent), or delete it.
 */
export function WorkflowItemDetail({ item, onClose, onChange, onDelete }: Props) {
  const [draft, setDraft] = useState(item.ai_draft ?? '');
  const [title, setTitle] = useState(item.title ?? '');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(item.ai_draft ?? '');
    setTitle(item.title ?? '');
  }, [item.id, item.ai_draft, item.title]);

  const dirty = draft !== (item.ai_draft ?? '') || title !== (item.title ?? '');

  const persist = async (patch: Partial<WorkflowItem>): Promise<WorkflowItem | null> => {
    setSaving(true);
    const { data, error } = await supabase
      .from('workflow_items')
      .update(patch)
      .eq('id', item.id)
      .select()
      .single();
    setSaving(false);
    if (error || !data) return null;
    onChange(data as WorkflowItem);
    return data as WorkflowItem;
  };

  const handleSave = async () => {
    if (!dirty) return;
    await persist({ ai_draft: draft, title: title || null });
  };

  const advance = async () => {
    const ns = nextStage(item.stage);
    if (!ns) return;
    if (dirty) {
      await persist({ ai_draft: draft, title: title || null, stage: ns });
    } else {
      await persist({ stage: ns });
    }
  };

  const moveTo = async (stage: WorkflowItemStage) => {
    if (stage === item.stage) return;
    await persist({ stage });
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this item permanently?')) return;
    const { error } = await supabase.from('workflow_items').delete().eq('id', item.id);
    if (!error) onDelete(item.id);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const ns = nextStage(item.stage);

  return (
    <div className="flex h-full flex-col bg-[var(--dash-surface)]">
      <header className="flex items-start justify-between gap-3 border-b border-[var(--dash-border)] px-4 py-3">
        <div className="min-w-0">
          <p className="font-space-mono text-[10.5px] uppercase tracking-wider text-[var(--dash-faint)]">
            {TYPE_LABEL[item.type]} · {STAGE_LABEL[item.stage]}
            {item.platform ? ` · ${item.platform}` : ''}
          </p>
          <p className="mt-1 truncate text-[13px] font-medium text-[var(--dash-text)]">
            {item.title || 'Untitled item'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-m-1 rounded-md p-1 text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)]"
          aria-label="Close detail"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="dash-label mb-1 block">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short, recognisable label"
            className="w-full rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-deep)] px-3 py-2 text-[13px] text-[var(--dash-text)] outline-none focus:border-[var(--dash-accent)]"
          />
        </div>

        {item.input_text && (
          <div>
            <label className="dash-label mb-1 block">Original input</label>
            <p className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-deep)] px-3 py-2 text-[12px] leading-relaxed text-[var(--dash-muted)] whitespace-pre-wrap">
              {item.input_text}
            </p>
          </div>
        )}

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="dash-label">Draft</label>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="flex items-center gap-1 text-[11px] text-[var(--dash-muted)] hover:text-[var(--dash-text)]"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-deep)] px-3 py-2 text-[13px] leading-relaxed text-[var(--dash-text)] outline-none focus:border-[var(--dash-accent)]"
          />
        </div>

        <div>
          <label className="dash-label mb-2 block">Move to stage</label>
          <div className="flex flex-wrap gap-1.5">
            {(['idea', 'drafting', 'review', 'ready', 'sent'] as WorkflowItemStage[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void moveTo(s)}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-[11px] transition-colors',
                  s === item.stage
                    ? 'border-[var(--dash-accent)] bg-[var(--dash-accent-dim)] text-[var(--dash-accent)]'
                    : 'border-[var(--dash-border)] text-[var(--dash-muted)] hover:border-[var(--dash-accent-hover)] hover:text-[var(--dash-text)]',
                )}
              >
                {STAGE_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--dash-border)] px-4 py-3">
        <button
          type="button"
          onClick={() => void handleDelete()}
          className="flex items-center gap-1.5 text-[12px] text-[var(--dash-faint)] hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!dirty || saving} onClick={() => void handleSave()}>
            {saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
          </Button>
          {ns && (
            <Button size="sm" disabled={saving} onClick={() => void advance()} className="gap-1.5">
              Move to {STAGE_LABEL[ns]}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
