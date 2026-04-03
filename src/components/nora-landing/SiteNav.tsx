import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useId, useState } from 'react';
import { ThemeToggle } from '@/components/app/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { X, Menu } from 'lucide-react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'How it Works', to: '/#how-it-works' },
  { label: 'Ask Nora', to: '/try-nora' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
];

export const SiteNav = ({ className = '' }: { className?: string }) => {
  const menuId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const smoothTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleNavClick = () => {
    setMobileOpen(false);
    smoothTop();
  };

  const renderLink = (link: typeof links[0], extraClass = '', onClick?: () => void) => {
    if (link.to.startsWith('/#')) {
      const hash = link.to.slice(1);
      const id = hash.replace('#', '');
      if (location.pathname === '/') {
        return (
          <a
            href={hash}
            className={extraClass}
            onClick={(e) => {
              e.preventDefault();
              onClick?.();
              smoothTop();
              window.setTimeout(() => {
                const target = document.getElementById(id);
                if (!target) return;
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 280);
            }}
          >
            {link.label}
          </a>
        );
      }
      return (
        <button
          type="button"
          className={extraClass}
          onClick={() => {
            onClick?.();
            smoothTop();
            window.setTimeout(() => navigate(link.to), 220);
          }}
        >
          {link.label}
        </button>
      );
    }
    return (
      <Link to={link.to} className={extraClass} onClick={() => { onClick?.(); smoothTop(); }}>
        {link.label}
      </Link>
    );
  };

  return (
    <nav className={`relative flex items-center gap-1 sm:gap-2 ${className}`} aria-label="Main navigation">
      <ul className="hidden flex-nowrap px-0 md:flex md:items-center md:gap-0.5">
        {links.map((link) => (
          <li key={link.to}>
            {renderLink(
              link,
              'inline-flex min-h-[44px] items-center rounded-md px-3 py-3 text-sm font-normal text-base-content/65 transition-all duration-300 hover:bg-base-200/60 hover:text-base-content',
            )}
          </li>
        ))}
      </ul>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-base-content/10 text-base-content/75 md:hidden"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id={menuId}
          className="absolute left-0 right-0 top-full z-[100] border-b border-base-content/10 bg-base-100/95 backdrop-blur-xl p-4 md:hidden"
        >
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                {renderLink(link, 'block rounded-lg px-3 py-2.5 text-sm text-base-content/70 hover:bg-base-200/60 hover:text-base-content', handleNavClick)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {user ? (
        <Link
          to="/dashboard"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          to="/login"
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          Sign In
        </Link>
      )}
      <ThemeToggle />
    </nav>
  );
};
