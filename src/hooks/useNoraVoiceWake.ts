import { useEffect, useRef, useCallback, useState } from 'react';
import {
  getSpeechRecognitionCtor,
  transcriptLooksLikeHeyNora,
  NORA_VOICE_AMBIENT_PAUSE,
  NORA_VOICE_AMBIENT_RESUME,
} from '@/lib/noraVoice';

const CLAP_RMS = 0.14;
const EDGE_DEBOUNCE_MS = 90;
const DOUBLE_MIN_MS = 200;
const DOUBLE_MAX_MS = 720;
const WAKE_COOLDOWN_MS = 2200;

type Options = {
  /** Listen for "Hey Nora" + double clap */
  enabled: boolean;
  /** Pause while Nora sheet uses the mic / STT */
  suspend: boolean;
  onActivated: () => void;
};

/**
 * Ambient wake: Web Speech API continuous recognition + simple RMS double-clap on the same mic stream.
 * Browser-only; works best in Chromium / Safari (HTTPS). Stops while `suspend` is true.
 */
export function useNoraVoiceWake({ enabled, suspend, onActivated }: Options) {
  const [micPaused, setMicPaused] = useState(false);
  const onActivatedRef = useRef(onActivated);
  onActivatedRef.current = onActivated;
  const enabledRef = useRef(enabled);
  const suspendRef = useRef(suspend);
  const micPausedRef = useRef(false);
  enabledRef.current = enabled;
  suspendRef.current = suspend;
  micPausedRef.current = micPaused;
  const cooldownUntilRef = useRef(0);

  useEffect(() => {
    const pause = () => setMicPaused(true);
    const resume = () => setMicPaused(false);
    window.addEventListener(NORA_VOICE_AMBIENT_PAUSE, pause);
    window.addEventListener(NORA_VOICE_AMBIENT_RESUME, resume);
    return () => {
      window.removeEventListener(NORA_VOICE_AMBIENT_PAUSE, pause);
      window.removeEventListener(NORA_VOICE_AMBIENT_RESUME, resume);
    };
  }, []);

  const fire = useCallback(() => {
    const now = Date.now();
    if (now < cooldownUntilRef.current) return;
    cooldownUntilRef.current = now + WAKE_COOLDOWN_MS;
    onActivatedRef.current();
  }, []);

  useEffect(() => {
    const suspended = suspend || micPaused;
    if (!enabled || suspended) return;

    const Ctor = getSpeechRecognitionCtor();
    let recognition: SpeechRecognition | null = null;
    let cancelled = false;
    let rafId: number | null = null;
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;

    const startRecognition = () => {
      if (!Ctor || cancelled) return;
      try {
        recognition = new Ctor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let chunk = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            chunk += event.results[i][0].transcript;
          }
          if (transcriptLooksLikeHeyNora(chunk)) {
            fire();
          }
        };
        recognition.onerror = () => {
          /* network/no-speech etc. — onend will try to restart */
        };
        recognition.onend = () => {
          if (!cancelled && enabledRef.current && !suspendRef.current && !micPausedRef.current) {
            try {
              recognition?.start();
            } catch {
              /* already started */
            }
          }
        };
        recognition.start();
      } catch {
        recognition = null;
      }
    };

    startRecognition();

    const runClapLoop = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(s);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const buf = new Uint8Array(analyser.fftSize);
        let wasLoud = false;
        let lastEdgeAt = 0;
        let lastClapAt = 0;

        let logThrottle = 0;
        const tick = () => {
          if (cancelled) return;
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i]! - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / buf.length);
          const loud = rms > CLAP_RMS;
          const now = performance.now();

          // Periodic RMS log so we can verify mic is working
          if (++logThrottle % 120 === 0 && rms > 0.02) {
            console.debug('[NoraClapDetect] rms=', rms.toFixed(3), 'threshold=', CLAP_RMS);
          }

          if (loud && !wasLoud) {
            if (now - lastEdgeAt >= EDGE_DEBOUNCE_MS) {
              lastEdgeAt = now;
              const delta = now - lastClapAt;
              console.debug('[NoraClapDetect] clap edge detected, delta=', delta.toFixed(0), 'ms');
              if (lastClapAt > 0 && delta > DOUBLE_MIN_MS && delta < DOUBLE_MAX_MS) {
                console.info('[NoraClapDetect] Double clap — activating Nora.');
                fire();
                lastClapAt = 0;
              } else {
                lastClapAt = now;
              }
            }
          }
          wasLoud = loud;
          rafId = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        /* mic denied or no device — wake phrase may still work where SR doesn't need our stream */
      }
    };

    void runClapLoop();

    return () => {
      cancelled = true;
      if (rafId != null) cancelAnimationFrame(rafId);
      try {
        recognition?.stop();
      } catch {
        /* */
      }
      recognition = null;
      stream?.getTracks().forEach((t) => t.stop());
      stream = null;
      void audioCtx?.close();
      audioCtx = null;
    };
  }, [enabled, suspend, micPaused, fire]);
}
