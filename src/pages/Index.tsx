import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Linkedin, PenLine, Search, Zap, ArrowRight, Check, X as XIcon, Users, Rocket, Mic, Target } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NoraWaitlistForm } from '@/components/nora-landing/NoraWaitlistForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';

const flowSteps = [
  { step: '01', title: 'Input', body: 'Drop in a rough idea, voice note transcript, email thread, or lead list.' },
  { step: '02', title: 'Classify', body: 'Nora reads the context and decides: is this content, a lead, or a workflow task?' },
  { step: '03', title: 'Execute', body: 'Nora runs the right agent — Content, Lead, or Research — with no manual setup.' },
  { step: '04', title: 'Review', body: 'See every step Nora took. Approve, edit, or regenerate. You stay in control.' },
  { step: '05', title: 'Done', body: 'Outputs land in your dashboard: posts ready to publish, replies ready to send, leads scored and followed up.' },
];

const testimonials = [
  { quote: 'Nora handles my inbox + content queue — frees 15hr/wk to build.', author: 'Solo SaaS founder, early access' },
  { quote: 'Visible AI steps make it trustworthy vs generic chatbots.', author: 'Indie hacker, micro-SaaS' },
  { quote: 'Turned rough notes into 10 posts/week — growth unlocked.', author: 'Creator founder, 8k audience' },
];

const agents = [
  {
    icon: PenLine, name: 'Content Agent',
    body: 'Drop a rough thought. Get back a Twitter post, 3 hooks, a LinkedIn post, and a CTA. Consistent output without the blank page.',
    outputs: ['1 X post', '3 hooks', '1 LinkedIn post', '1 CTA'],
    tag: 'Live in beta', active: true,
  },
  {
    icon: Zap, name: 'Lead Agent',
    body: 'Form submission or DM comes in. Nora scores the lead, drafts a reply, and queues a follow-up if they go quiet.',
    outputs: ['Lead score', 'Draft reply', 'Follow-up queue'],
    tag: 'Coming soon', active: false,
  },
  {
    icon: Search, name: 'Research Agent',
    body: 'Point Nora at Reddit, comments, or your niche. Get back real pain signals, content ideas, and offer angles from actual conversations.',
    outputs: ['Pain signals', 'Content ideas', 'Offer angles'],
    tag: 'Coming soon', active: false,
  },
];

const personas = [
  { icon: Rocket, title: 'Solo Indie Hackers', body: 'Building your first product under $10k MRR. Emails and lead chaos are eating your coding time. Nora handles it.' },
  { icon: Target, title: 'Micro-SaaS Founders', body: '1-3 person team hitting an ops ceiling. No ops hire in budget. Nora is your first workflow person.' },
  { icon: Mic, title: 'Creator Founders', body: 'Audience between 1k-50k. Content consistency is your growth lever. Nora turns ideas into posts while you focus on the product.' },
  { icon: Users, title: 'Early Bootstrappers', body: "Side hustle going full-time. Can't afford a VA. $29/mo gets you the same output." },
];

const comparisonRows = [
  ['10-20 hours/week on emails, content, follow-ups', 'That time goes back to building'],
  ['Generic AI chat that forgets context instantly', 'Visible agent steps you can audit and edit'],
  ['Zapier workflows you have to build and maintain', 'Nora figures out the workflow from your input'],
  ['Blank page every time you need content', 'Rough note in, publish-ready post out'],
  ['Leads that go cold because follow-up slips', 'Nora queues the nudge automatically'],
];

const starterFeatures = ['Content Agent access', 'Up to 100 workflow runs/month', 'Visible step-by-step execution', 'Dashboard + history'];
const proFeatures = ['All agents', 'Unlimited runs', 'Integrations: Notion, Slack, Gmail', 'Priority support'];

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

      {/* ── STICKY WAITLIST CTA ── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex justify-center sm:bottom-6"
      >
        <button
          type="button"
          onClick={() => scrollToSection('waitlist')}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_rgba(14,165,164,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(14,165,164,0.45)] sm:px-6 sm:py-3"
        >
          Join the Waitlist — It's Free
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>

      <main className="relative z-10">
        {/* ── HERO ── */}
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-4 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28">
          <div className="w-full max-w-3xl text-center">
            <Reveal>
              <p className="font-playfair text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.14em] text-base-content/45 leading-none">
                AI Workflow Engine — Early Access
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="premium-heading mt-4 text-[1.75rem] font-medium leading-tight sm:text-4xl md:text-5xl lg:text-7xl">
                Stop Doing Work{' '}
                <br className="hidden sm:block" />
                Nora Does Automatically
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-base-content/65 leading-relaxed sm:mt-6 sm:text-base lg:text-lg">
                Drop a rough idea, a messy inbox, or a lead list into Nora.
                Get back content, replies, and follow-ups — without lifting a finger.
                Built for solo founders who build instead of admin.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="group relative w-full overflow-hidden rounded-lg bg-primary px-10 py-3.5 text-base font-medium text-primary-foreground shadow-[0_10px_30px_rgba(14,165,164,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(14,165,164,0.28)] sm:w-auto"
                    onClick={() => scrollToSection('waitlist')}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Join the Waitlist
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-base-content/15 px-8 py-3 text-base text-base-content/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary sm:w-auto"
                    onClick={() => scrollToSection('how-it-works')}
                  >
                    See How It Works
                  </button>
                </div>
                <p className="text-xs text-base-content/35">Free during beta — no card required.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SOCIAL PROOF ── */}
        <section className="border-t border-base-content/[0.07] px-4 py-10 sm:px-8 sm:py-12">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-base-content/35">
                What early testers say
              </p>
            </Reveal>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {testimonials.map((t, i) => (
                <Reveal key={i} delay={0.06 * i}>
                  <div className="surface-panel p-5 transition-all duration-300 hover:-translate-y-0.5">
                    <p className="text-sm leading-relaxed text-base-content/70 italic">"{t.quote}"</p>
                    <p className="mt-3 text-xs text-base-content/40">— {t.author}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW NORA WORKS ── */}
        <section id="how-it-works" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">How Nora Works</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/45">
                One input. Multiple outputs. Every step visible.
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
                Nora's Agent Stack
              </p>
            </Reveal>
            <Reveal delay={0.03}>
              <h2 className="premium-heading mt-3 text-center text-2xl font-medium sm:text-3xl">
                Three agents. Every founder workflow.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
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
                <button
                  type="button"
                  onClick={() => scrollToSection('waitlist')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Try the Content Agent free
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
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
              <div className="surface-panel mt-10 overflow-hidden">
                <div className="grid grid-cols-2 border-b border-border/50">
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
        <section className="border-t border-base-content/[0.07] px-4 py-12 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">Simple pricing</h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.06}>
                <div className="surface-panel border-primary/25 p-6 sm:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary/60">Starter</p>
                  <p className="mt-3 text-3xl font-semibold text-base-content">$29<span className="text-base font-normal text-base-content/40">/mo</span></p>
                  <ul className="mt-5 space-y-2.5">
                    {starterFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-base-content/60">
                        <Check className="h-3.5 w-3.5 text-primary/70" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => scrollToSection('waitlist')} className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Join Waitlist
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="surface-panel p-6 sm:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-base-content/35">Pro</p>
                  <p className="mt-3 text-3xl font-semibold text-base-content">$79<span className="text-base font-normal text-base-content/40">/mo</span></p>
                  <ul className="mt-5 space-y-2.5">
                    {proFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-base-content/60">
                        <Check className="h-3.5 w-3.5 text-base-content/30" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => scrollToSection('waitlist')} className="mt-6 w-full rounded-lg border border-base-content/15 py-2.5 text-sm font-medium text-base-content/60 transition-colors hover:border-primary/40 hover:text-primary">
                    Join Waitlist
                  </button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.16}>
              <p className="mt-5 text-center text-xs text-base-content/35">
                Founding member pricing locked in for first 50 signups. Free during current beta — no card required.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── WAITLIST ── */}
        <section id="waitlist" className="scroll-mt-24 border-t border-base-content/[0.07] px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-md">
            <Reveal>
              <h2 className="premium-heading text-center text-2xl font-medium sm:text-3xl">Get early access to Nora</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-2 text-center text-sm text-base-content/45">
                First 50 founders get founding member pricing. We'll reach out personally before launch.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface-panel mt-6 border-primary/20 p-6 shadow-[0_0_40px_rgba(14,165,164,0.08)]">
                <NoraWaitlistForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-base-content/[0.07] px-4 py-10 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3 sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <p className="text-sm font-medium text-base-content/60">Nora by XenoraAI — Know Beyond</p>
              <p className="text-xs text-base-content/30">Built by a solo founder. Designed for solo founders.</p>
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

      <div className="h-16 sm:h-20" />
    </div>
  );
};

export default Index;
