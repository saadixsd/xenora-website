import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';

const flowSteps = [
  { title: 'Observe', body: 'Tracks screen time, app switches, keyboard patterns, and deep-work sessions with permission.' },
  { title: 'Analyze', body: 'Local LLM detects behavior patterns and identifies recurring focus failures.' },
  { title: 'Plan', body: 'Generates practical daily schedules aligned to your actual work rhythm.' },
  { title: 'Execute', body: 'Automatically blocks distractions, starts playlists, and triggers timers and reminders.' },
  { title: 'Adapt', body: 'Refines tomorrow\'s schedule from today\'s outcomes and override behavior.' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.08] bg-base-100/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" className="flex cursor-pointer items-center gap-2 sm:gap-2.5" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-base font-semibold text-base-content sm:text-lg">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-8">
        <section className="surface-panel border-base-content/[0.1] px-6 py-14 text-center sm:px-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">XenoraAI</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-base-content/75 sm:text-xl">
            Nora — Agentic AI engine learning your patterns to automate work
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/nora/focus"
              className="btn btn-primary px-8 shadow-[0_10px_28px_rgba(0,212,255,0.18)] hover:shadow-[0_14px_30px_rgba(0,212,255,0.24)]"
            >
              Nora Focus Beta
            </Link>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">How Nora Focus Works</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {flowSteps.map((step) => (
              <article key={step.title} className="surface-panel h-full p-4">
                <p className="text-sm font-semibold text-primary">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-base-content/65">{step.body}</p>
              </article>
            ))}
          </div>
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
            <Link to="/faq" className="transition-colors hover:text-base-content/85">FAQ</Link>
            <Link to="/privacy" className="transition-colors hover:text-base-content/85">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
