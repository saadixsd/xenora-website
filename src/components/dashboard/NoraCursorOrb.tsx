import { useEffect, useState, useRef } from 'react';
import { NORA_VOICE_UI_PHASE, type NoraVoiceUiPhase } from '@/lib/noraVoice';
import { cn } from '@/lib/utils';

/**
 * A glowing orb that follows the mouse cursor when voice listening is active.
 * Gives the user a visual cue that Nora is "looking" at what they're pointing at.
 */
export function NoraCursorOrb() {
  const [phase, setPhase] = useState<NoraVoiceUiPhase>('idle');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPhase = (e: Event) => {
      const p = (e as CustomEvent<{ phase?: NoraVoiceUiPhase }>).detail?.phase;
      if (p === 'idle' || p === 'listening' || p === 'thinking' || p === 'speaking') setPhase(p);
    };
    window.addEventListener(NORA_VOICE_UI_PHASE, onPhase);
    return () => window.removeEventListener(NORA_VOICE_UI_PHASE, onPhase);
  }, []);

  // Track mouse
  useEffect(() => {
    if (phase === 'idle') return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Smooth follow with lerp
    const animate = () => {
      const t = 0.15;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * t;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * t;
      setPos({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    // Initialize to current mouse pos
    currentRef.current = { ...targetRef.current };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  if (phase === 'idle') return null;

  const colors: Record<Exclude<NoraVoiceUiPhase, 'idle'>, string> = {
    listening: 'bg-primary shadow-primary/50',
    thinking: 'bg-amber-500 shadow-amber-500/50',
    speaking: 'bg-emerald-500 shadow-emerald-500/50',
  };

  return (
    <div
      className="pointer-events-none fixed z-[200]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer glow ring */}
      <div
        className={cn(
          'absolute inset-0 rounded-full opacity-30 blur-xl',
          phase === 'listening' && 'bg-primary animate-pulse',
          phase === 'thinking' && 'bg-amber-500 animate-pulse',
          phase === 'speaking' && 'bg-emerald-500 animate-pulse',
        )}
        style={{ width: 80, height: 80, marginLeft: -40, marginTop: -40 }}
      />

      {/* Inner orb */}
      <div
        className={cn(
          'relative flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-colors duration-300',
          colors[phase],
          phase === 'listening' && 'animate-pulse [animation-duration:1.5s]',
        )}
        style={{ marginLeft: -16, marginTop: -16 }}
      >
        {/* Ping ring for listening */}
        {phase === 'listening' && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:2s]" />
        )}

        {/* Dot */}
        <span className="relative h-2 w-2 rounded-full bg-white/90" />
      </div>

      {/* Label */}
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border/50 bg-background/90 px-2.5 py-1 text-[10px] font-medium text-foreground/80 shadow-md backdrop-blur-sm"
        style={{ top: 24 }}
      >
        {phase === 'listening' ? 'Listening…' : phase === 'thinking' ? 'Thinking…' : 'Speaking…'}
      </div>
    </div>
  );
}
