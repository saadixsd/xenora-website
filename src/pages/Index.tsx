import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NoraWaitlistForm } from '@/components/nora-landing/NoraWaitlistForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';

const flowSteps = [
  {
    step: '01',
    title: 'Observe',
    body: 'Tracks screen time, app switches, keyboard patterns, and deep work sessions with permission.',
  },
  {
    step: '02',
    title: 'Analyze',
    body: 'Local LLM processing identifies recurring distractions and predicts high-focus windows from your own activity.',
  },
  {
    step: '03',
    title: 'Plan',
    body: 'Builds a realistic daily schedule with protected deep-work windows and timed recovery intervals.',
  },
  {
    step: '04',
    title: 'Execute',
    body: 'Applies configured controls, starts playlists/timers, and sends minimal prompts when drift is detected.',
  },
  {
    step: '05',
    title: 'Adapt',
    body: 'Refines tomorrow based on outcomes, overrides, and session completion quality.',
  },
];

const valueCards = [
  { title: 'Local LLM inference', desc: 'Pattern analysis runs on-device to reduce cloud dependency for core focus decisions.' },
  { title: 'Hybrid coordination', desc: 'A secure coordination service syncs schedules and notifications across desktop and mobile.' },
  { title: 'Privacy boundary', desc: 'Usage logs stay local by default and are not used to train remote models.' },
];

const Index = () => {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -36]);
  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  const scrollToSection = (id: string) => {
    smoothTop();
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 280);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <motion.div
        style={{ y: watermarkY }}
        className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center"
        aria-hidden
      >
        <XenoraLogo decorative className="h-[min(44vh,320px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(52vh,420px)]" />
      </motion.div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10">
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-4 pb-24 pt-28 sm:px-8">
          <div className="w-full max-w-3xl text-center">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-base-content/45">Nora Focus</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="premium-heading mt-4 text-4xl font-semibold sm:text-6xl lg:text-7xl">
                Own your focus. Guard your time. Build greatness.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-base text-base-content/70 sm:text-lg">
                Nora Focus runs a practical observe-analyze-plan-execute-adapt loop that helps you protect deep work without adding operational overhead.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-4 max-w-xl text-sm text-base-content/50 sm:text-base">
                Built for professionals who need calm, repeatable output on high-priority work.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  className="btn btn-primary px-8 shadow-[0_10px_30px_rgba(14,165,164,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(14,165,164,0.28)]"
                  onClick={() => scrollToSection('waitlist')}
                >
                  Join the beta waitlist
                </button>
                <button
                  type="button"
                  className="btn btn-ghost border border-base-content/15 px-7 text-base-content/80 transition-all duration-300 hover:border-primary/45 hover:bg-base-200/45 hover:text-base-content"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  See how it works
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-semibold sm:text-3xl">How Nora Focus Works</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/50">
                A coordinated five-step system that turns daily behavior into measurable focus gains.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-5">
              {flowSteps.map((s, index) => (
                <Reveal key={s.step} delay={0.08 * index}>
                  <article className="surface-panel h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_14px_32px_rgba(0,212,255,0.1)]">
                    <span className="font-mono text-xs text-primary/75">{s.step}</span>
                    <h3 className="mt-2 text-base font-semibold text-base-content">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/55">{s.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-semibold sm:text-3xl">System Architecture</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-base-content/55 sm:text-base">
                Local execution handles sensitive behavior data while a lightweight coordination layer keeps schedules and notifications synchronized across devices.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {valueCards.map((card, index) => (
                <Reveal key={card.title} delay={0.08 * index}>
                  <article className="surface-panel h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-base-200/45 hover:shadow-[0_12px_26px_rgba(0,212,255,0.08)]">
                    <h3 className="text-sm font-semibold text-base-content">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/55">{card.desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="waitlist" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-md">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-semibold">Join the beta</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-2 text-center text-sm text-base-content/55">
                Nora Focus is in early beta. Join the waitlist and we’ll reach out when a spot opens.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface-panel mt-8 p-6">
                <NoraWaitlistForm />
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="border-t border-base-content/[0.07] px-4 py-10 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3 sm:text-left">
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
              <p className="text-xs text-base-content/40">@XenoraAI 2026</p>
              <p className="text-[11px] tracking-[0.16em] text-base-content/35">~Know Beyond</p>
            </div>
            <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
              <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-base-content/85">FAQ</Link>
              <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-base-content/85">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
