import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const chips = [
  { label: 'X post', prompt: 'Turn this into a punchy X post under 280 characters' },
  { label: 'LinkedIn post', prompt: 'Turn this into a LinkedIn post' },
  { label: '3 hooks', prompt: 'Give me 3 short hooks for this idea' },
  { label: 'Tighten', prompt: 'Tighten this into one sharp paragraph' },
];

interface QuickRunInputProps {
  contentTemplateId?: string;
}

export function QuickRunInput({ contentTemplateId }: QuickRunInputProps) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleRun = () => {
    if (!input.trim()) return;
    const params = new URLSearchParams();
    if (contentTemplateId) params.set('template', contentTemplateId);
    params.set('input', input.trim());
    navigate(`/dashboard/run/new?${params.toString()}`);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[13px] font-medium text-foreground mb-2.5">Quick run</p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Drop a rough idea, note, or email thread here…"
        className="w-full resize-none rounded-lg border border-border bg-muted/50 p-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card"
        rows={3}
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setInput(c.prompt)}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            {c.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleRun}
        disabled={!input.trim()}
        className="mt-3 w-full rounded-lg bg-primary py-2.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Run Nora →
      </button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Runs the Content Agent workflow — steps are visible on the run page.
      </p>
    </div>
  );
}
