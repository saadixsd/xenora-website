import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { NeuralNavGraph } from '@/components/nora-landing/NeuralNavGraph';
import { NoraSiteNav } from '@/components/nora-landing/NoraSiteNav';
import {
  NEURAL_NODES,
  SECTION_IDS,
  scrollToSection,
  type NeuralNodeId,
} from '@/components/nora-landing/neuralNavData';
import { NoraWaitlistForm } from '@/components/nora-landing/NoraWaitlistForm';

const Index = () => {
  const [activeId, setActiveId] = useState<NeuralNodeId | null>(null);
  const [hoveredId, setHoveredId] = useState<NeuralNodeId | null>(null);
  const docsRef = useRef<HTMLDialogElement>(null);
  const enterpriseRef = useRef<HTMLDialogElement>(null);

  const [platformTab, setPlatformTab] = useState<'run' | 'connections'>('run');

  const handleNodeClick = useCallback((id: NeuralNodeId) => {
    const node = NEURAL_NODES.find((n) => n.id === id);
    if (!node) return;
    setActiveId(id);
    scrollToSection(node.sectionId);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current: NeuralNodeId | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) {
          const n = NEURAL_NODES.find((x) => x.sectionId === id);
          if (n) current = n.id;
        }
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div data-theme="xenora" className="min-h-screen bg-base-100 text-base-content antialiased">
      <NeuralMeshBackground />

      {/* Watermark — real mark, very light so content stays readable */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <div className="flex max-w-[min(90vw,520px)] flex-col items-center justify-center gap-6 opacity-[0.14] saturate-[0.85]">
          <XenoraLogo decorative className="h-[min(38vh,280px)] w-auto max-w-full blur-[2px]" />
          <span className="text-center text-[clamp(1.75rem,6vw,3.5rem)] font-semibold tracking-tight text-base-content/90">
            XenoraAI
          </span>
        </div>
      </div>

      {/* Primary navigation — scannable text links (not the graph) */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/10 bg-base-100/85 backdrop-blur-md">
        <div className="navbar mx-auto min-h-14 max-w-6xl gap-2 px-3 py-2 sm:px-6">
          <div className="navbar-start min-w-0 flex-1">
            <Link
              to="/"
              className="btn btn-ghost btn-sm gap-2.5 px-1.5 font-semibold normal-case text-base-content"
              aria-label="XenoraAI home"
            >
              <XenoraLogo decorative className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
              <span className="truncate">XenoraAI</span>
            </Link>
          </div>
          <div className="navbar-center hidden min-w-0 shrink md:flex md:max-w-none md:flex-1 md:justify-center">
            <NoraSiteNav />
          </div>
          <div className="navbar-end shrink-0 gap-1">
            <NoraSiteNav className="md:hidden" />
            <a
              href="#get-started"
              className="btn btn-ghost btn-sm border border-base-content/10 font-normal normal-case text-base-content/85 hover:border-primary/35 hover:text-primary"
            >
              Log in
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero — headline first; map is optional */}
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-4 pb-20 pt-28 sm:px-8">
          <div className="w-full max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-base-content/45">Nora · XenoraAI</p>
            <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.08] tracking-tight text-base-content sm:text-5xl lg:text-[3.25rem]">
              Nora — The Knowledge-First AI Agent Platform
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-sm text-base-content/65 sm:text-lg">
              Connect your data. Let agents anticipate and automate real workflows. Know Beyond.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="#get-started"
                className="btn btn-primary min-w-[200px] border-0 bg-primary text-primary-content shadow-none hover:brightness-110"
              >
                Get started for free
              </a>
              <a
                href="#nora-platform"
                className="btn btn-ghost min-w-[200px] border border-base-content/15 font-normal normal-case text-base-content hover:bg-base-200"
              >
                View Nora demo
              </a>
            </div>

            <p className="mx-auto mt-12 max-w-md text-xs leading-relaxed text-base-content/40">
              Use the <strong className="font-medium text-base-content/55">menu above</strong> to jump anywhere. Below is
              an optional map — same destinations, if you prefer it visual.
            </p>

            <div className="mt-6 opacity-90">
              <NeuralNavGraph
                compact
                activeId={activeId}
                hoveredId={hoveredId}
                onNodeClick={handleNodeClick}
                onHover={setHoveredId}
              />
            </div>
          </div>
        </section>

        {/* Nora Platform */}
        <section id="nora-platform" className="scroll-mt-28 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Nora Platform
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-base-content/55 sm:text-base">
              One dashboard: connect sources, run agents, and watch workflows execute with full context.
            </p>

            <div className="mt-10">
              <div role="tablist" className="tabs-boxed tabs mx-auto grid max-w-md grid-cols-2 bg-base-200/50 p-1">
                <button
                  type="button"
                  role="tab"
                  aria-selected={platformTab === 'run'}
                  className={`tab text-xs sm:text-sm ${platformTab === 'run' ? 'tab-active' : ''}`}
                  onClick={() => setPlatformTab('run')}
                >
                  Live run
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={platformTab === 'connections'}
                  className={`tab text-xs sm:text-sm ${platformTab === 'connections' ? 'tab-active' : ''}`}
                  onClick={() => setPlatformTab('connections')}
                >
                  Connections
                </button>
              </div>
              <div className="card mt-6 border border-base-content/10 bg-base-200/20 shadow-xl shadow-black/40 backdrop-blur-sm">
                <div className="card-body gap-0 p-0">
                  <div className="flex items-center justify-between border-b border-base-content/10 px-5 py-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-base-content/45">
                      Nora · Workspace
                    </span>
                    <span className="badge badge-outline badge-sm border-primary/30 text-primary">Healthy</span>
                  </div>
                  {platformTab === 'run' ? (
                    <div className="grid gap-0 md:grid-cols-[1fr_1.2fr]">
                      <div className="border-b border-base-content/10 p-5 md:border-b-0 md:border-r">
                        <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">Data in</p>
                        <ul className="mt-4 space-y-3 text-sm text-base-content/75">
                          {['Notion · synced', 'Drive · 2 sources', 'Email · triage agent'].map((s) => (
                            <li
                              key={s}
                              className="flex items-center justify-between rounded-lg border border-base-content/5 bg-base-100/40 px-3 py-2"
                            >
                              <span>{s}</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-primary/80 shadow-[0_0_8px_rgb(34_211_238_/_0.6)]" />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">Agents running</p>
                        <div className="mt-4 space-y-3">
                          {[
                            { t: 'Context synthesis', s: 'Indexing new pages' },
                            { t: 'Workflow runner', s: '3 steps · awaiting approval' },
                          ].map((row) => (
                            <div key={row.t} className="rounded-xl border border-primary/15 bg-base-100/30 p-4">
                              <p className="text-sm font-semibold text-base-content">{row.t}</p>
                              <p className="mt-1 text-xs text-base-content/50">{row.s}</p>
                              <progress className="progress progress-primary mt-3 h-1 w-full bg-base-content/10" value={66} max={100} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 md:p-8">
                      <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">Connected sources</p>
                      <p className="mt-2 text-sm text-base-content/60">
                        OAuth connectors, scoped tokens, and read/write policies per workspace. Nora only pulls what you
                        authorize.
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {[
                          { n: 'Notion', st: 'Live' },
                          { n: 'Google Drive', st: 'Live' },
                          { n: 'Gmail', st: 'Read-only' },
                          { n: 'Slack', st: 'Coming soon' },
                        ].map((c) => (
                          <div
                            key={c.n}
                            className="flex items-center justify-between rounded-xl border border-base-content/10 bg-base-100/25 px-4 py-3 text-sm"
                          >
                            <span className="font-medium text-base-content">{c.n}</span>
                            <span className="text-xs text-base-content/45">{c.st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Nora Works */}
        <section id="how-nora-works" className="scroll-mt-28 border-t border-base-content/5 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">How Nora Works</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-base-content/55">
              Three steps. One loop. Nora keeps context attached from signal to execution.
            </p>
            <div className="relative mt-14 grid gap-10 md:grid-cols-3">
              <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent md:block" />
              {[
                {
                  step: '01',
                  title: 'Connect',
                  body: 'Wire Notion, files, and inboxes. Nora builds a live knowledge graph—no copy-paste sprawl.',
                },
                {
                  step: '02',
                  title: 'Anticipate',
                  body: 'Agents read signals across your stack and surface the next best action before you context-switch.',
                },
                {
                  step: '03',
                  title: 'Automate',
                  body: 'Approve runs or let Nora execute repeatable workflows with guardrails you control.',
                },
              ].map((s, i) => (
                <div key={s.step} className="relative text-center md:text-left">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/35 bg-base-200/40 font-mono text-sm text-primary shadow-[0_0_24px_rgb(34_211_238_/_0.2)] md:mx-0">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-base-content">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-base-content/55">{s.body}</p>
                  {i < 2 && (
                    <div className="mx-auto mt-8 h-px w-12 bg-gradient-to-r from-primary/5 via-primary/40 to-primary/5 md:hidden" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-28 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Nora Pricing</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/55">
              Start free. Upgrade when agents run your real workloads.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Free',
                  price: '$0',
                  desc: 'Explore Nora with limited agent runs.',
                  feats: ['1 workspace', 'Basic connectors', 'Community support'],
                  cta: 'Start free',
                  highlight: false,
                },
                {
                  name: 'Pro',
                  price: '$29',
                  desc: 'For individuals shipping with agents daily.',
                  feats: ['Unlimited runs', 'Priority sync', 'Advanced workflows'],
                  cta: 'Get Pro',
                  highlight: true,
                },
                {
                  name: 'Enterprise',
                  price: 'Let’s talk',
                  desc: 'Security review, SSO, and dedicated support.',
                  feats: ['VPC options', 'Audit logs', 'Success engineer'],
                  cta: 'Contact',
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`card border bg-base-200/25 shadow-lg shadow-black/30 backdrop-blur-sm ${
                    tier.highlight ? 'border-primary/40 ring-1 ring-primary/25' : 'border-base-content/10'
                  }`}
                >
                  <div className="card-body">
                    <h3 className="card-title text-lg">{tier.name}</h3>
                    <p className="text-3xl font-bold tracking-tight">{tier.price}</p>
                    <p className="text-sm text-base-content/55">{tier.desc}</p>
                    <ul className="mt-4 space-y-2 text-sm text-base-content/70">
                      {tier.feats.map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="text-primary">▹</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="card-actions mt-6 justify-start">
                      {tier.name === 'Enterprise' ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm border-base-content/20"
                          onClick={() => enterpriseRef.current?.showModal()}
                        >
                          {tier.cta}
                        </button>
                      ) : (
                        <a href="#get-started" className="btn btn-primary btn-sm">
                          {tier.cta}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Docs teaser */}
        <section id="docs" className="scroll-mt-28 px-4 py-12 sm:px-8">
          <div className="mx-auto max-w-xl rounded-2xl border border-base-content/10 bg-base-200/30 px-6 py-10 text-center">
            <h2 className="text-xl font-semibold">Docs</h2>
            <p className="mt-2 text-sm text-base-content/55">
              API references, agent recipes, and security notes are on the way.
            </p>
            <button
              type="button"
              className="btn btn-outline btn-primary btn-sm mt-6 border-primary/50"
              onClick={() => docsRef.current?.showModal()}
            >
              Open docs preview
            </button>
          </div>
        </section>

        {/* Enterprise anchor */}
        <section id="enterprise" className="scroll-mt-28 px-4 pb-8 sm:px-8">
          <div className="mx-auto max-w-2xl text-center text-sm text-base-content/45">
            <button
              type="button"
              className="link link-hover text-primary"
              onClick={() => enterpriseRef.current?.showModal()}
            >
              Enterprise &amp; security
            </button>
          </div>
        </section>

        {/* Get started */}
        <section id="get-started" className="scroll-mt-28 border-t border-base-content/5 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-md">
            <h2 className="text-center text-2xl font-bold">Get started with Nora</h2>
            <p className="mt-2 text-center text-sm text-base-content/55">
              Request access — we&apos;ll onboard you into the same Nora workspace you saw above.
            </p>
            <div className="card mt-10 border border-base-content/10 bg-base-200/25 p-6 shadow-xl shadow-black/40 backdrop-blur-md">
              <NoraWaitlistForm />
            </div>
          </div>
        </section>

        <footer className="border-t border-base-content/10 px-4 py-12 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-base-content/50">
              XenoraAI <span className="text-base-content/35">·</span> Know Beyond
            </p>
            <div className="flex flex-wrap justify-center gap-5 text-xs text-base-content/45">
              <a href="#nora-platform" className="link-hover link">
                Nora Platform
              </a>
              <a href="#how-nora-works" className="link-hover link">
                How Nora Works
              </a>
              <a href="#pricing" className="link-hover link">
                Pricing
              </a>
              <button type="button" className="link-hover link bg-transparent" onClick={() => docsRef.current?.showModal()}>
                Docs
              </button>
            </div>
            <p className="text-xs text-base-content/35">© {new Date().getFullYear()} XenoraAI</p>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <dialog ref={docsRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border border-base-content/10 bg-base-200/95 text-base-content backdrop-blur-md">
          <h3 className="text-lg font-bold">Docs — coming soon</h3>
          <p className="py-4 text-sm text-base-content/65">
            We&apos;re finishing Nora&apos;s public documentation: connectors, agent design, and security. Leave your email
            in Get Started and we&apos;ll notify you first.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close" className="cursor-default bg-transparent">
            {' '}
          </button>
        </form>
      </dialog>

      <dialog ref={enterpriseRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border border-base-content/10 bg-base-200/95 text-base-content backdrop-blur-md">
          <h3 className="text-lg font-bold">Enterprise</h3>
          <p className="py-4 text-sm text-base-content/65">
            For SSO, audit trails, and deployment options, email{' '}
            <a className="link link-primary" href="mailto:hello@xenoraai.com">
              hello@xenoraai.com
            </a>
            .
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close" className="cursor-default bg-transparent">
            {' '}
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default Index;
