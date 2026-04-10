import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Linkedin, PenLine, Search, Zap, ArrowRight, Check, X as XIcon, Users, Rocket, Mic, Target } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { ProductEmailUpdatesForm } from '@/components/nora-landing/ProductEmailUpdatesForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';
import { ROUTES } from '@/config/routes';

const flowSteps = [
  { step: '01', title: 'Input received', body: 'Nora confirms she got your rough idea, transcript, thread, or lead signal.' },
  { step: '02', title: 'Classifying', body: 'Nora reads context and routes the job to the right agent — Content, Lead, or Research.' },
  { step: '03', title: 'Executing', body: 'The agent runs with visible progress. No black box.' },
  { step: '04', title: 'Formatting', body: 'Outputs are structured — posts, hooks, replies — ready for you to scan.' },
  { step: '05', title: 'Ready to review', body: 'You approve, edit, or regenerate. Nothing publishes or sends until you say so.' },
];

const agents = [
  {
    icon: PenLine, name: 'Content Agent',
    body: 'Drop a rough thought. Get back an X post, 3 hooks, a LinkedIn post, and a CTA — then approve before publish.',
    outputs: ['1 X post', '3 hooks', '1 LinkedIn post', '1 CTA'],
    tag: 'Live', active: true,
  },
  {
    icon: Zap, name: 'Lead Agent',
    body: 'Inbound form or DM → Nora scores, drafts a personalized reply, and queues follow-up after 48h if needed. You approve before send.',
    outputs: ['Lead score', 'Draft reply', 'Follow-up queue'],
    tag: 'Live', active: true,
  },
  {
    icon: Search, name: 'Research Agent',
    body: 'Notes plus optional public URLs (e.g. Reddit threads) → pain signals, content angles, and relevance you can act on. Same visible steps and review flow.',
    outputs: ['Pain signals', 'Content angles', 'Relevance notes'],
    tag: 'Live', active: true,
  },
];

const personas = [
  { icon: Rocket, title: 'Solo Indie Hackers', body: 'Building your first product while juggling everything else. Emails and lead chaos eat your build time — Nora handles the workflow.' },
  { icon: Target, title: 'Micro-SaaS Founders', body: '1–3 people at an ops ceiling. No hire in budget. Nora is your first workflow layer.' },
  { icon: Mic, title: 'Creator Founders', body: 'Audience 1k–50k. Consistency is the lever. Nora turns ideas into posts while you ship product.' },
  { icon: Users, title: 'Early Bootstrappers', body: "Side hustle to full-time. Can't afford a VA. Nora replaces repetitive ops with visible, approvable runs." },
];

const comparisonRows = [
  ['Hours lost polishing the same posts', 'Content Agent: one input → X + hooks + LinkedIn + CTA'],
  ['Generic AI chat with no audit trail', 'Every stage visible — you trust what ships'],
  ['Reinventing the prompt every time', 'Same structured workflow every run'],
  ['Blank page every time you need content', 'Rough note in, publish-ready bundle out'],
  ['DIY automation wiring', 'Nora: observe → adapt → execute — built for founder workflows'],
];

const freeTierFeatures = [
  '5 workflow runs / month (UTC)',
  '3 Ask Nora messages / month (UTC)',
  'Content, Lead, and Research agents',
  'Dashboard, history, visible steps',
];
const plusFeatures = [
  'Unlimited workflow runs (fair use)',
  'Unlimited Ask Nora (fair use)',
  'All agents: Content, Lead, Research',
  'Billing via Stripe — cancel anytime in portal',
];
const proFeatures = [
  'Everything in Nora Plus',
  'Deeper Ask Nora answers (Pro model & limits)',
  'Same workflow engine — upgraded chat experience',
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
    <div className="min-h-svh bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <motion.div
        style={{ y: watermarkY }}
        className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center"
        aria-hidden
      >
        <XenoraLogo decorative className="h-[min(36vh,280px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(44vh,320px)] lg:h-[min(52vh,420px)]" />
      </motion.div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-3 py-2 sm:min-h-16 sm:flex-nowrap sm:px-6">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex min-w-0 shrink-0 cursor-pointer items-center gap-2 sm:gap-2.5"
            aria-label="XenoraAI home"
          >
            <XenoraLogo decorative className="h-9 w-9 shrink-0 sm:h-14 sm:w-14" />
            <span className="truncate text-base font-semibold text-base-content sm:max-w-none sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      {/* Sticky CTA → dashboard (Nora) */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-0 right-0 z-50 flex items-center justify-center pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:bottom-6"
      >
        <Link
          to={ROUTES.tryNora}
          className="flex min-h-[48px] max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_rgba(0,200,150,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,200,150,0.3)] sm:max-w-none sm:px-6 sm:py-3"
        >
          Try Nora
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <main className="relative z-10">
        {/* ── HERO ── */}
        <section className="flex min-h-svh flex-col items-center justify-center px-4 pb-20 pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4.5rem))] sm:px-8 sm:pb-24 sm:pt-28">
          <div className="w-full max-w-3xl text-center">
            <Reveal>
              <p className="font-playfair text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.14em] text-base-content/45 leading-none">
                Nora · Know Beyond · Observe → Adapt → Execute
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="premium-heading mt-4 text-[1.75rem] font-medium leading-tight sm:text-4xl md:text-5xl lg:text-7xl">
                Stop losing build time{' '}
                <br className="hidden sm:block" />
                to repetitive work
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-base-content/65 leading-relaxed sm:mt-6 sm:text-base lg:text-lg">
                You bring the idea. Nora handles the execution.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <Link
                    to={ROUTES.tryNora}
                    className="group relative min-h-[44px] w-full overflow-hidden rounded-lg bg-primary px-10 py-3.5 text-center text-base font-medium text-primary-foreground shadow-[0_10px_30px_rgba(0,200,150,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,200,150,0.22)] sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Try Nora
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="min-h-[44px] w-full rounded-lg border border-base-content/10 px-8 py-3 text-base text-base-content/60 transition-all duration-300 hover:border-base-content/20 hover:text-base-content sm:w-auto"
                    onClick={() => scrollToSection('how-it-works')}
                  >
                    How it works
                  </button>
                </div>
                <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-base-content/45">
                  <Link
                    to={ROUTES.login}
                    state={{ message: 'Sign in to chat with Nora.' }}
                    className="text-primary transition-colors hover:underline"
                  >
                    Ask Nora
                  </Link>
                  <span className="text-base-content/25" aria-hidden>
                    ·
                  </span>
                  <Link to={ROUTES.dashboard.root} className="text-primary transition-colors hover:underline">
                    Dashboard
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── HOW NORA WORKS ── */}
        <section id="how-it-works" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">How Nora works</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/45">
                Visible AI, not magic AI — every stage on every run.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
              {flowSteps.map((s, index) => (
                <Reveal key={s.step} delay={0.08 * index}>
                  <article className="surface-panel h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                    <span className="font-mono text-xs text-primary/75">{s.step}</span>
                    <h3 className="mt-1.5 text-base font-medium text-base-content">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-base-content/50">{s.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── AGENT CARDS ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-base-content/35">
                Nora agents
              </p>
            </Reveal>
            <Reveal delay={0.03}>
              <h2 className="premium-heading mt-3 text-center text-2xl font-medium sm:text-3xl">
                Three agents, all live. Pick one and run.
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {agents.map((a, i) => (
                <Reveal key={a.name} delay={0.08 * i}>
                  <div className={`surface-panel relative flex h-full flex-col p-6 transition-all duration-300 ${a.active ? 'hover:-translate-y-1 hover:border-primary/30' : 'opacity-60'}`}>
                    <span className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${a.active ? 'bg-primary/15 text-primary ring-1 ring-primary/20' : 'bg-base-content/5 text-base-content/40'}`}>
                      {a.tag}
                    </span>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.active ? 'bg-primary/15' : 'bg-base-content/5'}`}>
                      <a.icon className={`h-5 w-5 ${a.active ? 'text-primary' : 'text-base-content/40'}`} />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-base-content">{a.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/55">{a.body}</p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {a.outputs.map((o) => (
                        <span key={o} className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${a.active ? 'bg-primary/10 text-primary/80' : 'bg-base-content/5 text-base-content/35'}`}>
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-8 text-center">
                <Link
                  to={ROUTES.tryNora}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Try Nora
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── WHO THIS IS FOR ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">
                Built for founders who wear all the hats
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {personas.map((p, i) => (
                <Reveal key={p.title} delay={0.08 * i}>
                  <div className="surface-panel flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <p.icon className="h-5 w-5 text-primary/80" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-base-content">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-base-content/50">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">
                Why Nora, not another AI tool
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="surface-panel mt-10 overflow-x-auto overflow-y-hidden">
                <div className="grid min-w-[280px] grid-cols-2 border-b border-border/50">
                  <div className="px-4 py-3 sm:px-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-base-content/35">Without Nora</p>
                  </div>
                  <div className="border-l border-border/50 px-4 py-3 sm:px-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary/60">With Nora</p>
                  </div>
                </div>
                {comparisonRows.map((row, i) => (
                  <div key={i} className={`grid grid-cols-2 ${i < comparisonRows.length - 1 ? 'border-b border-border/30' : ''}`}>
                    <div className="flex items-start gap-2 px-4 py-3 sm:gap-2.5 sm:px-5 sm:py-4">
                      <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive/50" />
                      <p className="text-xs text-base-content/50 sm:text-sm">{row[0]}</p>
                    </div>
                    <div className="flex items-start gap-2 border-l border-border/50 px-4 py-3 sm:gap-2.5 sm:px-5 sm:py-4">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                      <p className="text-xs text-base-content/70 sm:text-sm">{row[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">Pricing</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm text-base-content/55 leading-relaxed">
                Start free, then upgrade in-app with Stripe. Free tier resets each calendar month (UTC).
              </p>
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <Reveal delay={0.06}>
                <article className="surface-panel flex h-full flex-col p-6 text-left">
                  <h3 className="text-base font-semibold text-base-content">Free</h3>
                  <p className="mt-2 font-dm-serif text-3xl text-base-content">
                    $0<span className="text-base font-normal text-base-content/50">/mo</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-base-content/55">
                    {freeTierFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
              <Reveal delay={0.1}>
                <article className="surface-panel flex h-full flex-col border-primary/25 p-6 text-left ring-1 ring-primary/15">
                  <h3 className="text-base font-semibold text-base-content">Nora Plus</h3>
                  <p className="mt-2 font-dm-serif text-3xl text-base-content">
                    $13.99<span className="text-base font-normal text-base-content/50">/mo</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-base-content/55">
                    {plusFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
              <Reveal delay={0.14}>
                <article className="surface-panel flex h-full flex-col p-6 text-left">
                  <h3 className="text-base font-semibold text-base-content">Nora Pro</h3>
                  <p className="mt-2 font-dm-serif text-3xl text-base-content">
                    $19.99<span className="text-base font-normal text-base-content/50">/mo</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-base-content/55">
                    {proFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <div className="mt-8 text-center">
                <Link
                  to={ROUTES.tryNora}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Try Nora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Product email list (marketing; stored in waitlist table) */}
        <section id="product-updates" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-md">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">Product updates</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-2 text-center text-sm text-base-content/45">
                Get on our email list for release notes and what we ship next. Unsubscribe anytime.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface-panel mt-6 border-primary/20 p-6 shadow-[0_0_40px_rgba(0,200,150,0.1)]">
                <ProductEmailUpdatesForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-base-content/[0.07] px-4 py-10 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3 sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <p className="text-sm font-medium text-base-content/60">XenoraAI</p>
              <p className="text-xs text-base-content/40">Know Beyond</p>
              <div className="flex items-center gap-3 text-base-content/50">
                <a href="https://www.linkedin.com/company/xenoraai" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-base-content/85"><Linkedin className="h-4 w-4" /></a>
                <a href="https://www.instagram.com/xenoraai" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-base-content/85"><Instagram className="h-4 w-4" /></a>
                <a href="https://x.com/xenoraai" target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-base-content/85">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.4 22H3.3l7.24-8.27L1 2h6.35l4.38 5.78L18.9 2z" /></svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-xs text-base-content/40">XenoraAI 2026</p>
              <a href="mailto:xenoraai@gmail.com" className="text-xs text-base-content/35 transition-colors hover:text-base-content/60">xenoraai@gmail.com</a>
            </div>
            <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
              <Link to="/about" onClick={smoothTop} className="transition-colors hover:text-base-content/85">About</Link>
              <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-base-content/85">FAQ</Link>
              <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-base-content/85">Privacy</Link>
            </div>
          </div>
        </footer>
      </main>

      {/* Spacer so last scroll content clears sticky Try Nora CTA */}
      <div className="h-24 sm:h-28" aria-hidden />
    </div>
  );
};

export default Index;
