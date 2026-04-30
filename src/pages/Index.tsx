import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Linkedin, FileText, Search, Zap, ArrowRight, Check, X as XIcon, Rocket, Target, Inbox, Sparkles, FileCheck2 } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { ProductEmailUpdatesForm } from '@/components/nora-landing/ProductEmailUpdatesForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';
import { ROUTES } from '@/config/routes';

// 3-step "How Nora works" — refined for founder clarity (Input → Workflow → Output).
const flowSteps = [
  { step: '01', title: 'Add rough input', body: 'Drop a note, lead message, transcript, URL, or half-formed idea. No prompt engineering required.' },
  { step: '02', title: 'Nora runs the workflow', body: 'Nora routes to the right agent and runs visible, step-by-step. You see exactly what is happening.' },
  { step: '03', title: 'Review and use', body: 'Structured outputs land in a review gate. Edit, approve, copy, or rerun. Nothing ships without you.' },
];

const agents = [
  {
    icon: FileText, name: 'Content Agent',
    body: 'Turn a single rough thought into a full content package. One input produces an X post, three hooks, a LinkedIn post, and a call to action. Review and approve before anything goes live.',
    outputs: ['1 X post', '3 hooks', '1 LinkedIn post', '1 CTA'],
    tag: 'Live', active: true,
  },
  {
    icon: Zap, name: 'Lead Agent',
    body: 'When a lead comes in through a form or DM, Nora scores the opportunity, drafts a personalized reply, and prepares a follow-up for 48 hours later. You review and approve before anything is sent.',
    outputs: ['Lead score', 'Draft reply', 'Follow-up queue'],
    tag: 'Live', active: true,
  },
  {
    icon: Search, name: 'Research Agent',
    body: 'Combine your notes with public URLs such as Reddit threads or blog posts. Nora extracts pain signals, content angles, and relevance analysis you can act on immediately.',
    outputs: ['Pain signals', 'Content angles', 'Relevance notes'],
    tag: 'Live', active: true,
  },
];

const personas = [
  { icon: Rocket, title: 'Primary: Solo SaaS Founders', body: 'You are building product, running distribution, and handling customer follow-ups alone. Nora turns that repetitive operational load into reviewable workflow runs.' },
  { icon: Target, title: 'Secondary: Small Founder Teams (2-5)', body: 'You need consistent execution before hiring ops. Nora standardizes content, lead follow-up, and research outputs in one visible system.' },
];

const comparisonRows = [
  ['Spending hours polishing the same posts manually', 'One input produces an X post, hooks, LinkedIn post, and CTA in seconds'],
  ['Using generic AI chat with no record of what was generated', 'Every stage is visible and logged so you trust what you ship'],
  ['Starting from scratch and reinventing the prompt each time', 'The same structured workflow runs consistently, every time'],
  ['Staring at a blank page whenever you need content', 'Drop a rough note in, get a publish-ready content package out'],
  ['Wiring together your own automation stack', 'Nora observes, adapts, and executes within a purpose-built founder workflow'],
];

const proofExamples = [
  {
    title: 'Launch update workflow',
    problem: 'Raw build notes from one founder update',
    outcome: '1 X post, 3 hooks, 1 LinkedIn draft, and a CTA in one reviewed run',
  },
  {
    title: 'Inbound lead workflow',
    problem: 'New lead DM with limited context',
    outcome: 'Lead score, personalized response draft, and a queued follow-up ready for approval',
  },
  {
    title: 'Market research workflow',
    problem: 'Notes plus two public URLs',
    outcome: 'Pain signals, angle map, and prioritized actions for next content/test cycle',
  },
];

const freeTierFeatures = [
  '5 reviewed workflow runs per month',
  '3 Ask Nora messages per month',
  'Access to Content Agent, Lead Agent, and Research Agent',
  'Run history + visible progress timeline',
];
const plusFeatures = [
  'Unlimited workflow runs (fair use)',
  'Unlimited Ask Nora conversations (fair use)',
  'All three agents with higher throughput',
  'Connections: link Gmail, X, Instagram, and LinkedIn for workflow context',
  'Managed billing via Stripe with cancel-anytime flexibility',
];
const proFeatures = [
  'Everything included in Nora Plus',
  'Enhanced Ask Nora responses with Pro-tier model and higher limits',
  'Priority connections and advanced analysis depth',
  'Best fit for teams running daily multi-workflow operations',
];

const Index = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -36]);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setShowStickyCta(latest > 520);
  });
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
        <XenoraLogo decorative className="logo-watermark h-[min(36vh,280px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(44vh,320px)] lg:h-[min(52vh,420px)]" />
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

      {/* Sticky CTA (appears after hero to reduce first-screen noise) */}
      {showStickyCta && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-0 right-0 z-50 flex items-center justify-center pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:bottom-6"
        >
          <Link
            to={ROUTES.tryNora}
            className="flex min-h-[48px] max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_rgba(0,200,150,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,200,150,0.3)] sm:max-w-none sm:px-6 sm:py-3"
          >
            Join Beta
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}

      <main className="relative z-10">
        {/* ── HERO ── */}
        {/*
          Headline options (swap freely):
          A) "Nora turns rough input into reviewable AI workflows." — descriptive, product-led (current).
          B) "Your workflow problem in. A working agent out." — punchier, founder-brutal.
        */}
        <section className="flex min-h-svh flex-col items-center justify-center px-4 pb-20 pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4.5rem))] sm:px-8 sm:pb-24 sm:pt-28">
          <div className="w-full max-w-3xl text-center">
            <Reveal>
              <p className="font-syne text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.14em] text-base-content/45 leading-none">
                XenoraAI · Agentic workflows for founders
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="premium-heading mt-4 text-[1.75rem] font-medium leading-tight sm:text-4xl md:text-5xl lg:text-7xl">
                Nora turns rough input into{' '}
                <br className="hidden sm:block" />
                reviewable AI workflows
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-base-content/65 leading-relaxed sm:mt-6 sm:text-base lg:text-lg">
                Built for solo SaaS founders and small teams. Drop rough notes, lead signals, or URLs. Nora runs visible workflows for content, follow-up, and research—then you approve before anything ships.
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
                      Join Beta
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="min-h-[44px] w-full rounded-lg border border-base-content/10 px-8 py-3 text-base text-base-content/60 transition-all duration-300 hover:border-base-content/20 hover:text-base-content sm:w-auto"
                    onClick={() => scrollToSection('see-nora')}
                  >
                    See Nora demo
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

        {/* ── SEE NORA IN ACTION (visual workflow mockup) ── */}
        <section id="see-nora" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-base-content/35">
                See Nora in action
              </p>
            </Reveal>
            <Reveal delay={0.04}>
              <h2 className="premium-heading mt-3 text-center text-2xl font-medium sm:text-3xl">
                Input → Workflow → Output
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm text-base-content/55">
                One run. Visible steps. Reviewable outputs. This is the core loop founders use every day.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                <div className="surface-panel flex flex-col p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                      <Inbox className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-base-content/45">Input</p>
                  </div>
                  <p className="mt-3 text-xs text-base-content/45">Founder note</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-base-content/75">
                    "Shipped async invites today. Cuts onboarding from 3 days to 4 hours. Want to post about it and reply to the 2 leads from yesterday."
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    <span className="rounded-md bg-base-content/[0.06] px-2 py-0.5 text-[11px] text-base-content/55">notes</span>
                    <span className="rounded-md bg-base-content/[0.06] px-2 py-0.5 text-[11px] text-base-content/55">leads</span>
                    <span className="rounded-md bg-base-content/[0.06] px-2 py-0.5 text-[11px] text-base-content/55">URLs</span>
                    <span className="rounded-md bg-base-content/[0.06] px-2 py-0.5 text-[11px] text-base-content/55">transcripts</span>
                  </div>
                </div>

                <div className="surface-panel flex flex-col p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-base-content/45">Workflow run</p>
                    <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20">running</span>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      { label: 'Input received', state: 'done' },
                      { label: 'Routed to Content Agent', state: 'done' },
                      { label: 'Drafting hooks + LinkedIn post', state: 'active' },
                      { label: 'Drafting lead replies', state: 'pending' },
                      { label: 'Stage for review', state: 'pending' },
                    ].map((s) => (
                      <li key={s.label} className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            s.state === 'done'
                              ? 'bg-primary'
                              : s.state === 'active'
                                ? 'bg-primary animate-pulse'
                                : 'bg-base-content/20'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            s.state === 'done'
                              ? 'text-base-content/75'
                              : s.state === 'active'
                                ? 'text-base-content font-medium'
                                : 'text-base-content/40'
                          }`}
                        >
                          {s.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="surface-panel flex flex-col p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                      <FileCheck2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-base-content/45">Output (review gate)</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-base-content/70">
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" /> 1 X post + 3 hooks</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" /> 1 LinkedIn post + CTA</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" /> 2 personalized lead replies</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" /> Follow-up queued for 48h</li>
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary/80">review</span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary/80">edit</span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary/80">rerun</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mx-auto mt-6 max-w-xl text-center text-xs text-base-content/40">
                Mockup of a real Nora run. Nothing is sent or published until you approve.
              </p>
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
                Every run follows the same transparent pipeline. You see each stage as it happens.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-4">
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
                Three agents. All live. Select one and run.
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

            <div className="mt-6 text-center text-xs text-base-content/40">
              Pick an agent, run it once, and decide if Nora fits your workflow.
            </div>
          </div>
        </section>

        {/* ── WHO THIS IS FOR ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
                <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">
                Built for lean founder teams
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

        {/* ── PROOF ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">
                Proof in real workflows
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm text-base-content/50">
                Nora is designed to produce measurable outputs from one run, not vague chat replies.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {proofExamples.map((example, index) => (
                <Reveal key={example.title} delay={0.08 * index}>
                  <article className="surface-panel h-full p-5">
                    <h3 className="text-sm font-semibold text-base-content">{example.title}</h3>
                    <p className="mt-2 text-xs text-base-content/45">Input</p>
                    <p className="mt-1 text-sm text-base-content/60">{example.problem}</p>
                    <p className="mt-3 text-xs text-base-content/45">Output after review</p>
                    <p className="mt-1 text-sm text-base-content/75">{example.outcome}</p>
                  </article>
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
                Start free, validate one workflow, then scale. Every paid plan includes a <strong className="text-base-content/80">7-day free trial</strong> and can be canceled anytime.
              </p>
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <Reveal delay={0.06}>
                <article className="surface-panel flex h-full flex-col p-6 text-left">
                  <h3 className="text-base font-semibold text-base-content">Free</h3>
                  <p className="mt-2 font-syne text-3xl font-semibold text-base-content">
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
                  <div className="mt-auto pt-6">
                    <Link
                      to={ROUTES.signup}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      Get started free
                    </Link>
                  </div>
                </article>
              </Reveal>
              <Reveal delay={0.1}>
                <article className="surface-panel relative flex h-full flex-col border-primary/25 p-6 text-left ring-1 ring-primary/15">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">Most popular</span>
                  <h3 className="text-base font-semibold text-base-content">Nora Plus</h3>
                  <p className="mt-2 font-syne text-3xl font-semibold text-base-content">
                    $49.99<span className="text-base font-normal text-base-content/50">/mo</span>
                  </p>
                  <p className="mt-1 text-xs text-primary/70 font-medium">7-day free trial</p>
                  <ul className="mt-4 space-y-2 text-sm text-base-content/55">
                    {plusFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <a
                      href="https://buy.stripe.com/bJe4gy4RceG67dyaHwdnW03"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Start free trial
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              </Reveal>
              <Reveal delay={0.14}>
                <article className="surface-panel flex h-full flex-col p-6 text-left">
                  <h3 className="text-base font-semibold text-base-content">Nora Pro</h3>
                  <p className="mt-2 font-syne text-3xl font-semibold text-base-content">
                    $79.99<span className="text-base font-normal text-base-content/50">/mo</span>
                  </p>
                  <p className="mt-1 text-xs text-primary/70 font-medium">7-day free trial</p>
                  <ul className="mt-4 space-y-2 text-sm text-base-content/55">
                    {proFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <a
                      href="https://buy.stripe.com/6oUeVcfvQcxY8hCcPEdnW02"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      Start free trial
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="premium-heading text-2xl font-medium sm:text-3xl md:text-4xl">
                Stop juggling tabs. Start running workflows.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-xl text-sm text-base-content/55 sm:text-base">
                Join the Nora beta and put your first workflow live this week. Built in Montreal for founders who ship.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to={ROUTES.tryNora}
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_rgba(0,200,150,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,200,150,0.26)]"
                >
                  Join Beta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToSection('see-nora')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-base-content/10 px-6 py-3 text-sm text-base-content/70 transition-colors hover:border-base-content/20 hover:text-base-content"
                >
                  See Nora demo
                </button>
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
                Join our mailing list for release notes and product updates. Unsubscribe anytime.
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
        <footer className="border-t border-base-content/[0.07] px-4 pb-20 pt-10 sm:px-8 sm:pb-10">
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

      {/* Spacer so last scroll content clears sticky CTA */}
      <div className="h-28 sm:h-28" aria-hidden />
    </div>
  );
};

export default Index;
