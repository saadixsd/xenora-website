import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { Menu, MessageCircle } from 'lucide-react';
import { NoraChatPanel } from './NoraChatPanel';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noraOpen, setNoraOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] min-h-0 w-full max-w-[100vw] overflow-hidden bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] shrink-0 transform border-r border-border bg-card/60 backdrop-blur-xl transition-transform duration-200 lg:relative lg:z-auto lg:max-w-none lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex min-h-14 shrink-0 items-center border-b border-border px-4 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-dm-serif text-sm font-medium tracking-tight text-foreground">
            No<span className="text-primary">ra</span>
          </span>
        </header>

        <main className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
          <Outlet />
        </main>
      </div>

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
