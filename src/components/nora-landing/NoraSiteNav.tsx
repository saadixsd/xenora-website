import { useId } from 'react';
import { NEURAL_NODES } from './neuralNavData';

/** Short labels for the top bar — scannable at a glance. */
const NAV_LABEL: Record<(typeof NEURAL_NODES)[number]['id'], string> = {
  platform: 'Platform',
  how: 'How it works',
  pricing: 'Pricing',
  docs: 'Docs',
  enterprise: 'Enterprise',
  start: 'Get started',
};

type Props = {
  className?: string;
};

export const NoraSiteNav = ({ className = '' }: Props) => {
  const menuId = useId();

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Page sections">
      {/* Desktop — plain links, no gimmicks */}
      <ul className="menu menu-horizontal menu-sm hidden flex-nowrap px-0 md:flex">
        {NEURAL_NODES.map((n) => (
          <li key={n.id}>
            <a
              href={`#${n.sectionId}`}
              className="rounded-lg px-3 py-2 font-normal text-base-content/75 hover:bg-base-200 hover:text-base-content"
            >
              {NAV_LABEL[n.id]}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile — compact menu */}
      <div className="dropdown dropdown-end md:hidden">
        <button
          type="button"
          tabIndex={0}
          className="btn btn-ghost btn-sm border border-base-content/10 font-normal normal-case text-base-content/85"
          aria-expanded="false"
          aria-haspopup="menu"
          aria-controls={menuId}
        >
          Menu
        </button>
        <ul
          id={menuId}
          tabIndex={0}
          className="dropdown-content menu z-[100] mt-2 w-56 rounded-box border border-base-content/10 bg-base-200/95 p-2 shadow-lg backdrop-blur-md"
        >
          {NEURAL_NODES.map((n) => (
            <li key={n.id}>
              <a href={`#${n.sectionId}`} className="text-sm font-normal">
                {NAV_LABEL[n.id]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
