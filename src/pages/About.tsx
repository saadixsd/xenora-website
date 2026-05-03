import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';

const About = () => {
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
            aria-label="Nora home"
          >
            <XenoraLogo decorative className="h-9 w-9 shrink-0 sm:h-14 sm:w-14" />
            <span className="truncate text-base font-semibold text-base-content sm:max-w-none sm:text-xl">Nora</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-8">
        <Reveal>
          <h1 className="premium-heading text-3xl font-medium sm:text-4xl">About XenoraAI</h1>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-8 text-base leading-relaxed text-base-content/70">
            Founders are drowning in operational noise — the fragmented, repetitive admin work that consumes
            20+ hours a week and stalls growth. You shouldn&apos;t have to choose between managing your business
            and building your product.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="premium-heading mt-14 text-xl font-medium sm:text-2xl">Our mission</h2>
          <p className="mt-4 text-sm leading-relaxed text-base-content/65">
            As a founder, your most valuable asset is your time — not your manual effort on low-leverage tasks.
            XenoraAI exists to reclaim that time by providing an infrastructure layer between your tools and your
            output. We don&apos;t just generate text; we build durable, autonomous workflows that handle the heavy
            lifting of operations.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="premium-heading mt-12 text-xl font-medium sm:text-2xl">Why Nora is different</h2>
          <p className="mt-4 text-sm leading-relaxed text-base-content/65">
            Most AI tools operate like black boxes — you provide an input and hope for a useful output, often
            with little visibility or control. Nora is built for trust and transparency.
          </p>
          <ul className="mt-6 space-y-5 text-sm leading-relaxed text-base-content/65">
            <li>
              <p className="font-medium text-base-content/85">Visible workflow logic</p>
              <p className="mt-1">
                Every step Nora takes — from research and ingestion to classification and output — is visible,
                reviewable, and editable in your dashboard.
              </p>
            </li>
            <li>
              <p className="font-medium text-base-content/85">Adaptive execution</p>
              <p className="mt-1">
                Nora acts as an ops co-founder that observes your habits, adapts to your voice, and executes
                end-to-end tasks like outreach, content creation, and lead qualification.
              </p>
            </li>
            <li>
              <p className="font-medium text-base-content/85">Founder-first infrastructure</p>
              <p className="mt-1">
                We prioritize reliability and accountability, providing a clean audit trail so you remain in
                control of every business decision your agents carry out.
              </p>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <h2 className="premium-heading mt-12 text-xl font-medium sm:text-2xl">Solving founder chaos</h2>
          <p className="mt-4 text-sm leading-relaxed text-base-content/65">
            XenoraAI transforms the chaotic, fragmented nature of early-stage growth into a streamlined,
            automated pipeline. Nora bridges the gap between having a business and scaling an operation,
            allowing solo founders to act with the efficiency of a ten-person team. By automating the repetitive
            loops of communication and research, we make sure your energy goes to what truly matters: building
            your vision.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-12 flex items-center gap-4">
            <a
              href="https://x.com/xenoraai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-base-content/50 transition-colors hover:text-base-content/85"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.4 22H3.3l7.24-8.27L1 2h6.35l4.38 5.78L18.9 2z" />
              </svg>
              @xenoraai
            </a>
            <a
              href="https://www.linkedin.com/company/xenoraai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-base-content/50 transition-colors hover:text-base-content/85"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-xs text-base-content/25 italic">Built with conviction.</p>
        </Reveal>
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
            <Link to="/faq" onClick={smoothTop} className="transition-colors hover:text-base-content/85">FAQ</Link>
            <Link to="/privacy" onClick={smoothTop} className="transition-colors hover:text-base-content/85">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
