import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Instagram, Linkedin, Search, Sparkles } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';
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

function stageLabel(stage: Stage): string {
  switch (stage) {
    case 'input':
      return 'Ready';
    case 'parsing':
      return 'Parsing your 3 examples…';
    case 'matching':
      return 'Building your taste profile…';
    case 'scoring':
      return 'Scoring candidates…';
    case 'done':
      return 'Done';
  }
}

function scoreColor(score: number): string {
  if (score >= 85) return 'text-primary';
  if (score >= 70) return 'text-success';
  if (score >= 55) return 'text-warning';
  return 'text-base-content/60';
}

const TalentGraph = () => {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);
  const [stage, setStage] = useState<Stage>('input');
  const [error, setError] = useState('');
  const [taste, setTaste] = useState<TasteProfile | null>(null);
  const [results, setResults] = useState<ScoredCandidate[]>([]);

  const canRun = stage === 'input' || stage === 'done';
  const cleaned = useMemo(() => inputs.map((v) => v.trim()).filter(Boolean), [inputs]);

  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const updateInput = (idx: number, value: string) => {
    setInputs((prev) => prev.map((v, i) => (i === idx ? value : v)));
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

      // v1: simple GitHub search (public, no token). Cap to avoid quota burn.
      const query = tasteProfile.searchQuery || tasteProfile.primaryLanguages?.join(' ') || 'typescript react';
      const logins = await searchGitHubUserLogins(query, 20);
      const unique = Array.from(new Set(logins)).filter(
        (login) => !new Set(exemplars.map((e) => e.user.login.toLowerCase())).has(login.toLowerCase()),
      );
      const candidateLogins = unique.slice(0, 10);

      setStage('scoring');
      const bundles = await Promise.all(candidateLogins.map((login) => fetchGitHubCandidateBundle(login)));
      const scored = await Promise.all(
        bundles.map(async (bundle) => {
          const scoredCandidate = await scoreCandidate(tasteProfile, bundle);
          return scoredCandidate;
        }),
      );

      setResults(scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)));
      setStage('done');
    } catch (e) {
      setStage('input');
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={smoothTop} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-200/40 px-4 py-2 text-xs text-base-content/60">
              <Sparkles className="h-4 w-4" />
              TalentGraph demo
            </div>
            <h1 className="premium-heading text-3xl font-medium sm:text-4xl">Find 10 more hires like your best 3</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-base-content/55 sm:text-base">
              Paste 3 GitHub profiles you loved working with. We build a taste profile and rank candidates from the open web starting with GitHub.
            </p>
          </div>
        </Reveal>

        <section className="mt-10 grid gap-6 lg:grid-cols-[420px_1fr]">
          <Reveal delay={0.05}>
            <div className="surface-panel p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-base-content">Your 3 examples</h2>
                <span className="text-xs text-base-content/40">{stageLabel(stage)}</span>
              </div>

              <div className="mt-4 space-y-3">
                {inputs.map((value, idx) => (
                  <label key={idx} className="block">
                    <span className="mb-1 block text-xs text-base-content/45">GitHub #{idx + 1}</span>
                    <input
                      className="input input-bordered w-full bg-base-100"
                      value={value}
                      placeholder="https://github.com/username"
                      onChange={(e) => updateInput(idx, e.target.value)}
                      disabled={!canRun}
                    />
                  </label>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="btn btn-primary flex-1"
                  onClick={() => void run()}
                  disabled={!canRun || cleaned.length < 3}
                >
                  <Search className="h-4 w-4" />
                  Run TalentGraph
                </button>
                <Link to="/try-nora" className="btn btn-ghost border border-base-content/10">
                  Ask Nora
                </Link>
              </div>

              <p className="mt-3 text-xs text-base-content/35">
                This is a public demo. Searches are rate-limited to prevent abuse.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-6">
              <div className="surface-panel p-6">
                <h2 className="text-sm font-semibold text-base-content">Taste profile</h2>
                {!taste ? (
                  <p className="mt-3 text-sm text-base-content/45">Run a search to generate a taste profile.</p>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-base-content/10 bg-base-200/30 p-4">
                      <p className="text-xs text-base-content/45">Primary languages</p>
                      <p className="mt-2 text-sm text-base-content/75">
                        {(taste.primaryLanguages || []).slice(0, 6).join(', ') || '—'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-base-content/10 bg-base-200/30 p-4">
                      <p className="text-xs text-base-content/45">Signals</p>
                      <p className="mt-2 text-sm text-base-content/75">
                        {(taste.signals || []).slice(0, 6).join(', ') || '—'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-base-content/10 bg-base-200/30 p-4 sm:col-span-2">
                      <p className="text-xs text-base-content/45">Search query</p>
                      <p className="mt-2 text-sm text-base-content/75">{taste.searchQuery || '—'}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="surface-panel p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-base-content">Ranked candidates</h2>
                  <span className="text-xs text-base-content/40">{results.length ? `${results.length} results` : ''}</span>
                </div>

                {!results.length ? (
                  <p className="mt-3 text-sm text-base-content/45">
                    Results will show here after scoring.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {results.map((c) => (
                      <article key={c.user.login} className="rounded-xl border border-base-content/10 bg-base-100 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-base-content">
                              {c.user.name || c.user.login}{' '}
                              <span className="text-sm font-normal text-base-content/45">@{c.user.login}</span>
                            </p>
                            <p className="mt-1 text-sm text-base-content/55">{c.user.location || 'Location unknown'}</p>
                            {c.user.bio && (
                              <p className="mt-2 text-sm text-base-content/55 line-clamp-3">{c.user.bio}</p>
                            )}
                          </div>
                          <div className="shrink-0 text-left sm:text-right">
                            <div className={`text-4xl font-semibold leading-none ${scoreColor(c.score ?? 0)}`}>
                              {c.score ?? '—'}
                            </div>
                            <div className="mt-1 text-xs text-base-content/40">taste score</div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-lg border border-base-content/10 bg-base-200/25 px-3 py-2">
                            <p className="text-[11px] text-base-content/40">Skills</p>
                            <p className="text-sm text-base-content/75">{c.skillsScore ?? '—'}</p>
                          </div>
                          <div className="rounded-lg border border-base-content/10 bg-base-200/25 px-3 py-2">
                            <p className="text-[11px] text-base-content/40">Output</p>
                            <p className="text-sm text-base-content/75">{c.outputScore ?? '—'}</p>
                          </div>
                          <div className="rounded-lg border border-base-content/10 bg-base-200/25 px-3 py-2">
                            <p className="text-[11px] text-base-content/40">Vibe</p>
                            <p className="text-sm text-base-content/75">{c.vibeScore ?? '—'}</p>
                          </div>
                        </div>

                        {c.whyThisOne && (
                          <p className="mt-4 text-sm italic text-base-content/60">“{c.whyThisOne}”</p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <a
                            className="btn btn-sm btn-outline"
                            href={`https://github.com/${c.user.login}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View GitHub
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-base-content/[0.07] px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-sm font-medium text-base-content/60">XenoraAI</p>
            <div className="flex items-center gap-3 text-base-content/50">
              <a href="https://www.linkedin.com/company/xenoraai" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-base-content/85">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/xenoraai" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-base-content/85">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs text-base-content/40">@XenoraAI 2026</p>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
            <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-base-content/85">FAQ</Link>
            <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-base-content/85">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TalentGraph;

