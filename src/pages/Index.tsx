import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NoraWaitlistForm } from '@/components/nora-landing/NoraWaitlistForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Reveal } from '@/components/motion/Reveal';

const flowSteps = [
  {
    step: '01',
    title: 'Learns your patterns',
    body: 'Nora observes when you focus and when you drift. It builds a realistic picture of your day without judgment.',
  },
  {
    step: '02',
    title: 'Builds your schedule',
    body: 'Using your own rhythms, Nora creates practical deep-work blocks at times you can actually sustain.',
  },
  {
    step: '03',
    title: 'Protects your focus',
    body: 'During focus blocks, Nora reduces interruptions and starts music that helps you stay in the zone.',
  },
];

const valueCards = [
  { title: 'Real behavior, not guesses', desc: 'Your schedule adapts to your actual habits, not generic templates.' },
  { title: 'Calm by default', desc: 'Fewer interruptions during deep-work windows, with less friction to stay on track.' },
  { title: 'Private by design', desc: 'Pattern analysis happens locally on your device to keep your workflow data personal.' },
];

const Index = () => {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -36]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <motion.div
        style={{ y: watermarkY }}
        className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center"
        aria-hidden
      >
        <XenoraLogo decorative className="h-[min(46vh,360px)] w-auto max-w-[78vw] opacity-[0.07]" />
      </motion.div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="text-sm font-semibold text-base-content">XenoraAI</span>
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
                Protect your best work time.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-base text-base-content/70 sm:text-lg">
                Nora Focus learns how you work, helps shape realistic daily focus blocks, and quietly keeps distractions from taking over.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-4 max-w-xl text-sm text-base-content/50 sm:text-base">
                Built for people who want calm, consistent deep work without rigid routines.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#waitlist"
                  className="btn btn-primary px-8 shadow-[0_10px_30px_rgba(0,212,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,212,255,0.28)]"
                >
                  Join the beta waitlist
                </a>
                <a
                  href="#how-it-works"
                  className="btn btn-ghost border border-base-content/15 px-7 text-base-content/80 transition-all duration-300 hover:border-primary/45 hover:bg-base-200/45 hover:text-base-content"
                >
                  See how it works
                </a>
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
                Three clear steps. Lightweight setup. Better focus that feels sustainable.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {flowSteps.map((s, index) => (
                <Reveal key={s.step} delay={0.08 * index}>
                  <article className="surface-panel h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
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
              <h2 className="premium-heading text-center text-2xl font-semibold sm:text-3xl">Why people choose Nora Focus</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-base-content/55 sm:text-base">
                Most focus tools ask you to force a routine. Nora Focus starts from your real day and builds structure that feels workable.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {valueCards.map((card, index) => (
                <Reveal key={card.title} delay={0.08 * index}>
                  <article className="surface-panel h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-base-200/45">
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
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-base-content/45">XenoraAI · Montréal</p>
            <div className="flex gap-5 text-xs text-base-content/45">
              <Link to="/faq" className="transition-colors hover:text-base-content/85">FAQ</Link>
              <Link to="/privacy" className="transition-colors hover:text-base-content/85">Privacy Policy</Link>
            </div>
            <p className="text-xs text-base-content/35">© {new Date().getFullYear()} XenoraAI</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
