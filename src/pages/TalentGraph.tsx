import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Instagram, Linkedin, Search, Sparkles, MessageSquare } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';
import { StageProgress } from '@/components/talentgraph/StageProgress';
import { CandidateCard } from '@/components/talentgraph/CandidateCard';
import { NoraChatDrawer } from '@/components/talentgraph/NoraChatDrawer';
import {
  fetchGitHubCandidateBundle,
  normalizeGitHubHandleOrUrl,
  searchGitHubUserLogins,
  type GitHubCandidateBundle,
} from '@/lib/talentgraph/github';
import { buildTasteProfile, scoreCandidate, type TasteProfile, type ScoredCandidate } from '@/lib/talentgraph/talentgraph';

type Stage = 'input' | 'parsing' | 'matching' | 'scoring' | 'done';

const DEFAULT_INPUTS = [
  'https://github.com/vercel',
  'https://github.com/sindresorhus',
  'https://github.com/tj',
];

const TalentGraph = () => {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);
  const [stage, setStage] = useState<Stage>('input');
  const [error, setError] = useState('');
  const [taste, setTaste] = useState<TasteProfile | null>(null);
  const [results, setResults] = useState<ScoredCandidate[]>([]);

  // Nora drawer state
  const [noraOpen, setNoraOpen] = useState(false);
  const [noraInitialMsg, setNoraInitialMsg] = useState<string | undefined>();

  const canRun = stage === 'input' || stage === 'done';
  const cleaned = useMemo(() => inputs.map((v) => v.trim()).filter(Boolean), [inputs]);
  const isRunning = stage !== 'input' && stage !== 'done';

  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const updateInput = (idx: number, value: string) => {
    setInputs((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const openNoraFor = (login: string) => {
    setNoraInitialMsg(`Tell me about @${login}'s fit for my team based on the taste profile.`);
    setNoraOpen(true);
  };

  const openNora = () => {
    setNoraInitialMsg(undefined);
    setNoraOpen(true);
  };

  const run = async () => {
    if (!canRun) return;
    setError('');
    setResults([]);
    setTaste(null);

    try {
      const normalized = inputs.map((v) => normalizeGitHubHandleOrUrl(v));
      if (normalized.some((v) => !v)) {
        throw new Error('Add 3 valid GitHub URLs or handles (e.g. https://github.com/username).');
      }

      setStage('parsing');
      const exemplars: GitHubCandidateBundle[] = await Promise.all(
        normalized.map((handle) => fetchGitHubCandidateBundle(handle!)),
      );

      setStage('matching');
      const tasteProfile = await buildTasteProfile(exemplars);
      setTaste(tasteProfile);

      const query = tasteProfile.searchQuery || tasteProfile.primaryLanguages?.join(' ') || 'typescript react';
      const logins = await searchGitHubUserLogins(query, 20);
      const unique = Array.from(new Set(logins)).filter(
        (login) => !new Set(exemplars.map((e) => e.user.login.toLowerCase())).has(login.toLowerCase()),
      );
      const candidateLogins = unique.slice(0, 10);

      setStage('scoring');
      const bundles = await Promise.all(candidateLogins.map((login) => fetchGitHubCandidateBundle(login)));
      const scored = await Promise.all(
        bundles.map((bundle) => scoreCandidate(tasteProfile, bundle)),
      );

      setResults(scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)));
      setStage('done');
    } catch (e) {
      setStage('input');
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NeuralMeshBackground />

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={smoothTop} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-foreground sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-3 pb-20 pt-24 sm:px-6 md:px-8 md:pt-28">
        {/* Hero */}
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              TalentGraph demo
            </div>
            <h1 className="premium-heading text-2xl font-medium sm:text-3xl md:text-4xl">
              Find 10 more hires like your best 3
            </h1>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Paste 3 GitHub profiles you loved working with. We build a taste profile and rank candidates from the open web starting with GitHub.
            </p>
          </div>
        </Reveal>

        <section className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-[400px_1fr]">
          {/* Left panel — inputs */}
          <Reveal delay={0.05}>
            <div className="surface-panel p-4 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-semibold text-foreground">Your 3 examples</h2>
                {isRunning && <StageProgress stage={stage} />}
              </div>

              <div className="mt-4 space-y-3">
                {inputs.map((value, idx) => (
                  <label key={idx} className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">GitHub #{idx + 1}</span>
                    <input
                      className="w-full rounded-xl border border-border bg-card/35 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                      value={value}
                      placeholder="https://github.com/username"
                      onChange={(e) => updateInput(idx, e.target.value)}
                      disabled={!canRun}
                    />
                  </label>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => void run()}
                  disabled={!canRun || cleaned.length < 3}
                >
                  <Search className="h-4 w-4" />
                  Run TalentGraph
                </button>
                <button
                  type="button"
                  onClick={openNora}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <MessageSquare className="h-4 w-4" />
                  Ask Nora
                </button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground/50">
                This is a public demo. Searches are rate-limited to prevent abuse.
              </p>
            </div>
          </Reveal>

          {/* Right panel — results */}
          <Reveal delay={0.08}>
            <div className="space-y-6">
              {/* Taste profile */}
              <div className="surface-panel p-4 sm:p-6">
                <h2 className="text-sm font-semibold text-foreground">Taste profile</h2>
                {!taste ? (
                  <p className="mt-3 text-sm text-muted-foreground">Run a search to generate a taste profile.</p>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <p className="text-xs text-muted-foreground">Primary languages</p>
                      <p className="mt-2 text-sm text-foreground/75">
                        {(taste.primaryLanguages || []).slice(0, 6).join(', ') || '—'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <p className="text-xs text-muted-foreground">Signals</p>
                      <p className="mt-2 text-sm text-foreground/75">
                        {(taste.signals || []).slice(0, 6).join(', ') || '—'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-4 sm:col-span-2">
                      <p className="text-xs text-muted-foreground">Search query</p>
                      <p className="mt-2 text-sm text-foreground/75">{taste.searchQuery || '—'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Candidates */}
              <div className="surface-panel p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Ranked candidates</h2>
                  {results.length > 0 && (
                    <span className="text-xs text-muted-foreground">{results.length} results</span>
                  )}
                </div>

                {!results.length ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {isRunning ? 'Scoring candidates…' : 'Results will show here after scoring.'}
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {results.map((c) => (
                      <CandidateCard
                        key={c.user.login}
                        candidate={c}
                        onAskNora={openNoraFor}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Floating Nora FAB */}
      {!noraOpen && (
        <button
          onClick={openNora}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Ask Nora"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}

      {/* Nora Drawer */}
      <NoraChatDrawer
        open={noraOpen}
        onClose={() => setNoraOpen(false)}
        taste={taste}
        results={results}
        initialMessage={noraInitialMsg}
      />

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-sm font-medium text-muted-foreground">XenoraAI</p>
            <div className="flex items-center gap-3 text-muted-foreground/60">
              <a href="https://www.linkedin.com/company/xenoraai" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/xenoraai" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs text-muted-foreground/50">@XenoraAI 2026</p>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground sm:justify-end">
            <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-foreground">FAQ</Link>
            <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TalentGraph;
