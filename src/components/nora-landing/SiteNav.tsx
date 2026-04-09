import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useId, useState } from 'react';
import { ThemeToggle } from '@/components/app/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { MARKETING_NAV, ROUTES } from '@/config/routes';
import { X, Menu } from 'lucide-react';

type NavItem = (typeof MARKETING_NAV)[number];

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

  const askNoraLoginState = { message: 'Sign in to chat with Nora.' };

  const renderAskNora = (extraClass: string, onClick?: () => void) =>
    user ? (
      <Link
        to={ROUTES.dashboard.nora}
        className={extraClass}
        onClick={() => {
          onClick?.();
          smoothTop();
        }}
      >
        Ask Nora
      </Link>
    ) : (
      <Link
        to={ROUTES.login}
        state={askNoraLoginState}
        className={extraClass}
        onClick={() => {
          onClick?.();
          smoothTop();
        }}
      >
        Ask Nora
      </Link>
    );

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

  const [first, second, ...rest] = MARKETING_NAV;

  return (
    <nav className={`relative flex items-center gap-1 sm:gap-2 ${className}`} aria-label="Main navigation">
      <ul className="hidden flex-nowrap px-0 md:flex md:items-center md:gap-0.5">
        <li key={first.to}>
          {renderLink(first, linkClassDesktop)}
        </li>
        <li key={second.to}>
          {renderLink(second, linkClassDesktop)}
        </li>
        <li key="ask-nora">
          {renderAskNora(linkClassDesktop)}
        </li>
        {rest.map((link) => (
          <li key={link.to}>
            {renderLink(link, linkClassDesktop)}
          </li>
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
          className="absolute left-0 right-0 top-full z-[100] border-b border-base-content/10 bg-base-100/95 backdrop-blur-xl p-4 md:hidden"
          role="menu"
        >
          <ul className="space-y-1">
            <li key={first.to}>{renderLink(first, linkClassMobile, handleNavClick)}</li>
            <li key={second.to}>{renderLink(second, linkClassMobile, handleNavClick)}</li>
            <li key="ask-nora-mobile">{renderAskNora(linkClassMobile, handleNavClick)}</li>
            {rest.map((link) => (
              <li key={link.to}>{renderLink(link, linkClassMobile, handleNavClick)}</li>
            ))}
          </ul>
        </div>
      )}

      {user ? (
        <Link
          to={ROUTES.dashboard.root}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          to={ROUTES.login}
          className="rounded-md border border-base-content/15 bg-base-100/80 px-3 py-1.5 text-xs text-base-content/70 transition-colors hover:border-primary/30 hover:text-base-content sm:text-sm"
        >
          Sign in
        </Link>
      )}
      <ThemeToggle />
    </nav>
  );
};
