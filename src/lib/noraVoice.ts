/** Dispatched when the user should start speech-to-text in the Nora composer (sheet or page). */
export const NORA_VOICE_START_DICTATION = 'xenora:nora-voice-start-dictation';

/** Pause ambient “Hey Nora” / clap (frees the mic for composer dictation). */
export const NORA_VOICE_AMBIENT_PAUSE = 'xenora:nora-voice-ambient-pause';
export const NORA_VOICE_AMBIENT_RESUME = 'xenora:nora-voice-ambient-resume';

export const NORA_VOICE_AMBIENT_KEY = 'xenora-nora-voice-ambient';

export function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & { webkitSpeechRecognition?: new () => SpeechRecognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Rough match for wake phrase (handles minor ASR quirks). */
export function transcriptLooksLikeHeyNora(text: string): boolean {
  const n = text.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();
  if (!n) return false;
  if (/\bhey[, ]+nora\b/.test(n)) return true;
  if (n.includes('hey nora')) return true;
  if (n.includes('okay nora') || n.includes('ok nora')) return true;
  return false;
}

export function dispatchNoraVoiceStartDictation(): void {
  window.dispatchEvent(new CustomEvent(NORA_VOICE_START_DICTATION));
}
