import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'What is Nora?',
    a: 'Nora is XenoraAI’s workflow engine for solo founders and small teams — not a chatbot and not a generic automation tool. The Content Agent is live: raw input in, X post, 3 hooks, LinkedIn post, and CTA out, with every step visible and nothing published until you approve. The Lead Agent is in beta (reply drafts and follow-ups; you approve before send). Research Agent is coming soon.',
  },
  {
    q: 'How is this different from ChatGPT or other AI tools?',
    a: "Nora isn't a freeform chat. It's a structured workflow: classify → execute → format → review. You see each stage, edit outputs, and approve before anything goes out.",
  },
  {
    q: 'What workflows are available?',
    a: 'Content Agent — live. Lead Agent — beta (scoring, draft replies, ~48h follow-up queue; approve before send). Research Agent — coming soon (pain signals and angles from real conversations).',
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
    q: 'Is the beta free? What will pricing be?',
    a: 'Yes — free during beta, no card required. When paid plans ship: Starter is $29/mo (Content Agent, up to 100 runs/mo, dashboard + history) and Pro is $79/mo (all agents including beta Lead, unlimited runs, integrations when available, priority support). The first 50 waitlist signups lock founding-member pricing.',
  },
  {
    q: 'Who is Nora built for?',
    a: 'Solo founders, indie hackers, and creators building in public. People who need to ship content consistently but hate spending hours on repetitive work.',
  },
];

function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
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
          <p className="pb-4 pl-1 pr-2 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </Reveal>
  );
}

const FAQ = () => {
  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
        <XenoraLogo decorative className="h-[min(44vh,320px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(50vh,400px)]" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={smoothTop} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-8">
        <Reveal>
          <h1 className="premium-heading text-3xl font-medium sm:text-4xl">Frequently Asked Questions</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-sm text-base-content/55">Everything you need to know about Nora's AI workflows and the beta.</p>
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
            <p className="text-sm font-medium text-base-content/60">Nora by XenoraAI</p>
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
