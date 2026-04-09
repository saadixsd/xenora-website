import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores predictable scroll behavior across route changes and hash navigation.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.querySelector<HTMLElement>('[data-app-scroll-root]')?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (!hash) return;

    const id = hash.slice(1);
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 280);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
