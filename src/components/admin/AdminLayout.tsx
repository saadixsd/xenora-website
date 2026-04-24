import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Clock3, Settings as SettingsIcon, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/waitlist', label: 'Waitlist', icon: Clock3 },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-svh bg-base-100 text-base-content">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-base-content/[0.07] bg-base-100/80 backdrop-blur lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-base-content/[0.07] px-5">
          <XenoraLogo decorative className="h-8 w-8" />
          <div>
            <p className="text-sm font-semibold">Xenora</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-base-content/45">Admin console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
                    : 'text-base-content/65 hover:bg-base-content/[0.04] hover:text-base-content'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-base-content/[0.07] p-3">
          <p className="truncate px-2 pb-2 text-xs text-base-content/45">{user?.email}</p>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/55 transition-colors hover:bg-base-content/[0.04] hover:text-base-content"
          >
            <Home className="h-4 w-4" />
            Public site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/55 transition-colors hover:bg-base-content/[0.04] hover:text-base-content"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-base-content/[0.07] bg-base-100/85 px-4 py-3 backdrop-blur lg:hidden">
        <XenoraLogo decorative className="h-7 w-7" />
        <p className="text-sm font-semibold">Xenora Admin</p>
      </header>
      <nav className="sticky top-[52px] z-20 flex gap-1 overflow-x-auto border-b border-base-content/[0.07] bg-base-100/85 px-3 py-2 backdrop-blur lg:hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs ${
                isActive ? 'bg-primary/15 text-primary' : 'text-base-content/65'
              }`
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
