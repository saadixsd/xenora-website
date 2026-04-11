import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Twitter, Instagram, Linkedin } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

const PLATFORMS = [
  {
    id: 'gmail',
    label: 'Gmail',
    icon: Mail,
    description: 'Read inbound emails and send approved replies via the Leads Agent.',
    scopes: ['gmail.readonly', 'gmail.send'],
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    icon: Twitter,
    description: 'Analyze post performance and publish approved content via the Content Agent.',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    description: 'Pull engagement data and publish content via the Instagram Graph API.',
    scopes: ['instagram_basic', 'instagram_content_publish'],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    description: 'Analyze professional content performance and publish approved posts.',
    scopes: ['r_liteprofile', 'w_member_social'],
  },
];

export default function Connections() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 font-dm-sans">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-3 sm:mb-4 flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <h1 className="text-lg font-semibold text-foreground sm:text-2xl">Connections</h1>
      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">
        Connect your platforms so agents can read data and take actions on your behalf.
        You always approve before anything sends.
      </p>

      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className="rounded-xl border border-border bg-card p-3.5 sm:p-5 transition-colors hover:border-primary/20"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <platform.icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="text-[13px] sm:text-sm font-medium text-foreground">{platform.label}</h3>
                    <span className={cn('rounded-md px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium bg-muted text-muted-foreground')}>
                      Not connected
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-[12px] text-muted-foreground leading-relaxed">
                    {platform.description}
                  </p>
                  <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1">
                    {platform.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="rounded bg-muted px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono text-muted-foreground"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-primary px-3 py-1.5 text-[11px] sm:text-[12px] font-medium text-primary-foreground opacity-60 min-h-[36px] sm:min-h-0"
                  title="OAuth integration is coming soon"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 sm:mt-6 rounded-lg border border-border bg-muted/30 p-3 text-center text-[11px] sm:text-[12px] text-muted-foreground">
        OAuth integration is coming soon. Tokens will be encrypted and stored securely — never in the browser.
      </p>
    </div>
  );
}
