import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';

const faqs = [
  {
    q: 'What is agentic AI in Nora Focus?',
    a: 'Nora Focus is agentic because it does more than suggest tips. It observes your workflow, analyzes patterns locally, plans a realistic schedule, executes interventions like distraction blocking, and adapts the next day from results.',
  },
  {
    q: 'How does the 5-step loop work?',
    a: 'Observe -> Analyze -> Plan -> Execute -> Adapt. Nora measures behavior, finds patterns with a local model, generates a schedule, applies controls and reminders, then refines the next-day plan.',
  },
  {
    q: 'Is processing local?',
    a: 'Yes. Behavior analysis and planning are designed for local execution on your device. Your focus telemetry is not used for cloud model training.',
  },
  {
    q: 'What models are used?',
    a: 'Nora Focus uses Ollama on macOS and MLC-LLM on mobile targets for local inference workloads.',
  },
  {
    q: 'What data is collected?',
    a: 'With permission: screen-time signals, app switching behavior, keyboard/activity patterns, and deep-work session outcomes needed to optimize schedules.',
  },
  {
    q: 'How does distraction blocking work?',
    a: 'During focus windows, Nora can trigger configured app/site restrictions, launch timer routines, and run playlist automation through connected providers.',
  },
  {
    q: 'Where is waitlist data stored?',
    a: 'Waitlist contact records are stored in Supabase infrastructure configured in the EU region for operational communications.',
  },
  {
    q: 'How do I join the beta?',
    a: 'Use the Nora Focus beta form with your email. Access is released in controlled batches as capacity opens.',
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/92 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="text-base font-semibold text-base-content sm:text-lg">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-8">
        <h1 className="premium-heading text-3xl font-semibold sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-sm text-base-content/55">Technical and operational details for Nora Focus.</p>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="collapse collapse-arrow surface-panel">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium text-base-content/85">{faq.q}</div>
              <div className="collapse-content">
                <p className="text-sm leading-relaxed text-base-content/60">{faq.a}</p>
              </div>
            </div>
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
