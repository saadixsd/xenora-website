/**
 * Nora's spoken voice.
 * Primary path: ElevenLabs TTS (premium female voice "Sarah") via the `nora-tts` edge function.
 * Fallback: device `speechSynthesis` if the network call fails or the user is offline.
 */
import { supabase } from '@/integrations/supabase/client';

/** localStorage: "1" = read replies aloud; "0" = off */
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

// ---------- ElevenLabs (primary) ----------

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;

function stopCurrentAudio() {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
  } catch {
    /* ignore */
  }
  if (currentObjectUrl) {
    try {
      URL.revokeObjectURL(currentObjectUrl);
    } catch {
      /* ignore */
    }
    currentObjectUrl = null;
  }
  currentAudio = null;
}

async function speakViaElevenLabs(text: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('nora-tts', {
      body: { text },
    });
    if (error) {
      console.warn('[nora-tts] invoke error', error);
      return false;
    }
    // supabase-js returns a Blob for binary responses
    let blob: Blob | null = null;
    if (data instanceof Blob) {
      blob = data;
    } else if (data instanceof ArrayBuffer) {
      blob = new Blob([data], { type: 'audio/mpeg' });
    } else if (data && typeof (data as { arrayBuffer?: unknown }).arrayBuffer === 'function') {
      const ab = await (data as Response).arrayBuffer();
      blob = new Blob([ab], { type: 'audio/mpeg' });
    }
    if (!blob || blob.size === 0) {
      return false;
    }

    stopCurrentAudio();
    const url = URL.createObjectURL(blob);
    currentObjectUrl = url;
    const audio = new Audio(url);
    currentAudio = audio;

    return await new Promise<boolean>((resolve) => {
      audio.onended = () => {
        stopCurrentAudio();
        resolve(true);
      };
      audio.onerror = () => {
        stopCurrentAudio();
        resolve(false);
      };
      audio.play().catch(() => {
        stopCurrentAudio();
        resolve(false);
      });
    });
  } catch (err) {
    console.warn('[nora-tts] failed', err);
    return false;
  }
}

// ---------- Browser speechSynthesis (fallback only) ----------

function soundsRobotic(name: string): boolean {
  const n = name.toLowerCase();
  return /compact|trinidad|bad (news|job)|albert|sinji|zarvox|deranged|hysterical|pipe organ|male/i.test(n);
}

function pickFallbackVoice(): SpeechSynthesisVoice | null {
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
      if (/samantha|ava|allison|aria|jenny|michelle|sonia|zoe|karen|tessa/i.test(n)) score += 50;
      if (/female/i.test(n)) score += 30;
      if (v.lang.toLowerCase().startsWith('en-us')) score += 15;
      if (v.lang.toLowerCase().startsWith('en-gb')) score += 10;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.v ?? en[0] ?? null;
}

function speakViaBrowser(text: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve();
  }
  window.speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickFallbackVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang || 'en-US';
    } else {
      u.lang = 'en-US';
    }
    u.rate = 1.0;
    u.pitch = 1.05;
    u.volume = 1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

// ---------- Public API ----------

/** Short spoken status before the main reply (e.g. "Got it."). Cancels prior speech. */
export async function speakNoraStatus(text: string): Promise<void> {
  const plain = stripForSpeech(text).slice(0, 200);
  if (!plain) return;
  await speakNoraReply(plain);
}

/** Main spoken reply. Tries ElevenLabs first, falls back to device speech. */
export async function speakNoraReply(text: string): Promise<void> {
  const plain = stripForSpeech(text).slice(0, 1800);
  if (!plain) return;
  // Cancel any prior speech (both paths)
  stopCurrentAudio();
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  const ok = await speakViaElevenLabs(plain);
  if (!ok) {
    await speakViaBrowser(plain);
  }
}

// Warm up browser voices for fallback
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
