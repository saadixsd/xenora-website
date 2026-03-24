import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';

const sections = [
  {
    title: 'Local Processing',
    content:
      'Nora Focus is built for local processing. Pattern analysis and planning run on-device. Focus telemetry is not used for cloud model training.',
  },
  {
    title: 'Cloud Training',
    content:
      'No cloud training is performed on your focus behavior data. Any optional remote services are used only for operational product features, not model training on personal activity streams.',
  },
  {
    title: 'EU Supabase',
    content:
      'Waitlist contact data is stored in Supabase infrastructure configured in the EU region. This is limited to operational communications about beta access.',
  },
  {
    title: 'Data We Collect',
    content:
      'For waitlist operations we collect email and minimal metadata required to manage invitations. For app operation, permissioned local signals can include screen-time context, app switching behavior, and focus session outcomes.',
  },
  {
    title: 'How We Use Data',
    content:
      'Data is used for beta access communications, product reliability, and feature operation. We do not sell personal information.',
  },
  {
    title: 'Retention and Deletion',
    content:
      'Waitlist records are retained only as long as needed for beta operations, then removed or anonymized unless required by law. Deletion requests can be sent to xenoraai@gmail.com.',
  },
  {
    title: 'Your Rights',
    content:
      'You may request access, correction, or deletion of the personal information we hold in operational systems. Contact xenoraai@gmail.com for privacy requests.',
  },
  {
    title: 'Security',
    content:
      'We apply administrative and technical safeguards including transport encryption, restricted access controls, and provider security controls appropriate to the sensitivity of the data.',
  },
  {
    title: 'Contact',
    content:
      'Questions about privacy practices can be sent to xenoraai@gmail.com.',
  },
];

const Privacy = () => {
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
        <h1 className="premium-heading text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-base-content/55">Local processing. No cloud training. EU Supabase.</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-content/60">
          Nora Focus is designed to minimize centralized data exposure while keeping operational systems transparent and auditable.
        </p>

        <div className="mt-10 space-y-3">
          {sections.map((section, i) => (
            <div key={section.title} className="collapse collapse-arrow surface-panel">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium text-base-content/85">{section.title}</div>
              <div className="collapse-content">
                <p className="text-sm leading-relaxed text-base-content/60">{section.content}</p>
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

export default Privacy;
