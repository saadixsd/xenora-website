import { useState } from 'react';
import { Copy, Check, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  x_post: 'X Post',
  hook: 'Hook',
  linkedin_post: 'LinkedIn Post',
  cta: 'CTA',
};

interface OutputCardProps {
  type: string;
  content: string;
  position?: number;
}

export function OutputCard({ type, content }: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editing ? editValue : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="surface-panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {TYPE_LABELS[type] || type}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              editing && 'bg-muted text-foreground'
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
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
          rows={4}
        />
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{content}</p>
      )}
    </div>
  );
}
