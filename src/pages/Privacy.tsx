import { Link } from 'react-router-dom';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';

const sections = [
  {
    title: 'Information We Collect',
    content: `When you sign up for our waitlist, we collect your email address and a brief response about your focus challenges. When you use Nora Focus, the app collects app usage patterns, focus session data, and break patterns — all of which are processed and stored locally on your device. We do not collect or transmit this behavioral data to our servers.`,
  },
  {
    title: 'Local-First Processing',
    content: `Nora Focus is designed with a local-first architecture. All behavior tracking, pattern analysis, and schedule generation happens entirely on your device. Your focus data never leaves your Mac, iPhone, or Android device. This means we cannot access, read, or share your productivity data — because we never have it.`,
  },
  {
    title: 'How We Use Your Information',
    content: `Waitlist data (email and focus challenge response) is used solely to manage beta access and communicate product updates. We will never sell your information to third parties or use it for advertising. If you connect Spotify, we access only the minimum permissions needed to play and manage focus playlists.`,
  },
  {
    title: 'Third-Party Services',
    content: `Nora Focus integrates with Spotify for playlist functionality. When you connect your Spotify account, we follow Spotify's authorization flow and request only the permissions necessary to play music during focus blocks. No other third-party services have access to your data.`,
  },
  {
    title: 'Data Retention and Deletion',
    content: `Your local focus data is stored on your device and can be deleted at any time through the app settings. Waitlist data is retained until you request removal or until the beta period concludes. To request deletion of your waitlist data, email us at hello@xenoraai.com.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete any personal data we hold about you. You can request a copy of your data, ask us to update incorrect information, or request complete deletion. We respond to all data requests within 30 days. Contact hello@xenoraai.com for any privacy-related requests.`,
  },
  {
    title: 'Security',
    content: `We use industry-standard security practices to protect the limited data we do collect (email addresses and waitlist responses). All data in transit is encrypted via TLS. Local data on your device is protected by your operating system's built-in security features and encryption.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this privacy policy from time to time. When we do, we'll update the "Last updated" date at the top of this page and notify active beta users via email. Continued use of Nora Focus after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: 'Contact',
    content: `If you have questions about this privacy policy or how we handle your data, reach out to us at hello@xenoraai.com. We're based in Montréal, Canada, and are committed to being transparent about our data practices.`,
  },
];

const Privacy = () => {
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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-base-content/45">Last updated: March 2026</p>
        <p className="mt-4 text-sm leading-relaxed text-base-content/55">
          At XenoraAI, we believe your focus data is deeply personal. This policy explains what we collect, 
          how we use it, and why most of your data never leaves your device.
        </p>

        <div className="mt-10 space-y-3">
          {sections.map((section, i) => (
            <div key={i} className="collapse collapse-arrow rounded-lg border border-base-content/[0.06] bg-base-200/20">
              <input type="radio" name="privacy-accordion" />
              <div className="collapse-title text-sm font-medium text-base-content/80">{section.title}</div>
              <div className="collapse-content">
                <p className="text-sm leading-relaxed text-base-content/45">{section.content}</p>
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

export default Privacy;
