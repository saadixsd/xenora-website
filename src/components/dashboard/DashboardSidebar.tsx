import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

const RUN_PREFIX = `${ROUTES.dashboard.root}/run`;

const workspaceNav = [
  { label: 'Overview', to: ROUTES.dashboard.root, icon: LayoutDashboard },
  { label: 'New run', to: ROUTES.dashboard.runNew, icon: List, matchPrefix: RUN_PREFIX },
  { label: 'History', to: ROUTES.dashboard.history, icon: Clock },
];

const noraNav = [
  { label: 'Ask Nora', to: ROUTES.dashboard.nora, icon: MessageCircle },
  { label: 'Agents', to: ROUTES.dashboard.agents.manage, icon: Users },
  { label: 'Connections', to: ROUTES.dashboard.connections, icon: Plug },
  { label: 'Settings', to: ROUTES.dashboard.settings, icon: Settings },
];

function planLabel(plan: string | undefined, status: string | undefined): string {
  if (!plan || plan === 'free') return 'Free';
  if (plan === 'pro' && (status === 'active' || status === 'trialing')) return 'Pro';
  if (plan === 'plus' && (status === 'active' || status === 'trialing')) return 'Plus';
  return 'Free';
}

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const pathname = location.pathname;
  const [planTag, setPlanTag] = useState<string>('Free');

  useEffect(() => {
    if (!user?.id) return;
    void supabase
      .from('billing_subscriptions')
      .select('plan,status')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setPlanTag(planLabel(data?.plan, data?.status));
      });
  }, [user?.id]);

  const isActive = (to: string, matchPrefix?: string) => {
    if (matchPrefix) {
      return (
        pathname === ROUTES.dashboard.runNew ||
        pathname.startsWith(`${matchPrefix}/`)
      );
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

  const linkClass = (active: boolean) =>
    cn(
      'relative flex min-h-[40px] items-center gap-2.5 rounded-md px-[18px] py-2 text-[12.5px] transition-colors sm:min-h-0',
      active
        ? 'bg-gradient-to-r from-[#00c896]/15 to-transparent text-[#f0f4f8] before:absolute before:inset-y-0 before:left-0 before:w-[1.5px] before:rounded-full before:bg-[#00c896]'
        : 'text-[#3f5060] hover:text-[#8a9bb0]',
    );

  return (
    <div className="flex h-full flex-col font-[Inter,system-ui,sans-serif]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
        <Link
          to={ROUTES.dashboard.root}
          className="flex min-w-0 shrink items-center gap-2"
          onClick={onClose}
          aria-label="Dashboard home"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00c896]" aria-hidden />
          <span className="font-syne text-[14px] font-bold tracking-[0.08em] text-[#f0f4f8]">XENORA</span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#8a9bb0] hover:bg-white/[0.04] hover:text-[#f0f4f8] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-0 py-4" aria-label="Workspace">
        <p className="dash-label px-[18px] pb-2">Workspace</p>
        <ul className="space-y-0.5">
          {workspaceNav.map((item) => {
            const active = isActive(item.to, (item as { matchPrefix?: string }).matchPrefix);
            return (
              <li key={item.to}>
                <Link to={item.to} onClick={onClose} className={linkClass(active)}>
                  <item.icon className="h-[13px] w-[13px] shrink-0 opacity-70" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="dash-label mt-6 px-[18px] pb-2">Nora</p>
        <ul className="space-y-0.5">
          {noraNav.map((item) => {
            const active = isActive(item.to, (item as { matchPrefix?: string }).matchPrefix);
            return (
              <li key={item.to}>
                <Link to={item.to} onClick={onClose} className={linkClass(active)}>
                  <item.icon className="h-[13px] w-[13px] shrink-0 opacity-70" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.15] bg-[#141920] font-space-mono text-[10px] font-medium text-[#00c896]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-[#8a9bb0]">
              <span className="text-[#f0f4f8]">{displayName}</span>
              <span className="text-[#3f5060]"> · </span>
              {planTag}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="mt-1 flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#3f5060] transition-colors hover:bg-white/[0.04] hover:text-[#8a9bb0]"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    </div>
  );
}
