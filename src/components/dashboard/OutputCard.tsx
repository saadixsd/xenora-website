import { useState, useEffect } from 'react';
import { Copy, Check, Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  x_post: 'X Post',
  hook: 'Hook',
  linkedin_post: 'LinkedIn Post',
  cta: 'CTA',
  lead_summary: 'Lead summary',
  score_rationale: 'Score rationale',
  lead_reply_draft: 'Reply draft',
  follow_up_48h: '48h follow-up',
  objections_to_watch: 'Objections to watch',
  pain_signals: 'Pain signals',
  content_angles: 'Content angles',
  quotes_evidence: 'Quotes / evidence',
  relevance_rationale: 'Relevance',
  research_caveats: 'Caveats',
};

function formatTypeLabel(type: string): string {
  return (
    TYPE_LABELS[type] ||
    type
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

const MARKDOWN_TYPES = new Set([
  'pain_signals',
  'content_angles',
  'quotes_evidence',
  'relevance_rationale',
  'research_caveats',
  'objections_to_watch',
]);

interface OutputCardProps {
  id?: string;
  type: string;
  content: string;
  position?: number;
}

export function OutputCard({ id, type, content }: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditValue(content);
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editing ? editValue : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleEdit = async () => {
    if (editing && id && editValue !== content) {
      setSaving(true);
      const { error } = await supabase.from('workflow_outputs').update({ content: editValue }).eq('id', id);
      setSaving(false);
      if (error) {
        setEditValue(content);
      }
    }
    setEditing(!editing);
  };

  const useMarkdown = MARKDOWN_TYPES.has(type);

  return (
    <div className="surface-panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {formatTypeLabel(type)}
        </span>
        <div className="flex items-center gap-1">
          {id && (
            <button
              type="button"
              onClick={() => void toggleEdit()}
              disabled={saving}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                editing && 'bg-muted text-foreground',
              )}
              aria-label={editing ? 'Save' : 'Edit'}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-card/50 p-3 text-sm text-foreground outline-none focus:border-primary/30"
          rows={6}
        />
      ) : useMarkdown ? (
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{content}</p>
      )}
    </div>
  );
}
