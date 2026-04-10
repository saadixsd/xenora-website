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

/** Strip markdown-ish noise and flatten copy so TTS sounds conversational, not like a document. */
export function stripForSpeech(text: string): string {
  return (
    text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Em/en dashes → comma (less stiff than a long pause)
      .replace(/[—–]/g, ',')
      .replace(/\s*,\s*,+/g, ', ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/** True if name suggests a thin / robotic system voice we try to avoid. */
function soundsRobotic(name: string): boolean {
  const n = name.toLowerCase();
  return /compact|trinidad|bad (news|job)|albert|sinji|zarvox|deranged|hysterical|pipe organ/i.test(n);
}

/**
 * Prefer natural, clear English voices (varies by OS: Google US on Chrome, Samantha/Ava on macOS, etc.).
 * Order: neural/enhanced → common “assistant” voices → en-US → any English.
 */
function pickNoraVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  if (!en.length) return null;

  const scored = en
    .map((v) => {
      const n = v.name;
      let score = 0;
      if (soundsRobotic(n)) score -= 80;
      if (/neural|natural|premium|enhanced|wavenet/i.test(n)) score += 60;
      if (/google us english(?!.*male)/i.test(n)) score += 55;
      if (/samantha|karen|victoria|tessa|allison|ava|aria|susan|zoe|flo/i.test(n)) score += 45;
      if (/microsoft (aria|jenny|michelle|zira|sonia)/i.test(n)) score += 45;
      if (/google uk english female|female/i.test(n)) score += 25;
      if (v.lang.toLowerCase().startsWith('en-us')) score += 20;
      if (v.lang.toLowerCase().startsWith('en-gb')) score += 10;
      if (v.default) score += 5;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.v ?? en[0] ?? null;
}

/** Short spoken status before the main reply (e.g. “Got it.”). Cancels any prior utterance. */
export function speakNoraStatus(text: string): Promise<void> {
  const plain = stripForSpeech(text).slice(0, 200);
  if (!plain) return Promise.resolve();
  return speakNoraReply(plain);
}

/** Device-local readback: conversational rate/pitch, best available English voice. */
export function speakNoraReply(text: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve();
  }
  window.speechSynthesis.cancel();
  const plain = stripForSpeech(text).slice(0, 8000);
  if (!plain) return Promise.resolve();

  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(plain);
    const voice = pickNoraVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang || 'en-US';
    } else {
      u.lang = 'en-US';
    }
    // Closer to normal speech: not slow/dramatic, not chipper-robot
    u.rate = 1.02;
    u.pitch = 1;
    u.volume = 1;

    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

/** Ensure voices are loaded (some browsers load asynchronously). */
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
