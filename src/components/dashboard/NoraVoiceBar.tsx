import { Mic, AudioLines } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSpeechRecognitionCtor } from '@/lib/noraVoice';

type NoraVoiceBarProps = {
  ambientListening: boolean;
  onToggleAmbient: () => void;
  onVoiceButtonClick: () => void;
  /** Mic + clap wake active (ambient on and not suspended) */
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[81] flex justify-center px-3 pb-[max(10px,env(safe-area-inset-bottom,0px))] pt-2"
      aria-label="Nora voice controls"
    >
      <div
        className={cn(
          'pointer-events-auto flex max-w-full items-center gap-1 rounded-2xl border border-border bg-card/95 py-1.5 pl-2 pr-1 shadow-lg backdrop-blur-md',
          !sttSupported && 'opacity-80',
        )}
      >
        <button
          type="button"
          onClick={onVoiceButtonClick}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Open Nora and dictate"
          title={
            sttSupported
              ? 'Live assistant: speak your question; Nora answers aloud (no typing in the box). Cmd+Shift+N'
              : 'Voice needs a supported browser (Chrome, Edge, Safari)'
          }
          disabled={!sttSupported}
        >
          <Mic className="h-5 w-5" aria-hidden />
        </button>
        <span className="hidden text-xs font-medium text-foreground sm:inline sm:pr-1">Voice</span>
        <button
          type="button"
          onClick={onToggleAmbient}
          disabled={!sttSupported}
          className={cn(
            'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors',
            ambientListening && 'border-primary/30 bg-primary/10 text-primary',
            ambientActive && 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background',
          )}
          aria-pressed={ambientListening}
          aria-label={ambientListening ? 'Stop listening for Hey Nora and clap' : 'Listen for Hey Nora and double clap'}
          title={
            sttSupported
              ? ambientListening
                ? 'Listening for “Hey Nora” or two claps'
                : 'Enable: say “Hey Nora” or clap twice'
              : 'Not available'
          }
        >
          <AudioLines className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
