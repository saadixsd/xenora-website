import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Linkedin, Clock, Zap, Eye, PenLine, Search, Mail, ArrowRight } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NoraWaitlistForm } from '@/components/nora-landing/NoraWaitlistForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';

const flowSteps = [
  {
    step: '01',
    title: 'Drop Your Thought',
    body: 'Paste a raw idea, meeting note, or voice-note transcript. No formatting needed.',
  },
  {
    step: '02',
    title: 'Choose a Workflow',
    body: 'Content Agent, Research Agent, Lead Follow-up — pick the right engine for the job.',
  },
  {
    step: '03',
    title: 'Watch It Work',
    body: 'See every step: classifying, generating, formatting. No black box. Full transparency.',
  },
  {
    step: '04',
    title: 'Get Your Outputs',
    body: 'Publish-ready X posts, LinkedIn content, hooks, CTAs. Copy, edit, or regenerate instantly.',
  },
];

const painPoints = [
  { icon: Clock, label: '10-20 hrs/week wasted', sub: 'on repetitive content, emails, follow-ups' },
  { icon: Eye, label: 'AI black boxes', sub: 'no idea what the model is doing or why' },
  { icon: Search, label: 'Tool overload', sub: '$50-300/mo on scattered SaaS stacks' },
];

const noraWins = [
  { icon: PenLine, label: 'One input, multiple outputs', sub: 'X post, hooks, LinkedIn, CTA — done' },
  { icon: Eye, label: 'Visible workflows', sub: 'see every step so you trust what ships' },
  { icon: Zap, label: 'Instant ROI', sub: 'save hours on day one, no learning curve' },
];

const workflows = [
  { icon: PenLine, name: 'Content Agent', desc: 'Raw thought to publish-ready posts', active: true },
  { icon: Search, name: 'Research Agent', desc: 'Topic deep-dives and structured briefs', active: false },
  { icon: Mail, name: 'Lead Follow-up', desc: 'Personalized follow-ups from meeting notes', active: false },
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
        <XenoraLogo decorative className="h-[min(36vh,280px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(44vh,320px)] lg:h-[min(52vh,420px)]" />
      </motion.div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="Nora by XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">Nora</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-4 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28">
          <div className="w-full max-w-3xl text-center">
            <Reveal>
              <p className="font-playfair text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.14em] text-base-content/45 leading-none">
                AI Workflow Workspace
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="premium-heading mt-4 text-[1.75rem] font-medium leading-tight sm:text-4xl md:text-5xl lg:text-7xl">
                Turn Rough Ideas Into Publish-Ready Outputs
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-base-content/65 leading-relaxed sm:mt-6 sm:text-base lg:text-lg">
                Nora is an AI workflow engine for solo founders. Drop a raw thought, pick a workflow, and watch every step happen — from input to polished content. No black boxes. No guesswork.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-10 py-3 text-base font-medium text-primary-foreground shadow-[0_10px_30px_rgba(14,165,164,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(14,165,164,0.28)] sm:w-auto"
                  >
                    Start Building
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-lg border border-base-content/15 px-8 py-3 text-base text-base-content/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary sm:w-auto"
                    onClick={() => scrollToSection('how-it-works')}
                  >
                    See How It Works
                  </button>
                </div>
                <p className="text-xs text-base-content/35">Free beta access — limited spots.</p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-14 mx-auto max-w-md text-center text-xs text-base-content/30 italic">
                Solo founders use Nora to save 10-20 hrs/week on content, emails, and lead follow-ups.
              </p>
            </Reveal>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">How Nora Works</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/45">
                Input → Visible AI Processing → Publish-Ready Outputs
              </p>
            </Reveal>

            <div className="mt-14 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
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

        {/* Workflows */}
        <section className="border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">Workflow Agents</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/45">
                Each agent is purpose-built for a specific founder workflow.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-6">
              {workflows.map((w, i) => (
                <Reveal key={w.name} delay={0.08 * i}>
                  <div className={`surface-panel relative p-6 ${!w.active ? 'opacity-60' : 'hover:-translate-y-1 hover:border-primary/30'} transition-all duration-300`}>
                    {!w.active && (
                      <span className="absolute right-3 top-3 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Coming soon
                      </span>
                    )}
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <w.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-3 text-base font-medium text-base-content">{w.name}</h3>
                    <p className="mt-1 text-sm text-base-content/50">{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why Nora */}
        <section className="border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">
                Why Founders Switch to Nora
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              <Reveal delay={0.08}>
                <div className="surface-panel p-6 sm:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-base-content/35">
                    The Old Way
                  </p>
                  <div className="mt-6 space-y-5">
                    {painPoints.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                          <item.icon className="h-4 w-4 text-destructive/70" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-base-content/70">{item.label}</p>
                          <p className="text-xs text-base-content/40">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

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
                    <p className="text-xs text-primary/70">Visible workflows. Instant outputs. Real trust.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-md">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium">Join the Beta</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-2 text-center text-sm text-base-content/45">
                First 50 founders get premium features free. Shape the product.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface-panel mt-8 p-6">
                <NoraWaitlistForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-base-content/[0.07] px-4 py-10 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3 sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <p className="text-sm font-medium text-base-content/60">Nora by XenoraAI</p>
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
              <p className="text-xs text-base-content/40">XenoraAI 2026</p>
            </div>
            <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
              <Link to="/about" onClick={smoothTop} className="transition-colors hover:text-base-content/85">About</Link>
              <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-base-content/85">FAQ</Link>
              <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-base-content/85">Privacy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
