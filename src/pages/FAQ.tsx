import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';

const faqs = [
  {
    q: 'What exactly does Nora Focus do?',
    a: 'Nora Focus is a focus coach that runs on your Mac, iPhone, or Android device. It observes your work patterns — when you focus, when you drift — and builds personalized daily schedules with distraction-free deep work blocks. During those blocks, it manages notifications and suggests Spotify playlists to help you stay in flow.',
  },
  {
    q: 'How does the AI learn my patterns?',
    a: 'Nora Focus tracks your app usage, focus sessions, and break patterns over time. After a few days, it identifies your natural productivity rhythms — when you do your best work, when you tend to lose focus, and what triggers distraction. All of this processing happens locally on your device.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. All behavior tracking and pattern analysis happens locally on your device. Your data is never sent to external servers. We designed Nora Focus with a local-first architecture specifically because focus data is deeply personal.',
  },
  {
    q: 'What platforms are supported?',
    a: "We're building for macOS first, with iOS and Android apps following closely. The beta will start with Mac, and mobile versions will be available shortly after.",
  },
  {
    q: 'How does the Spotify integration work?',
    a: 'When a deep work block starts, Nora Focus can automatically play a focus playlist through your Spotify account. Over time, it learns which types of music help you focus best and adjusts its suggestions accordingly.',
  },
  {
    q: 'What will Nora Focus cost?',
    a: 'We plan to offer Nora Focus at $9.99/month after the beta period. The first 100 beta users will receive lifetime Pro access for free. During beta, the app is completely free to use.',
  },
  {
    q: 'How is this different from a Pomodoro timer?',
    a: "Pomodoro timers use fixed intervals regardless of your actual work patterns. Nora Focus learns when you naturally focus best, adapts to your energy levels throughout the day, and actively manages distractions during focus blocks. It's the difference between a generic alarm clock and a schedule built around how you actually work.",
  },
  {
    q: 'When will the beta launch?',
    a: "We're currently in early validation. Join the waitlist and we'll reach out as spots open up. Beta users will have direct access to the team for feedback and feature requests.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
        <XenoraLogo decorative className="h-[min(44vh,320px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(50vh,400px)]" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-8">
        <Reveal>
          <h1 className="premium-heading text-3xl font-semibold sm:text-4xl">Frequently Asked Questions</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-sm text-base-content/55">Common questions about Nora Focus and how the beta works.</p>
        </Reveal>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.03}>
              <div className="collapse collapse-arrow surface-panel">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium text-base-content/85">{faq.q}</div>
                <div className="collapse-content">
                  <p className="text-sm leading-relaxed text-base-content/60">{faq.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-base-content/[0.07] px-4 py-10 sm:px-8">
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
            <p className="text-xs text-base-content/45">XenoraAI 2026</p>
            <p className="text-xs text-base-content/40">@XenoraAI 2026</p>
            <p className="text-[11px] tracking-[0.16em] text-base-content/35">~Know Beyond</p>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
            <Link to="/faq" className="transition-colors hover:text-base-content/85">FAQ</Link>
            <Link to="/privacy" className="transition-colors hover:text-base-content/85">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
