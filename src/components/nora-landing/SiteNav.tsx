import { Link, useLocation } from 'react-router-dom';
import { useId } from 'react';
import { ThemeToggle } from '@/components/app/ThemeToggle';

const links = [
  { label: 'Home', to: '/' },
  { label: 'How it Works', to: '/#how-it-works' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Privacy Policy', to: '/privacy' },
];

export const SiteNav = ({ className = '' }: { className?: string }) => {
  const menuId = useId();
  const location = useLocation();

  const renderLink = (link: typeof links[0], extraClass = '') => {
    if (link.to.startsWith('/#')) {
      const hash = link.to.slice(1);
      if (location.pathname === '/') {
        return (
          <a href={hash} className={extraClass}>
            {link.label}
          </a>
        );
      }
      return (
        <Link to={link.to} className={extraClass}>
          {link.label}
        </Link>
      );
    }
    return (
      <Link to={link.to} className={extraClass}>
        {link.label}
      </Link>
    );
  };

  return (
    <nav className={`flex items-center gap-1 sm:gap-2 ${className}`} aria-label="Main navigation">
      <ul className="menu menu-horizontal menu-sm hidden flex-nowrap px-0 md:flex">
        {links.map((link) => (
          <li key={link.to}>
            {renderLink(
              link,
              'rounded-md px-3 py-2 text-sm font-normal text-base-content/65 transition-all duration-300 hover:bg-base-200/60 hover:text-base-content',
            )}
          </li>
        ))}
      </ul>

      <div className="dropdown dropdown-end md:hidden">
        <button
          type="button"
          tabIndex={0}
          className="btn btn-ghost btn-sm h-8 min-h-8 border border-base-content/10 px-2.5 font-normal normal-case text-xs text-base-content/75 sm:px-3 sm:text-sm"
          aria-haspopup="menu"
          aria-controls={menuId}
        >
          Menu
        </button>
        <ul
          id={menuId}
          tabIndex={0}
          className="dropdown-content menu z-[100] mt-2 w-44 rounded-lg border border-base-content/10 bg-base-200 p-2 shadow-lg sm:w-48"
        >
          {links.map((link) => (
            <li key={link.to}>
              {renderLink(link, 'text-sm')}
            </li>
          ))}
        </ul>
      </div>

      <ThemeToggle />
    </nav>
  );
};
