import { Mic, AudioLines } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSpeechRecognitionCtor } from '@/lib/noraVoice';

type NoraVoiceBarProps = {
  ambientListening: boolean;
  onToggleAmbient: () => void;
  onVoiceButtonClick: () => void;
  ambientActive: boolean;
};

export function NoraVoiceBar({
  ambientListening,
  onToggleAmbient,
  onVoiceButtonClick,
  ambientActive,
}: NoraVoiceBarProps) {
  const sttSupported = typeof window !== 'undefined' && !!getSpeechRecognitionCtor();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[81] flex justify-center pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]"
      aria-label="Nora voice controls"
    >
      <div
        className={cn(
          'pointer-events-auto flex max-w-[min(100%,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-1.5 sm:max-w-full sm:gap-2',
          !sttSupported && 'opacity-60',
        )}
      >
        <button
          type="button"
          onClick={onVoiceButtonClick}
          disabled={!sttSupported}
          className={cn(
            'flex min-h-[44px] min-w-0 max-w-full shrink items-center gap-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface-deep)]/95 py-1 pl-1 pr-3 shadow-[var(--dash-shadow)] backdrop-blur-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 sm:min-h-[48px] sm:gap-2.5 sm:pr-4',
          )}
          aria-label="Open Nora and dictate"
          title={
            sttSupported
              ? 'Live assistant: speak your question; Nora answers aloud (no typing in the box). Cmd+Shift+N'
              : 'Voice needs a supported browser (Chrome, Edge, Safari)'
          }
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--dash-accent)] text-[var(--dash-accent-fg)] shadow-[0_0_0_1px_rgba(0,0,0,0.2)] sm:h-10 sm:w-10"
          >
            <Mic className="h-[1.05rem] w-[1.05rem] sm:h-[1.15rem] sm:w-[1.15rem]" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="pr-0.5 text-[12px] font-medium tracking-tight text-[var(--dash-faint)] max-[360px]:hidden sm:text-[13px]">
            Voice
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleAmbient}
          disabled={!sttSupported}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface-deep)]/95 text-[var(--dash-muted)] shadow-[var(--dash-shadow)] backdrop-blur-md transition-colors hover:text-[var(--dash-text)] disabled:pointer-events-none disabled:opacity-50',
            ambientListening &&
              'border-[var(--dash-accent-hover)] bg-[var(--dash-accent-dim)] text-[var(--dash-accent)]',
            ambientActive &&
              'ring-2 ring-[var(--dash-accent-hover)] ring-offset-2 ring-offset-[var(--dash-bg)]',
          )}
          aria-pressed={ambientListening}
          aria-label={ambientListening ? 'Stop listening for Hey Nora and clap' : 'Listen for Hey Nora and double clap'}
          title={
            sttSupported
              ? ambientListening
                ? 'Listening for "Hey Nora" or two claps'
                : 'Enable: say "Hey Nora" or clap twice'
              : 'Not available'
          }
        >
          <AudioLines className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
