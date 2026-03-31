import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Linkedin, Clock, Target, Zap, FileSearch, Users, CalendarCheck } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NoraWaitlistForm } from '@/components/nora-landing/NoraWaitlistForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';

const flowSteps = [
  {
    step: '01',
    title: 'TalentGraph Hunt',
    body: 'Scours the open web — GitHub, X, portfolios — for profiles that match your winners. Skills, output, energy.',
  },
  {
    step: '02',
    title: 'Taste Score',
    body: 'Built from your 3 examples. That "feels right" gut call? Now it\'s a number.',
  },
  {
    step: '03',
    title: 'Gets It',
    body: 'Say "no MBAs" once. She remembers. Forever. Across every role you open.',
  },
  {
    step: '04',
    title: 'Real Outreach',
    body: 'Messages that actually land. Calendly link drops at 85%+ match. No spam.',
  },
  {
    step: '05',
    title: 'Your Dash',
    body: 'Ranked candidates. "Why this one?" explained. Interview notes ready before you hop on.',
  },
];

const traditionalPains = [
  { icon: FileSearch, label: '200+ resumes to sift', sub: 'per role, mostly noise' },
  { icon: Clock, label: '40h/week wasted', sub: 'screening, scheduling, chasing' },
  { icon: Users, label: '15% interview-to-hire', sub: 'ghosts, no-shows, bad fits' },
];

const noraWins = [
  { icon: Target, label: '10 taste-scored fits daily', sub: 'your gut, quantified' },
  { icon: Zap, label: 'Autopilot sourcing', sub: 'reclaim your week' },
  { icon: CalendarCheck, label: '85% pre-vetted, booked', sub: 'fits that stick' },
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
        {/* ── Hero ── */}
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-4 pb-24 pt-28 sm:px-8">
          <div className="w-full max-w-3xl text-center">
            <Reveal>
              <p className="font-playfair text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.14em] text-base-content/45 leading-none">
                Nora — Recruit Authentically
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="premium-heading mt-4 text-4xl font-medium sm:text-6xl lg:text-7xl">
                Clone Your Best Hires on Autopilot
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-base text-base-content/65 leading-relaxed sm:text-lg">
                Upload 3 devs you loved. Nora's TalentGraph™ finds 10x lookalikes across GitHub, X, and portfolios — books pre-screened calls.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-3 max-w-xl text-sm text-base-content/40 sm:text-base">
                No posts. No resume hell. Just your people.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col items-center gap-4">
                <button
                  type="button"
                  className="btn btn-primary px-10 text-base shadow-[0_10px_30px_rgba(14,165,164,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(14,165,164,0.28)]"
                  onClick={() => scrollToSection('waitlist')}
                >
                  Request Early Access
                </button>
                <button
                  type="button"
                  className="text-sm text-base-content/50 underline underline-offset-4 decoration-base-content/20 transition-colors hover:text-base-content/75 hover:decoration-base-content/40"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  See how it works ↓
                </button>
              </div>
            </Reveal>

            {/* Early user quotes — no fake logos */}
            <Reveal delay={0.3}>
              <div className="mt-16 flex flex-col items-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-base-content/30">
                  Early users
                </p>
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
                  {earlyUsers.map((quote) => (
                    <p key={quote} className="text-xs italic text-base-content/35">
                      {quote}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Workflow Video ── */}
        <section id="how-it-works" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">How Nora Works</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/45">
                Upload → TalentGraph™ Match → Outreach → Interview — fully autonomous
              </p>
            </Reveal>

            {/* Workflow demo video */}
            <Reveal delay={0.1}>
              <div className="mt-10 overflow-hidden rounded-xl border border-base-content/[0.08]">
                <video
                  className="w-full"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster=""
                >
                  <source src="/videos/workflow-demo.mp4" type="video/mp4" />
                </video>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-5">
              {flowSteps.map((s, index) => (
                <Reveal key={s.step} delay={0.08 * index}>
                  <article className="surface-panel h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                    <span className="font-mono text-xs text-primary/75">{s.step}</span>
                    <h3 className="mt-2 text-base font-medium text-base-content">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/50">{s.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Traditional Sucks ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">
                Why Traditional Sucks (And Nora Doesn't)
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/45">
                Real numbers. No sugarcoating.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {/* Traditional side */}
              <Reveal delay={0.08}>
                <div className="surface-panel p-6 sm:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-base-content/35">
                    Traditional Recruiting
                  </p>
                  <div className="mt-6 space-y-5">
                    {traditionalPains.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error/10">
                          <item.icon className="h-4 w-4 text-error/70" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-base-content/70">{item.label}</p>
                          <p className="text-xs text-base-content/40">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-lg border border-error/10 bg-error/5 px-4 py-3">
                    <p className="text-xs text-error/60">Keyword mismatches. High churn. You're the bottleneck.</p>
                  </div>
                </div>
              </Reveal>

              {/* Nora side */}
              <Reveal delay={0.16}>
                <div className="surface-panel border-primary/20 p-6 sm:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary/60">
                    With Nora
                  </p>
                  <div className="mt-6 space-y-5">
                    {noraWins.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="h-4 w-4 text-primary/80" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-base-content/80">{item.label}</p>
                          <p className="text-xs text-base-content/40">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
                    <p className="text-xs text-primary/70">Your gut cloned. Fits that stick.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Waitlist ── */}
        <section id="waitlist" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-md">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium">Secure Your Spot</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-2 text-center text-sm text-base-content/45">
                Get early access to 10x talent matching.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface-panel mt-8 p-6">
                <NoraWaitlistForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ── */}
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
      </main>
    </div>
  );
};

export default Index;
