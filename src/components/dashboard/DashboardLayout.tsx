import { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { Menu, MessageCircle } from 'lucide-react';
import { NoraChatPanel } from './NoraChatPanel';
import { NoraVoiceBar } from './NoraVoiceBar';
import { useNoraVoiceWake } from '@/hooks/useNoraVoiceWake';
import {
  NORA_VOICE_AMBIENT_KEY,
  NORA_VOICE_AMBIENT_PAUSE,
  NORA_VOICE_AMBIENT_RESUME,
  dispatchNoraVoiceStartDictation,
} from '@/lib/noraVoice';
import { NoraListeningOrb } from './NoraListeningOrb';
import { ROUTES } from '@/config/routes';

export function DashboardLayout() {
  const location = useLocation();
  const onDedicatedNoraPage = location.pathname === ROUTES.dashboard.nora;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noraOpen, setNoraOpen] = useState(false);
  const [ambientListening, setAmbientListening] = useState(() => {
    try {
      return localStorage.getItem(NORA_VOICE_AMBIENT_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(NORA_VOICE_AMBIENT_KEY, ambientListening ? '1' : '0');
    } catch {
      /* private mode */
    }
  }, [ambientListening]);

  const openNoraAndDictate = useCallback(() => {
    window.dispatchEvent(new CustomEvent(NORA_VOICE_AMBIENT_PAUSE));
    if (!onDedicatedNoraPage) setNoraOpen(true);
    window.setTimeout(() => dispatchNoraVoiceStartDictation({}), onDedicatedNoraPage ? 120 : 420);
  }, [onDedicatedNoraPage]);

  /** Full assistant: dictate, send via Claude proxy, read reply with device TTS (no auto-publish). */
  const openNoraVoiceAssistant = useCallback(() => {
    window.dispatchEvent(new CustomEvent(NORA_VOICE_AMBIENT_PAUSE));
    if (!onDedicatedNoraPage) setNoraOpen(true);
    window.setTimeout(
      () => dispatchNoraVoiceStartDictation({ assistantMode: true }),
      onDedicatedNoraPage ? 120 : 420,
    );
  }, [onDedicatedNoraPage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey) return;
      if (e.key !== 'n' && e.key !== 'N') return;
      const el = e.target as HTMLElement | null;
      if (el?.closest('input, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      openNoraVoiceAssistant();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openNoraVoiceAssistant]);

  const prevNoraOpen = useRef(noraOpen);
  useEffect(() => {
    if (prevNoraOpen.current && !noraOpen) {
      window.dispatchEvent(new CustomEvent(NORA_VOICE_AMBIENT_RESUME));
    }
    prevNoraOpen.current = noraOpen;
  }, [noraOpen]);

  useNoraVoiceWake({
    enabled: ambientListening,
    suspend: noraOpen,
    onActivated: openNoraAndDictate,
  });

  return (
    <div className="flex h-[100dvh] min-h-0 w-full max-w-[100vw] overflow-hidden bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] sm:max-w-[85vw] shrink-0 transform border-r border-border bg-card/60 backdrop-blur-xl transition-transform duration-200 lg:relative lg:z-auto lg:max-w-none lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="grid min-h-14 shrink-0 grid-cols-[44px_1fr_44px] items-center border-b border-border px-2 py-2 lg:hidden" aria-label="Dashboard">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 justify-center px-1" aria-hidden>
            <XenoraLogo decorative className="h-7 w-auto max-h-8 max-w-[min(140px,calc(100vw-7rem))]" />
          </div>
          <div aria-hidden className="h-11 w-11 shrink-0" />
        </header>

        <main
          data-app-scroll-root
          className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain pb-[env(safe-area-inset-bottom,0px)]"
        >
          <Outlet />
        </main>
      </div>

      <NoraListeningOrb />

      <NoraVoiceBar
        ambientListening={ambientListening}
        onToggleAmbient={() => setAmbientListening((v) => !v)}
        onVoiceButtonClick={openNoraAndDictate}
        ambientActive={ambientListening && !noraOpen}
      />

      <button
        type="button"
        onClick={() => setNoraOpen(true)}
        className="fixed z-[85] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background max-[380px]:bottom-4 max-[380px]:right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] lg:bottom-[max(2rem,env(safe-area-inset-bottom,0px))] lg:right-[max(2rem,env(safe-area-inset-right,0px))]"
        aria-label="Ask Nora"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {noraOpen && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/50"
            aria-hidden
            onClick={() => setNoraOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-[95] flex w-full min-w-0 max-w-[min(28rem,100vw)] max-h-[100dvh] flex-col border-l border-border bg-background shadow-2xl">
            <NoraChatPanel variant="sheet" onClose={() => setNoraOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
