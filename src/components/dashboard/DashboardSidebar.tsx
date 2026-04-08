import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  X,
  List,
  Clock,
  MessageCircle,
  Users,
  Plug,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

const mainNav = [
  { label: 'Dashboard', to: ROUTES.dashboard.root, icon: LayoutDashboard },
  { label: 'Agents', to: ROUTES.dashboard.agents.manage, icon: Users },
  { label: 'Workflow Runs', to: ROUTES.dashboard.runNew, icon: List, matchPrefix: `${ROUTES.dashboard.root}/run` },
  { label: 'Ask Nora', to: ROUTES.dashboard.nora, icon: MessageCircle },
  { label: 'History', to: ROUTES.dashboard.history, icon: Clock },
  { label: 'Connections', to: ROUTES.dashboard.connections, icon: Plug },
  { label: 'Settings', to: ROUTES.dashboard.settings, icon: Settings },
];

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const pathname = location.pathname;

  const isActive = (to: string, matchPrefix?: string) => {
    if (matchPrefix) {
      return pathname === ROUTES.dashboard.runNew || pathname.startsWith(`${matchPrefix}/`);
    }
    if (to === ROUTES.dashboard.root) return pathname === ROUTES.dashboard.root;
    if (to === ROUTES.dashboard.nora) return pathname === ROUTES.dashboard.nora;
    if (to === ROUTES.dashboard.agents.manage) {
      return pathname === to || pathname.startsWith(`${ROUTES.dashboard.root}/agents`);
    }
    return pathname === to || pathname.startsWith(`${to}/`);
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
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <div className="flex h-full flex-col font-dm-sans">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link to={ROUTES.dashboard.root} className="flex flex-col" onClick={onClose}>
          <span className="font-dm-serif text-lg tracking-tight text-foreground">
            Xen<span className="text-primary">ora</span>
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Workspace">
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 sm:py-2 text-[13.5px] transition-colors min-h-[44px] sm:min-h-0',
                  isActive(item.to, (item as { matchPrefix?: string }).matchPrefix)
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

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
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </div>
  );
}
