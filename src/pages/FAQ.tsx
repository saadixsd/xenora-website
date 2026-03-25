import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';

const faqs = [
  {
    q: 'What is Nora?',
    a: 'Nora is an agentic AI engine for business operations. It observes workflow context, adapts to patterns, and executes task workflows with guardrails so teams move faster without chaos.',
  },
  {
    q: 'How does the agentic loop work?',
    a: 'Nora runs a 5-stage loop: Email/Slack → Indexes Context → Learns Patterns → Autonomous Execution → Results dashboard. It uses permissioned inputs, learns your recurring playbooks, and keeps execution traceable.',
  },
  {
    q: 'Which workflows can Nora help with?',
    a: 'Nora is built to automate real business work: IT agents auto-resolve tickets and self-heal systems, HR agents screen CVs and support interview + onboarding flows, and Finance agents assist with invoices, collections, and cashflow automation.',
  },
  {
    q: 'Does Nora run locally?',
    a: 'Core processing is designed for local execution. Sensitive operational context stays on your device by default, and we avoid using your data to train remote models for this beta.',
  },
  {
    q: 'What data is stored when I join the waitlist?',
    a: 'Waitlist records are stored in your configured Supabase project for beta operations. We collect your name, email, role, and company size to coordinate early access.',
  },
  {
    q: 'How does Nora execute tasks?',
    a: 'Execution happens through approved workflows with guardrails. Nora can prepare actions and trigger operations that you authorize, then provide a clear results summary so teams can review and iterate quickly.',
  },
  {
    q: 'Is Nora replacing my team?',
    a: 'No. Nora is meant to remove busywork and coordination bottlenecks. Humans stay in control, and Nora focuses on reliable next actions, structured follow-ups, and faster throughput.',
  },
  {
    q: 'How do I join the beta?',
    a: 'Submit your email through the waitlist form. Access is released in controlled batches as capacity opens.',
  },
];

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
          <h1 className="premium-heading text-3xl font-semibold sm:text-4xl">Frequently Asked Questions</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-sm text-base-content/55">Common questions about Nora’s agentic engine and how the beta works.</p>
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
            <p className="text-xs text-base-content/40">@XenoraAI 2026</p>
            <p className="text-[12px] sm:text-[11px] tracking-[0.16em] text-base-content/35">XenoraAI</p>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-base-content/45 sm:justify-end">
            <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-base-content/85">FAQ</Link>
            <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-base-content/85">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
