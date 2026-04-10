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
          'pointer-events-auto flex max-w-full items-center gap-2',
          !sttSupported && 'opacity-60',
        )}
      >
        {/* Pill: green mic disc + Voice label (live assistant) */}
        <button
          type="button"
          onClick={onVoiceButtonClick}
          disabled={!sttSupported}
          className={cn(
            'flex min-h-[48px] items-center gap-2.5 rounded-full border border-white/[0.12] bg-[#141920]/95 py-1 pl-1 pr-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50',
          )}
          aria-label="Open Nora and dictate"
          title={
            sttSupported
              ? 'Live assistant: speak your question; Nora answers aloud (no typing in the box). Cmd+Shift+N'
              : 'Voice needs a supported browser (Chrome, Edge, Safari)'
          }
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--xenora-accent,#00c896)] text-[var(--xenora-accent-foreground,#0a0a0a)] shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
          >
            <Mic className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="pr-0.5 text-[13px] font-medium tracking-tight text-[#9ca3af]">Voice</span>
        </button>

        {/* Ambient wake: waveform in its own circle */}
        <button
          type="button"
          onClick={onToggleAmbient}
          disabled={!sttSupported}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.14] bg-[#141920]/95 text-[#8a9bb0] shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-white/25 hover:text-[#f0f4f8] disabled:pointer-events-none disabled:opacity-50',
            ambientListening &&
              'border-[color:color-mix(in_srgb,var(--xenora-accent,#00c896)_55%,transparent)] bg-[color:color-mix(in_srgb,var(--xenora-accent,#00c896)_12%,transparent)] text-[var(--xenora-accent,#00c896)]',
            ambientActive &&
              'ring-2 ring-[color:color-mix(in_srgb,var(--xenora-accent,#00c896)_45%,transparent)] ring-offset-2 ring-offset-[#07090b]',
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
