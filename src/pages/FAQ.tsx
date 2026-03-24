import { Link } from 'react-router-dom';
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
    a: 'We\'re building for macOS first, with iOS and Android apps following closely. The beta will start with Mac, and mobile versions will be available shortly after.',
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
    a: 'Pomodoro timers use fixed intervals regardless of your actual work patterns. Nora Focus learns when you naturally focus best, adapts to your energy levels throughout the day, and actively manages distractions during focus blocks. It\'s the difference between a generic alarm clock and a schedule built around how you actually work.',
  },
  {
    q: 'When will the beta launch?',
    a: 'We\'re currently in early validation. Join the waitlist and we\'ll reach out as spots open up. Beta users will have direct access to the team for feedback and feature requests.',
  },
];

const FAQ = () => {
  return (
    <div data-theme="xenora" className="min-h-screen bg-[#0A0A0F] text-base-content">
      <NeuralMeshBackground />

      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
        <XenoraLogo decorative className="h-[min(50vh,400px)] w-auto max-w-[80vw] opacity-[0.08]" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.06] bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="text-sm font-semibold text-base-content">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-sm text-base-content/45">Common questions about Nora Focus.</p>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="collapse collapse-arrow rounded-lg border border-base-content/[0.06] bg-base-200/20">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-sm font-medium text-base-content/80">{faq.q}</div>
              <div className="collapse-content">
                <p className="text-sm leading-relaxed text-base-content/45">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-base-content/[0.06] px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-base-content/40">XenoraAI · Montréal</p>
          <div className="flex gap-5 text-xs text-base-content/35">
            <Link to="/faq" className="hover:text-base-content/60">FAQ</Link>
            <Link to="/privacy" className="hover:text-base-content/60">Privacy Policy</Link>
          </div>
          <p className="text-xs text-base-content/25">© {new Date().getFullYear()} XenoraAI</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
