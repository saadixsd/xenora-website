import { cn } from '@/lib/utils';
import { MessageSquare, ExternalLink } from 'lucide-react';
import type { ScoredCandidate } from '@/lib/talentgraph/talentgraph';

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 85
      ? 'hsl(var(--primary))'
      : score >= 70
        ? 'hsl(142 71% 45%)'
        : score >= 55
          ? 'hsl(38 92% 50%)'
          : 'hsl(var(--muted-foreground))';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

function SubScore({ label, value }: { label: string; value?: number }) {
  const v = value ?? 0;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div className="h-1.5 w-full rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary/70 transition-all duration-500"
          style={{ width: `${Math.min(100, v)}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{v}</span>
    </div>
  );
}

export function CandidateCard({
  candidate,
  onAskNora,
}: {
  candidate: ScoredCandidate;
  onAskNora?: (login: string) => void;
}) {
  const c = candidate;
  const avatarUrl = c.user.avatar_url;
  const score = c.score ?? 0;

  return (
    <article className="surface-panel p-5 transition-shadow hover:shadow-lg">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={c.user.login}
              className="h-12 w-12 rounded-full border border-border object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-lg font-semibold text-muted-foreground">
              {c.user.login[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {c.user.name || c.user.login}
              </p>
              <p className="text-xs text-muted-foreground">
                @{c.user.login}
                {c.user.location && (
                  <span className="ml-1.5 text-muted-foreground/60">· {c.user.location}</span>
                )}
              </p>
            </div>
            <ScoreRing score={score} />
          </div>

          {c.user.bio && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {c.user.bio}
            </p>
          )}

          {/* Language pills */}
          {c.languages && c.languages.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.languages.slice(0, 5).map((lang) => (
                <span
                  key={lang}
                  className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}

          {/* Sub-scores */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            <SubScore label="Skills" value={c.skillsScore} />
            <SubScore label="Output" value={c.outputScore} />
            <SubScore label="Vibe" value={c.vibeScore} />
          </div>

          {c.whyThisOne && (
            <p className="mt-3 text-xs italic text-muted-foreground">"{c.whyThisOne}"</p>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              href={`https://github.com/${c.user.login}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-3 w-3" />
              GitHub
            </a>
            {onAskNora && (
              <button
                type="button"
                onClick={() => onAskNora(c.user.login)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <MessageSquare className="h-3 w-3" />
                Ask Nora
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
