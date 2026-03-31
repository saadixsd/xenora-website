import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';

const About = () => {
  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
        <XenoraLogo decorative className="h-[min(44vh,320px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(50vh,400px)]" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={smoothTop} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-8">
        <Reveal>
          <h1 className="premium-heading text-3xl font-medium sm:text-4xl">About</h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-base-content/10 bg-base-200/50">
              <XenoraLogo decorative className="h-16 w-16 rounded-full" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-base-content/85">XenoraAI</p>
              <p className="mt-1 text-sm text-base-content/50">Built in Montreal</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-base-content/60">
            <p>
              I built Nora because I watched founders — including myself — burn 40+ hours a week on hiring.
              Scrolling profiles, reading resumes that say nothing, scheduling calls with people who ghost.
              The whole process felt broken.
            </p>
            <p>
              So I asked a simple question: what if you could just point at 3 people you already loved working with,
              and let software find more of them? That's TalentGraph™. It searches the open web — GitHub, X, portfolios —
              and scores candidates against your taste. Not keywords. Your actual gut feel, quantified.
            </p>
            <p>
              Nora is early. We're building this in public with our first 10 founding teams.
              If you're a bootstrapped founder who's tired of the hiring treadmill, I'd love to work with you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex items-center gap-4">
            <a
              href="https://x.com/xenoraai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-base-content/50 transition-colors hover:text-base-content/85"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.4 22H3.3l7.24-8.27L1 2h6.35l4.38 5.78L18.9 2z" />
              </svg>
              @xenoraai
            </a>
            <a
              href="https://www.linkedin.com/company/xenoraai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-base-content/50 transition-colors hover:text-base-content/85"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-xs text-base-content/25 italic">Built with conviction.</p>
        </Reveal>
      </main>

      <footer className="relative z-10 border-t border-base-content/[0.07] px-4 py-10 sm:px-8">
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
              <a href="https://x.com/xenoraai" target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-base-content/85">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.4 22H3.3l7.24-8.27L1 2h6.35l4.38 5.78L18.9 2z" />
                </svg>
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

export default About;
