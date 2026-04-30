import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Twitter, Instagram, Linkedin, Clock } from 'lucide-react';
import { ROUTES } from '@/config/routes';

const PLATFORMS = [
  { id: 'gmail', label: 'Gmail', icon: Mail, description: 'Read inbound emails and send approved replies via the Leads Agent.' },
  { id: 'x', label: 'X (Twitter)', icon: Twitter, description: 'Analyze post performance and publish approved content via the Content Agent.' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, description: 'Pull engagement data and publish content via the Instagram Graph API.' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, description: 'Analyze professional content performance and publish approved posts.' },
];

export default function Connections() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-3 sm:mb-4 flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-foreground sm:text-2xl">Connections</h1>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Clock className="h-3 w-3" />
          Coming soon
        </span>
      </div>
      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">
        Direct platform connections are in development. Soon you'll be able to link the accounts below
        so agents can read data and act on your behalf — with manual approval before anything sends.
      </p>

      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className="rounded-xl border border-border bg-card p-3.5 sm:p-5 opacity-80"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <platform.icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="text-[13px] sm:text-sm font-medium text-foreground">{platform.label}</h3>
                    <span className="rounded-md bg-muted px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-muted-foreground">
                      Coming soon
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-[12px] text-muted-foreground leading-relaxed">
                    {platform.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] sm:text-[12px] font-medium text-muted-foreground min-h-[36px] sm:min-h-0 cursor-not-allowed"
                >
                  Coming soon
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 sm:mt-6 rounded-lg border border-border bg-muted/30 p-3 text-center text-[11px] sm:text-[12px] text-muted-foreground">
        We'll notify you here when each connection goes live. Tokens will be encrypted at rest and never sent to the browser.
      </p>
    </div>
  );
}
