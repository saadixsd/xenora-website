import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, X, List, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const mainNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Ask Nora', to: '/dashboard/nora', icon: MessageCircle },
  { label: 'Workflow Runs', to: '/dashboard/run/new', icon: List },
  { label: 'History', to: '/dashboard/history', icon: Clock },
];

const agentNav = [
  { label: 'Content Agent', dot: 'bg-emerald-500', to: '/dashboard' },
  { label: 'Lead Agent (beta)', dot: 'bg-amber-500', to: '/dashboard' },
  { label: 'Research Agent (coming soon)', dot: 'bg-border', to: '/dashboard' },
];

const accountNav = [
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/dashboard/nora') return location.pathname === '/dashboard/nora';
    return location.pathname.startsWith(path);
  };

  const initials = (user?.user_metadata?.display_name || user?.email || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
    onClose?.();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col font-dm-sans">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link to="/dashboard" className="flex flex-col" onClick={onClose}>
          <span className="font-dm-serif text-lg tracking-tight text-foreground">
            No<span className="text-primary">ra</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.8px] text-muted-foreground">Workspace</span>
        </Link>
        {onClose && (
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground lg:hidden">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.8px] text-muted-foreground">Main</p>
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors',
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

        <p className="mt-4 px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.8px] text-muted-foreground">Agents</p>
        <ul className="space-y-0.5">
          {agentNav.map((a) => (
            <li key={a.label}>
              <button
                type="button"
                onClick={() => { navigate(a.to); onClose?.(); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className={cn('h-[7px] w-[7px] rounded-full', a.dot)} />
                {a.label}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-4 px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.8px] text-muted-foreground">Account</p>
        <ul className="space-y-0.5">
          {accountNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors',
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
      <div className="border-t border-border p-2">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-medium text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">{displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground">Signed in</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="mt-0.5 flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
