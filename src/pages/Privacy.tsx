import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';

const sections = [
  {
    title: 'Scope and Canadian Privacy Framework',
    content:
      'This policy applies to XenoraAI products and waitlist communications. We align our practices with applicable Canadian private-sector privacy requirements, including PIPEDA, and with Quebec Law 25 expectations for transparency, governance, and individual rights where applicable.',
  },
  {
    title: 'Information We Collect',
    content:
      'When you sign up for our waitlist, we collect your email address and an optional brief response about your focus challenges. When you use Nora Focus, usage patterns and focus-session signals are processed locally on your device. We do not collect or transmit this behavioral focus data to our servers unless we explicitly request your consent for a specific feature in the future.',
  },
  {
    title: 'Local-First Processing',
    content:
      'Nora Focus is designed with a local-first architecture. Behavior tracking, pattern analysis, and schedule generation happen on your device. In normal operation, your focus history does not leave your Mac, iPhone, or Android device, which reduces collection risk and limits centralized profiling.',
  },
  {
    title: 'Purpose and Legal Basis (Consent)',
    content:
      'We use waitlist data to manage beta access, provide onboarding updates, and send product communications you requested. We rely on your consent for these uses, and you can withdraw consent at any time (for example, by unsubscribing or emailing us). We do not sell personal information and do not use waitlist data for third-party advertising.',
  },
  {
    title: 'Third-Party Services',
    content:
      "Nora Focus integrates with Spotify for playlist functionality. When you connect Spotify, we use Spotify's authorization flow and request only permissions needed for focus-playback features. Third-party providers process data under their own terms and privacy notices; we recommend reviewing those notices directly.",
  },
  {
    title: 'International and Cross-Border Processing',
    content:
      'Our service providers may process limited waitlist information outside your province or outside Canada (for example, cloud email or database infrastructure). When this occurs, information may be subject to the laws of those jurisdictions. We use contractual and security controls to protect personal information in transit and at rest.',
  },
  {
    title: 'Data Retention and Deletion',
    content:
      'Local focus data remains on your device and can be deleted through app settings. Waitlist data is retained only as long as needed for waitlist and beta operations, then securely deleted or anonymized unless a longer period is required by law. You can request deletion of waitlist data at any time by emailing xenoraai@gmail.com.',
  },
  {
    title: 'Your Privacy Rights',
    content:
      'Subject to applicable law, you may request access to personal information we hold about you, request correction of inaccurate information, withdraw consent for certain uses, and request deletion where permitted. We aim to respond within 30 days. To submit a request, contact xenoraai@gmail.com.',
  },
  {
    title: 'Automated Processing and AI',
    content:
      'Nora Focus uses automated methods to generate productivity suggestions from local on-device signals. We do not currently use solely automated processing to make legal or similarly significant decisions about eligibility, employment, credit, or access to essential services. If that changes, we will provide additional notice and rights information.',
  },
  {
    title: 'Security',
    content:
      'We use administrative, technical, and organizational safeguards appropriate to data sensitivity. Measures include least-privilege access controls, encrypted transport (TLS), provider security controls, and operational procedures for incident response. Local data protection also depends on your device security settings (such as passcode and disk encryption).',
  },
  {
    title: 'Privacy Officer and Complaints',
    content:
      'Our privacy contact for requests, questions, and complaints is xenoraai@gmail.com. If you believe your concern was not resolved, you may contact the Office of the Privacy Commissioner of Canada (priv.gc.ca). Quebec residents may also contact the Commission d\'acces a l\'information du Quebec (cai.gouv.qc.ca).',
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this privacy policy from time to time. When we do, we\'ll update the "Last updated" date at the top of this page and notify active beta users via email. Continued use of Nora Focus after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact',
    content:
      'If you have questions about this privacy policy or how we handle your data, reach out to us at xenoraai@gmail.com. We\'re based in Montréal, Canada, and are committed to being transparent about our data practices.',
  },
];

const Privacy = () => {
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
          <h1 className="premium-heading text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 text-sm text-base-content/55">Last updated: March 2026</p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-base-content/60">
            At XenoraAI, we treat focus data as personal. This page explains what we collect, how we use it, and why
            most Nora Focus data stays on your device.
          </p>
        </Reveal>

        <div className="mt-10 space-y-3">
          {sections.map((section, i) => (
            <Reveal key={section.title} delay={i * 0.03}>
              <div className="collapse collapse-arrow surface-panel">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium text-base-content/85">{section.title}</div>
                <div className="collapse-content">
                  <p className="text-sm leading-relaxed text-base-content/60">{section.content}</p>
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

export default Privacy;
