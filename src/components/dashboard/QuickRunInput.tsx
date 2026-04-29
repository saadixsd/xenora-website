import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

const chips = [
  {
    label: 'Launch update',
    prompt: 'I shipped a new feature and want a clean launch update + CTA for founders.',
  },
  {
    label: 'Inbound lead reply',
    prompt: 'New inbound lead asked about pricing and fit. Draft a reply and a follow-up.',
  },
  {
    label: 'Research angles',
    prompt: 'Analyze this market problem and suggest 3 content angles I can test this week.',
  },
  {
    label: 'Weekly summary',
    prompt: 'Summarize this week of work into clear progress updates and next actions.',
  },
];

interface QuickRunInputProps {
  /** Workflow template UUID — defaults to Content Agent when omitted after load */
  templateId?: string;
  footerNote?: string;
}

export function QuickRunInput({ templateId, footerNote }: QuickRunInputProps) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleRun = () => {
    if (!input.trim() || !templateId) return;
    const params = new URLSearchParams();
    params.set('template', templateId);
    params.set('input', input.trim());
    navigate(`${ROUTES.dashboard.runNew}?${params.toString()}`);
  };

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <p className="text-[13px] font-medium text-foreground mb-2.5">What should Nora handle next?</p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the outcome you want. Nora routes it to the right workflow."
        className="w-full resize-none rounded-lg border border-border bg-muted/50 p-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card"
        rows={3}
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setInput(c.prompt)}
            className="min-h-[34px] rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            {c.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleRun}
        disabled={!input.trim() || !templateId}
        className="mt-3 min-h-[44px] w-full rounded-lg bg-primary py-2.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Run workflow
      </button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">Typical run time: ~2 minutes</p>
      <p className="mt-1 rounded-md bg-primary/5 px-2 py-1 text-center text-[11px] text-muted-foreground">
        {footerNote ?? 'Nothing is sent or published until you approve.'}
      </p>
    </div>
  );
}
