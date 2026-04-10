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

/** Pick the best Canadian-sounding voice available on the device. */
function pickCanadianVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Prefer en-CA female voices for Nora's personality
  const enCA = voices.filter((v) => v.lang.startsWith('en-CA') || v.lang === 'en_CA');
  if (enCA.length) return enCA.find((v) => /female|samantha|nora/i.test(v.name)) ?? enCA[0];

  // Fallback: any English female-sounding voice
  const enAll = voices.filter((v) => v.lang.startsWith('en'));
  const female = enAll.find(
    (v) => /female|samantha|karen|fiona|moira|tessa|victoria|zira|hazel/i.test(v.name),
  );
  if (female) return female;

  // Last resort: first English voice
  return enAll[0] ?? null;
}

/** Short spoken status before the main reply (e.g. “One moment.”). Cancels any prior utterance. */
export function speakNoraStatus(text: string): Promise<void> {
  const plain = stripForSpeech(text).slice(0, 200);
  if (!plain) return Promise.resolve();
  return speakNoraReply(plain);
}

/** Device-local readback via Web Speech API — Canadian English voice (no API keys). */
export function speakNoraReply(text: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve();
  }
  window.speechSynthesis.cancel();
  const plain = stripForSpeech(text).slice(0, 8000);
  if (!plain) return Promise.resolve();

  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(plain);
    u.lang = 'en-CA';
    u.rate = 0.95; // slightly slower for friendly Canadian pace
    u.pitch = 1.05; // slightly higher for warmth

    const voice = pickCanadianVoice();
    if (voice) u.voice = voice;

    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

/** Ensure voices are loaded (some browsers load asynchronously). */
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices(); // trigger load
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices(); // cache
  };
}
