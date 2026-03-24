import { Link } from 'react-router-dom';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NoraWaitlistForm } from '@/components/nora-landing/NoraWaitlistForm';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';

const Index = () => {
  return (
    <div data-theme="xenora" className="min-h-screen bg-[#0A0A0F] text-base-content">
      <NeuralMeshBackground />

      {/* Watermark logo */}
      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
        <XenoraLogo decorative className="h-[min(50vh,400px)] w-auto max-w-[80vw] opacity-[0.08]" />
      </div>

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.06] bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="text-sm font-semibold text-base-content">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-4 pb-20 pt-24 sm:px-8">
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-base-content sm:text-6xl lg:text-7xl">
              Nora Focus
            </h1>
            <p className="mt-5 text-lg font-medium text-base-content/70 sm:text-xl">
              AI that learns your focus patterns and helps you protect deep work.
            </p>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-base-content/45 sm:text-base">
              Nora Focus tracks where you lose time, builds realistic daily schedules, and automatically blocks distractions while suggesting music that actually helps you stay focused. All processing happens locally on your device for maximum privacy.
            </p>
            <div className="mt-10">
              <a
                href="#waitlist"
                className="btn btn-outline btn-primary px-8"
              >
                Join the beta waitlist
              </a>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="scroll-mt-20 border-t border-base-content/[0.06] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">How Nora Focus Works</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-base-content/45">
              Three steps. No complicated setup. Just better focus.
            </p>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Learns your patterns',
                  body: 'Nora observes when you actually focus and when you drift. It builds an honest picture of your work habits — no judgment, just data.',
                },
                {
                  step: '02',
                  title: 'Builds your schedule',
                  body: 'Based on your real behavior, Nora creates practical daily schedules with deep work blocks placed when you perform best.',
                },
                {
                  step: '03',
                  title: 'Protects your focus',
                  body: 'During scheduled blocks, Nora automatically manages distractions and queues a Spotify playlist tuned to your focus style.',
                },
              ].map((s) => (
                <div key={s.step} className="rounded-lg border border-base-content/[0.06] bg-base-200/30 p-6">
                  <span className="font-mono text-xs text-primary/70">{s.step}</span>
                  <h3 className="mt-2 text-base font-semibold text-base-content">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-base-content/45">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Nora Focus */}
        <section className="border-t border-base-content/[0.06] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Why Nora Focus</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-base-content/45 sm:text-base">
              Most focus tools are just timers. They don't know that you always check Instagram at 3pm, 
              or that your best deep work happens before noon. Nora Focus understands your real behavior 
              and adapts — so your schedule actually works instead of falling apart by lunchtime.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                { title: 'You lose 2.1 hrs/day', desc: 'to the same distractions at the same times. Nora sees the pattern.' },
                { title: 'Same schedule fails daily', desc: 'Generic time-blocking ignores your energy cycles. Nora doesn\'t.' },
                { title: 'Blockers don\'t stick', desc: 'Manual app blockers get turned off. Nora makes focus the default.' },
              ].map((card) => (
                <div key={card.title} className="rounded-lg border border-base-content/[0.06] bg-base-200/20 p-5">
                  <h3 className="text-sm font-semibold text-base-content">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-base-content/40">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="scroll-mt-20 border-t border-base-content/[0.06] px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-md">
            <h2 className="text-center text-2xl font-bold">Join the beta</h2>
            <p className="mt-2 text-center text-sm text-base-content/45">
              Nora Focus is in early beta. Sign up and we'll reach out when your spot opens.
            </p>
            <div className="mt-8 rounded-lg border border-base-content/[0.06] bg-base-200/30 p-6">
              <NoraWaitlistForm />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-base-content/[0.06] px-4 py-10 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-base-content/40">XenoraAI · Montréal</p>
            <div className="flex gap-5 text-xs text-base-content/35">
              <Link to="/faq" className="hover:text-base-content/60">FAQ</Link>
              <Link to="/privacy" className="hover:text-base-content/60">Privacy Policy</Link>
            </div>
            <p className="text-xs text-base-content/25">© {new Date().getFullYear()} XenoraAI</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
