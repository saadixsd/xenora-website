import { Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: 'What is Nora?',
    a: (
      <>
        You bring the idea. Nora handles the execution. Nora is XenoraAI&apos;s workflow engine for solo founders and small teams: not a generic chatbot, but structured runs with visible steps. Content, Lead, and Research agents are all available in the app. Nothing publishes or sends until you approve.
      </>
    ),
  },
  {
    q: 'How is this different from ChatGPT or other AI tools?',
    a: "Nora isn't a freeform chat. It's a structured workflow: classify → execute → format → review. You see each stage, edit outputs, and approve before anything goes out.",
  },
  {
    q: 'What workflows are available?',
    a: 'Content Agent: X post, hooks, LinkedIn draft, and CTA from one input. Lead Agent: scoring, draft replies, and optional ~48h follow-up queue; you approve before send. Research Agent: notes plus optional URLs → pain signals, angles, and relevance. All three are live and ready from the dashboard.',
  },
  {
    q: 'What does the Content Agent produce?',
    a: 'From a single raw input, you get: 1 X/Twitter post (max 280 chars), 3 short hooks, 1 LinkedIn post (2-3 paragraphs), and 1 call-to-action. All publish-ready, all in your chosen tone.',
  },
  {
    q: 'Is my data private?',
    a: "Your workflow inputs and outputs are tied to your account and protected by row-level security. We don't train on your data or share it with anyone.",
  },
  {
    q: 'How much does Nora cost?',
    a: 'Free tier: 5 workflow runs, 10 Ask Nora messages, and 3 custom agents per calendar month (UTC), no card required. Paid plans: Nora Plus at $49.99/mo and Nora Pro at $79.99/mo — both include a 7-day free trial, cancel anytime. Unlimited runs, Ask Nora, and custom agents within fair use; Pro adds deeper answers and higher limits. Subscribe and manage billing in the app (Settings → Billing).',
  },
  {
    q: 'Who is Nora built for?',
    a: 'Solo founders, indie hackers, and creators building in public. People who need to ship content consistently but hate spending hours on repetitive work.',
  },
  {
    q: 'How do I get access?',
    a: (
      <>
        Join the waitlist on the <Link to={ROUTES.home} className="text-primary underline-offset-4 hover:underline">home page</Link>. We&apos;ll reach out as we open access.
      </>
    ),
  },
  {
    q: 'How do I get product updates by email?',
    a: (
      <>
        On the home page, open the <Link to={`${ROUTES.home}#product-updates`} className="text-primary underline-offset-4 hover:underline">Product updates</Link> section and subscribe. We send release notes and shipping news. Unsubscribe anytime.
      </>
    ),
  },
];

function FaqItem({ q, a, delay }: { q: string; a: ReactNode; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        className={cn(
          'collapse collapse-arrow rounded-xl border border-base-content/10 bg-base-200/20 backdrop-blur-sm transition-colors duration-300 hover:border-primary/20',
          open && 'collapse-open',
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="collapse-title min-h-0 w-full py-0 text-left !text-sm font-medium text-base-content/90 after:!top-1/2 after:!-translate-y-1/2"
        >
          <span className="block py-4 pl-1 pr-2">{q}</span>
        </button>
        <div className="collapse-content bg-transparent text-base-content/60">
          <div className="pb-4 pl-1 pr-2 text-sm leading-relaxed">{a}</div>
        </div>
      </div>
    </Reveal>
  );
}

const FAQ = () => {
  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  return (
    <div className="min-h-svh bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-3 py-2 sm:min-h-16 sm:flex-nowrap sm:px-6">
          <Link
            to="/"
            onClick={smoothTop}
            className="flex min-w-0 shrink-0 cursor-pointer items-center gap-2 sm:gap-2.5"
            aria-label="XenoraAI home"
          >
            <XenoraLogo decorative className="h-9 w-9 shrink-0 sm:h-14 sm:w-14" />
            <span className="truncate text-base font-semibold text-base-content sm:max-w-none sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-8">
        <Reveal>
          <h1 className="premium-heading text-3xl font-medium sm:text-4xl">Frequently Asked Questions</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-sm text-base-content/55">
            You bring the idea. Nora handles the execution. Quick answers on workflows, pricing, and getting started.
          </p>
        </Reveal>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} delay={i * 0.03} />
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
              <a href="https://www.instagram.com/xenoraai" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-base-content/85">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://x.com/xenoraai" target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-base-content/85">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.4 22H3.3l7.24-8.27L1 2h6.35l4.38 5.78L18.9 2z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs text-base-content/40">XenoraAI 2026</p>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
            <Link to="/about" onClick={smoothTop} className="transition-colors hover:text-base-content/85">About</Link>
            <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-base-content/85">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
