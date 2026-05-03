import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useId, useState } from 'react';
import { MARKETING_NAV, ROUTES } from '@/config/routes';
import { X, Menu } from 'lucide-react';

type NavItem = (typeof MARKETING_NAV)[number];

export const SiteNav = ({ className = '' }: { className?: string }) => {
  const menuId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const handleNavClick = () => {
    setMobileOpen(false);
    smoothTop();
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderLink = (link: NavItem, extraClass = '', onClick?: () => void) => {
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
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            window.setTimeout(() => navigate(`${ROUTES.home}${hash}`), 220);
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

  const linkClassDesktop =
    'inline-flex min-h-[44px] items-center rounded-md px-3 py-3 text-sm font-normal text-base-content/65 transition-all duration-500 hover:bg-base-200/50 hover:text-base-content';
  const linkClassMobile =
    'block rounded-lg px-3 py-2.5 text-sm text-base-content/70 hover:bg-base-200/60 hover:text-base-content';

  const handleJoinWaitlist = () => {
    if (location.pathname === '/') {
      scrollToWaitlist();
    } else {
      navigate(ROUTES.home);
      window.setTimeout(scrollToWaitlist, 280);
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className={`relative flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-1 gap-y-2 sm:flex-nowrap sm:gap-2 ${className}`}
      aria-label="Main navigation"
    >
      <ul className="hidden flex-nowrap px-0 md:flex md:items-center md:gap-0.5">
        {MARKETING_NAV.map((link) => (
          <li key={link.to}>{renderLink(link, linkClassDesktop)}</li>
        ))}
      </ul>

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

      {mobileOpen && (
        <div
          id={menuId}
          className="absolute left-0 right-0 top-full z-[100] border-b border-border bg-background p-4 md:hidden"
          role="menu"
        >
          <ul className="space-y-1">
            {MARKETING_NAV.map((link) => (
              <li key={link.to}>{renderLink(link, linkClassMobile, handleNavClick)}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={handleJoinWaitlist}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-sm"
      >
        Join Waitlist
      </button>
    </nav>
  );
};
