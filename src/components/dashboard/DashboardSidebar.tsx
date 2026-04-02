import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, X } from 'lucide-react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'History', to: '/dashboard/history', icon: History },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <XenoraLogo decorative className="h-8 w-8" />
          <span className="text-base font-semibold text-foreground">Nora</span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive(item.to)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {(user?.email?.[0] ?? 'U').toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-foreground">
              {user?.user_metadata?.display_name || user?.email?.split('@')[0]}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
