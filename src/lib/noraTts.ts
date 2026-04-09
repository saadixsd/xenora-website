/**
 * Browser readback uses `speechSynthesis` (local to the device, no Xenora API key).
 * Tauri + macOS later: swap `speakNoraReply` for `invoke('nora_speak', { text })` backed by AVSpeechSynthesizer.
 */
/** localStorage: "1" = read replies aloud (browser speechSynthesis); "0" = off */
export const NORA_VOICE_TTS_KEY = 'xenora-nora-voice-tts';

export function isNoraVoiceTtsEnabled(): boolean {
  try {
    const v = localStorage.getItem(NORA_VOICE_TTS_KEY);
    if (v === null) return true;
    return v === '1';
  } catch {
    return true;
  }
}

/** Strip markdown-ish noise for calmer TTS (web SpeechSynthesis; Tauri can replace with native AVSpeech later). */
export function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Device-local readback via Web Speech API (no API keys). */
export function speakNoraReply(text: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve();
  }
  window.speechSynthesis.cancel();
  const plain = stripForSpeech(text).slice(0, 8000);
  if (!plain) return Promise.resolve();

  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(plain);
    u.rate = 1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
