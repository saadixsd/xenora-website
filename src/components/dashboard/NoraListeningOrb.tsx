import { useEffect, useState } from 'react';
import { NORA_VOICE_UI_PHASE, type NoraVoiceUiPhase } from '@/lib/noraVoice';
import { cn } from '@/lib/utils';

const LABELS: Record<Exclude<NoraVoiceUiPhase, 'idle'>, string> = {
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

/**
 * Minimal floating state for voice (Web Speech today; Tauri can drive the same events from native STT/TTS).
 */
export function NoraListeningOrb() {
  const [phase, setPhase] = useState<NoraVoiceUiPhase>('idle');

  useEffect(() => {
    const onPhase = (e: Event) => {
      const p = (e as CustomEvent<{ phase?: NoraVoiceUiPhase }>).detail?.phase;
      if (p === 'idle' || p === 'listening' || p === 'thinking' || p === 'speaking') setPhase(p);
    };
    window.addEventListener(NORA_VOICE_UI_PHASE, onPhase);
    return () => window.removeEventListener(NORA_VOICE_UI_PHASE, onPhase);
  }, []);

  if (phase === 'idle') return null;

  const label = LABELS[phase];

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-[max(5.5rem,env(safe-area-inset-top,0px))] z-[96] -translate-x-1/2"
      role="status"
      aria-live="polite"
      aria-label={`Nora voice: ${label}`}
    >
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-full border border-primary/25 bg-[#0A0A0F]/92 px-3.5 py-2 shadow-lg backdrop-blur-md',
          phase === 'listening' && 'border-primary/40',
        )}
      >
        <span
          className={cn(
            'relative flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary/90',
            phase === 'listening' && 'animate-pulse',
            phase === 'thinking' && 'opacity-80',
            phase === 'speaking' && 'opacity-100',
          )}
          aria-hidden
        >
          {phase === 'listening' ? (
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 [animation-duration:1.8s]" />
          ) : null}
        </span>
        <span className="text-[11px] font-medium tracking-wide text-primary/95">{label}</span>
      </div>
    </div>
  );
}
