import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const flow = [
  {
    key: 'OBSERVE',
    detail: 'Tracks screen time, app switches, keyboard patterns, and deep work sessions (permissioned).',
  },
  {
    key: 'ANALYZE',
    detail: 'Uses a local LLM (Ollama on Mac, MLC-LLM on mobile) to detect personal focus patterns.',
  },
  {
    key: 'PLAN',
    detail: 'Generates a realistic daily schedule based on your behavior, not generic templates.',
  },
  {
    key: 'EXECUTE',
    detail: 'Auto-blocks distractions, starts playlists/timers, and sends minimal intervention notifications.',
  },
  {
    key: 'ADAPT',
    detail: 'Learns from each day and refines the next-day plan with measurable improvements.',
  },
];

const schema = z.object({
  email: z.string().trim().email('Enter a valid email').max(255),
});

const NoraFocus = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setServerError('');

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email');
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({ name: parsed.data.email.split('@')[0], email: parsed.data.email, focus_killer: 'Nora Focus beta interest' });
    setLoading(false);

    if (insertError) {
      if (insertError.code === '23505') {
        setServerError("You're already on the list.");
      } else {
        setServerError('Something went wrong. Try again.');
      }
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="border-b border-base-content/[0.08] bg-base-100/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 py-2 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-base-content/75 transition-colors hover:text-base-content">
            <ArrowLeft className="h-4 w-4" />
            XenoraAI
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8">
        <section className="surface-panel border-base-content/[0.1] p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/85">Nora Focus</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Nora Focus</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-base-content/70 sm:text-lg">
            AI learns your focus fails, schedules targeted fixes, and locks distractions before they compound.
          </p>
        </section>

        <section className="mt-10">
          <div className="surface-panel overflow-hidden p-0">
            <div className="grid border-b border-base-content/[0.1] bg-base-200/35 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/60 md:grid-cols-[160px_1fr]">
              <p>Step</p>
              <p>System behavior</p>
            </div>
            {flow.map((item) => (
              <div key={item.key} className="grid gap-2 border-b border-base-content/[0.08] px-5 py-4 last:border-b-0 md:grid-cols-[160px_1fr] md:gap-0">
                <p className="text-sm font-semibold text-primary">{item.key}</p>
                <p className="text-sm leading-relaxed text-base-content/70">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="mt-5 grid gap-4">
            <article className="surface-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/85">9:00 AM</p>
              <p className="mt-2 text-sm text-base-content/70">
                “Good morning. Yesterday you had 4 focused hours. Today&apos;s plan: Deep work 10-12, short break, then 1-3pm focused session.”
              </p>
              <p className="mt-2 text-sm text-base-content/60">
                Tap to activate and Nora blocks distractions while starting your selected focus playlist.
              </p>
            </article>
            <article className="surface-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/85">3:00 PM</p>
              <p className="mt-2 text-sm text-base-content/70">
                “Distraction spike detected. Want a 2-minute breather or override?”
              </p>
            </article>
            <article className="surface-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/85">End of day</p>
              <p className="mt-2 text-sm text-base-content/70">
                “You beat yesterday&apos;s record by 45 minutes. Tomorrow we&apos;ll suggest blocking Slack during deep work too.”
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12 max-w-lg">
          <h2 className="text-2xl font-semibold">Nora Focus Beta</h2>
          <p className="mt-2 text-sm text-base-content/60">Email only. We will contact you as beta capacity opens.</p>
          <form onSubmit={onSubmit} className="surface-panel mt-5 space-y-3 p-5">
            <label className="form-control w-full">
              <span className="mb-1 text-xs text-base-content/55">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full border-base-content/10 bg-base-200/60"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </label>
            {error && <p className="text-xs text-error">{error}</p>}
            {serverError && <p className="text-xs text-error">{serverError}</p>}
            {success && <p className="text-xs text-primary">You&apos;re on the list.</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Submitting...' : 'Join waitlist'}
            </button>
          </form>
        </section>
      </main>

      <footer className="border-t border-base-content/[0.08] px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-sm font-medium text-base-content/60">XenoraAI</p>
            <div className="flex items-center gap-3 text-base-content/50">
              <a href="https://www.linkedin.com/company/xenoraai" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-base-content/85">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://twitter.com/xenoraai" target="_blank" rel="noreferrer" aria-label="Twitter" className="transition-colors hover:text-base-content/85">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://x.com/xenoraai" target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-base-content/85">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.4 22H3.3l7.24-8.27L1 2h6.35l4.38 5.78L18.9 2z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs text-base-content/45">XenoraAI 2026</p>
            <p className="text-xs text-base-content/40">@XenoraAI 2026</p>
            <p className="text-[11px] tracking-[0.16em] text-base-content/35">~Know Beyond</p>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
            <Link to="/privacy" className="transition-colors hover:text-base-content/85">Privacy</Link>
            <Link to="/faq" className="transition-colors hover:text-base-content/85">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NoraFocus;
