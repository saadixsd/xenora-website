import { Link } from 'react-router-dom';
import { Instagram, Linkedin, FileText, Search, Zap, ArrowRight, Check, Inbox, Sparkles, FileCheck2 } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { ProductEmailUpdatesForm } from '@/components/nora-landing/ProductEmailUpdatesForm';
import { Reveal } from '@/components/motion/Reveal';
import { ROUTES } from '@/config/routes';

const agents = [
  {
    icon: FileText,
    name: 'Content',
    body: 'A rough thought becomes a full content package. One X post, three hooks, a LinkedIn draft, a CTA. You review, then ship.',
    outputs: ['1 X post', '3 hooks', '1 LinkedIn post', '1 CTA'],
  },
  {
    icon: Zap,
    name: 'Lead',
    body: 'A new inquiry comes in. Nora scores it, drafts a personal reply, and queues a follow-up for 48 hours later. You approve before anything sends.',
    outputs: ['Lead score', 'Draft reply', 'Follow-up queue'],
  },
  {
    icon: Search,
    name: 'Research',
    body: 'Combine your notes with public URLs. Nora extracts pain signals, content angles, and relevance you can act on today.',
    outputs: ['Pain signals', 'Content angles', 'Relevance notes'],
  },
];

const outcomes = [
  {
    title: 'Hours back',
    body: 'The repetitive operational work — content drafts, lead replies, research synthesis — runs in the background while you build.',
  },
  {
    title: 'Visible work',
    body: 'Every run shows its steps. You see exactly what Nora did, not a chat box that maybe replied to something.',
  },
  {
    title: 'You stay in control',
    body: 'Nothing ships without your review. Nora drafts and stages. You approve, edit, or rerun.',
  },
];

const freeTierFeatures = [
  '5 reviewed workflow runs per month',
  '10 Ask Nora messages per month',
  '3 custom agents',
  'Content, Lead, and Research agents',
  'Run history and visible progress',
];
const plusFeatures = [
  'Unlimited workflow runs (fair use)',
  'Unlimited Ask Nora conversations (fair use)',
  'All three agents at higher throughput',
  'Connections: Gmail, X, Instagram, LinkedIn',
  'Managed billing, cancel anytime',
];
const proFeatures = [
  'Everything in Nora Plus',
  'Pro-tier model for Ask Nora with higher limits',
  'Priority connections and deeper analysis',
  'For teams running multiple workflows daily',
];

const Index = () => {
  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/95 pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-2 sm:min-h-16 sm:flex-nowrap sm:px-6">
          <Link
            to="/"
            onClick={smoothTop}
            className="flex min-w-0 shrink-0 cursor-pointer items-center gap-2"
            aria-label="XenoraAI home"
          >
            <XenoraLogo decorative className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
            <span className="truncate text-base font-medium tracking-tight sm:text-lg">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative">
        {/* ── HERO ── single sentence, single CTA ── */}
        <section className="flex min-h-svh flex-col items-center justify-center px-4 pb-20 pt-[max(6rem,calc(env(safe-area-inset-top,0px)+5rem))] sm:px-8 sm:pb-24 sm:pt-32">
          <div className="w-full max-w-3xl text-center">
            <Reveal delay={0.05}>
              <h1 className="premium-heading mt-8 text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem]">
                The Agentic Engine
                <br className="hidden sm:block" />
                {' '}That Runs Your Ops.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Nora learns how you work, plugs into your tools, and drafts the repetitive workflows that drain your day, content, outreach, follow-ups, and research so you can review and approve in minutes.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  to={ROUTES.dashboard.root}
                  className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90"
                >
                  View Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button
                  type="button"
                  className="inline-flex min-h-[48px] items-center rounded-full px-5 py-3 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  onClick={() => scrollToSection('see-nora')}
                >
                  See it run
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SEE NORA IN ACTION ── */}
        <section id="see-nora" className="scroll-mt-24 border-t border-border/60 px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-center font-space-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                The loop
              </p>
            </Reveal>
            <Reveal delay={0.04}>
              <h2 className="premium-heading mt-4 text-center text-3xl sm:text-4xl md:text-5xl">
                Input. Workflow. Output.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-4 max-w-xl text-center text-base text-muted-foreground">
                One run. Visible steps. Reviewable outputs. The same loop, every time.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-14 grid gap-4 lg:grid-cols-3">
                {/* Input */}
                <div className="surface-panel flex flex-col p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Inbox className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-space-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Input</p>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">Founder note</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">
                    "Shipped async invites today. Cuts onboarding from 3 days to 4 hours. Want to post about it and reply to the 2 leads from yesterday."
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                    {['notes', 'leads', 'URLs', 'transcripts'].map((t) => (
                      <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Workflow */}
                <div className="surface-panel flex flex-col p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-space-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Workflow</p>
                    
                  </div>
                  <ul className="mt-5 space-y-3">
                    {[
                      { label: 'Input received', state: 'done' },
                      { label: 'Routed to Content Agent', state: 'done' },
                      { label: 'Drafting hooks + LinkedIn post', state: 'active' },
                      { label: 'Drafting lead replies', state: 'pending' },
                      { label: 'Stage for review', state: 'pending' },
                    ].map((s) => (
                      <li key={s.label} className="flex items-center gap-2.5">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            s.state === 'done'
                              ? 'bg-primary'
                              : s.state === 'active'
                                ? 'bg-primary animate-pulse'
                                : 'bg-muted-foreground/30'
                          }`}
                        />
                        <span
                          className={`text-[14px] ${
                            s.state === 'done'
                              ? 'text-foreground/75'
                              : s.state === 'active'
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground/60'
                          }`}
                        >
                          {s.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Output */}
                <div className="surface-panel flex flex-col p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <FileCheck2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-space-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Output</p>
                  </div>
                  <ul className="mt-5 space-y-2.5 text-[14px] text-foreground/80">
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> 1 X post + 3 hooks</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> 1 LinkedIn post + CTA</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> 2 personalized lead replies</li>
                    <li className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> Follow-up queued for 48h</li>
                  </ul>
                  <p className="mt-auto pt-6 text-xs text-muted-foreground">
                    Edit, approve, or rerun. Nothing ships without you.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── AGENTS ── */}
        <section className="border-t border-border/60 px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="text-center font-space-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                The agents
              </p>
            </Reveal>
            <Reveal delay={0.04}>
              <h2 className="premium-heading mt-4 text-center text-3xl sm:text-4xl md:text-5xl">
                Three. All live.
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a, i) => (
                <Reveal key={a.name} delay={0.06 * i}>
                  <article className="surface-panel flex h-full flex-col p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <a.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <h3 className="premium-heading mt-5 text-2xl">{a.name}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{a.body}</p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                      {a.outputs.map((o) => (
                        <span key={o} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{o}</span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY NORA ── three outcomes, no comparison table ── */}
        <section className="border-t border-border/60 px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="premium-heading text-center text-3xl sm:text-4xl md:text-5xl">
                Why Nora
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {outcomes.map((o, i) => (
                <Reveal key={o.title} delay={0.06 * i}>
                  <div>
                    <p className="font-space-mono text-[10px] uppercase tracking-[0.18em] text-primary">0{i + 1}</p>
                    <h3 className="premium-heading mt-3 text-2xl">{o.title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{o.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="scroll-mt-24 border-t border-border/60 px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="premium-heading text-center text-3xl sm:text-4xl md:text-5xl">Pricing</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mx-auto mt-4 max-w-xl text-center text-base text-muted-foreground">
                Start free. Validate one workflow. Scale when it earns it. Paid plans include a 7-day trial. Cancel anytime.
              </p>
            </Reveal>

            <div className="mx-auto mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Reveal delay={0.06}>
                <article className="surface-panel flex h-full flex-col p-7 text-left">
                  <h3 className="text-sm font-medium tracking-wide text-muted-foreground">Free</h3>
                  <p className="premium-heading mt-3 text-4xl">
                    $0<span className="text-base text-muted-foreground"> /mo</span>
                  </p>
                  <ul className="mt-6 space-y-2.5 text-[14px] text-muted-foreground">
                    {freeTierFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <Link
                      to={ROUTES.signup}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
                    >
                      Get started
                    </Link>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.1}>
                <article className="surface-panel relative flex h-full flex-col border-primary/30 p-7 text-left ring-1 ring-primary/20">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-medium text-primary-foreground">Most popular</span>
                  <h3 className="text-sm font-medium tracking-wide text-muted-foreground">Nora Plus</h3>
                  <p className="premium-heading mt-3 text-4xl">
                    $49.99<span className="text-base text-muted-foreground"> /mo</span>
                  </p>
                  <p className="mt-1 text-xs text-primary">7-day free trial</p>
                  <ul className="mt-6 space-y-2.5 text-[14px] text-muted-foreground">
                    {plusFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <a
                      href="https://buy.stripe.com/bJe4gy4RceG67dyaHwdnW03"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Start free trial
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={0.14}>
                <article className="surface-panel flex h-full flex-col p-7 text-left">
                  <h3 className="text-sm font-medium tracking-wide text-muted-foreground">Nora Pro</h3>
                  <p className="premium-heading mt-3 text-4xl">
                    $79.99<span className="text-base text-muted-foreground"> /mo</span>
                  </p>
                  <p className="mt-1 text-xs text-primary">7-day free trial</p>
                  <ul className="mt-6 space-y-2.5 text-[14px] text-muted-foreground">
                    {proFeatures.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <a
                      href="https://buy.stripe.com/6oUeVcfvQcxY8hCcPEdnW02"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
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
        <section className="border-t border-border/60 px-4 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="premium-heading text-3xl sm:text-4xl md:text-6xl">
                Stop juggling tabs.
                <br className="hidden sm:block" />
                {' '}Start running workflows.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
                Join the beta and put your first workflow live this week.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-9 flex justify-center">
                <Link
                  to={ROUTES.tryNora}
                  className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Join the beta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRODUCT UPDATES ── */}
        <section id="product-updates" className="scroll-mt-24 border-t border-border/60 px-4 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-md">
            <Reveal>
              <h2 className="premium-heading text-center text-3xl sm:text-4xl">Product updates</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Release notes from the team. Unsubscribe anytime.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface-panel mt-8 p-6">
                <ProductEmailUpdatesForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border/60 px-4 py-12 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3 sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <p className="text-sm font-medium">XenoraAI</p>
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <a href="https://www.linkedin.com/company/xenoraai" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
                <a href="https://www.instagram.com/xenoraai" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-foreground"><Instagram className="h-4 w-4" /></a>
                <a href="https://x.com/xenoraai" target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-foreground">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.4 22H3.3l7.24-8.27L1 2h6.35l4.38 5.78L18.9 2z" /></svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-xs text-muted-foreground">XenoraAI · 2026</p>
              <a href="mailto:xenoraai@gmail.com" className="text-xs text-muted-foreground transition-colors hover:text-foreground">xenoraai@gmail.com</a>
            </div>
            <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground sm:justify-end">
              <Link to={ROUTES.about} onClick={smoothTop} className="transition-colors hover:text-foreground">About</Link>
              <Link to={ROUTES.faq} onClick={smoothTop} className="transition-colors hover:text-foreground">FAQ</Link>
              <Link to={ROUTES.privacy} onClick={smoothTop} className="transition-colors hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
