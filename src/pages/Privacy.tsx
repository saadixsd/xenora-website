import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Instagram, Linkedin, ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { cn } from '@/lib/utils';

const sections = [
  {
    title: 'What Data We Collect',
    content:
      'For waitlist and beta access, we collect your name and email. When you use Nora, we store workflow inputs you provide, generated outputs, and your preferences (tone, audience). We do not collect data beyond what you explicitly submit.',
  },
  {
    title: 'How Data Is Used',
    content:
      'Your workflow inputs are processed to generate content outputs. Data is used to operate the service, improve reliability, and personalize your experience. We do not sell personal data or use it to train third-party models.',
  },
  {
    title: 'AI Processing',
    content:
      'Nora uses AI models to process your workflow inputs. Your inputs are sent to our AI infrastructure for processing and are not retained by the AI provider after generation. Outputs are stored in your account for your access.',
  },
  {
    title: 'Data Storage and Security',
    content:
      'Data is stored in secure cloud infrastructure with encryption in transit and at rest. Row-level security ensures you can only access your own data. We apply least-privilege access controls across all systems.',
  },
  {
    title: 'Data Retention',
    content:
      'Workflow data is retained as long as your account is active. You can export all your data at any time from Settings, or request deletion by contacting us.',
  },
  {
    title: 'Your Rights',
    content:
      'You may request access, correction, export, or deletion of your personal data at any time by contacting xenoraai@gmail.com or using the export feature in your account settings.',
  },
  {
    title: 'Third-Party Services',
    content:
      'We use secure infrastructure providers for hosting, authentication, and AI processing. We do not share your personal data with advertisers or data brokers.',
  },
  {
    title: 'Contact',
    content:
      'For privacy questions or data requests, contact xenoraai@gmail.com.',
  },
];

function PrivacySection({ title, content, delay }: { title: string; content: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="surface-panel w-full text-left p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm font-medium text-base-content/85 pr-4">{title}</span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-base-content/40 transition-transform duration-200', open && 'rotate-180')} />
        </div>
        {open && (
          <div className="border-t border-border/50 px-5 py-4">
            <p className="text-sm leading-relaxed text-base-content/60">{content}</p>
          </div>
        )}
      </button>
    </Reveal>
  );
}

const Privacy = () => {
  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NeuralMeshBackground />

      <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
        <XenoraLogo decorative className="h-[min(44vh,320px)] w-auto max-w-[82vw] opacity-[0.14] sm:h-[min(50vh,400px)]" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
          <Link to="/" onClick={smoothTop} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="Nora home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">Nora</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-8">
        <Reveal>
          <h1 className="premium-heading text-3xl font-medium sm:text-4xl">Privacy Policy</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-sm text-base-content/55">Last updated: April 2026</p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-content/60">
            At XenoraAI, your data is your data. This page explains what we collect, how we use it, and how we protect it.
          </p>
        </Reveal>

        <div className="mt-10 space-y-3">
          {sections.map((section, i) => (
            <PrivacySection key={section.title} title={section.title} content={section.content} delay={i * 0.03} />
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
            <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-base-content/85">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
