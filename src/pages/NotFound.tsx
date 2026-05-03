import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn('[404]', location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Error 404</p>
        <h1 className="mt-2 font-syne text-3xl font-semibold text-foreground sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          That URL doesn&apos;t match anything on XenoraAI. Check the address or head back to a known page.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to={ROUTES.home}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Home
        </Link>
        {user ? (
          <Link
            to={ROUTES.dashboard.root}
            className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to={ROUTES.login}
            className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
