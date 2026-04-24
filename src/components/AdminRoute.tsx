import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { ROUTES } from '@/config/routes';

/**
 * Guards admin-only routes. Redirects unauthenticated users to /login,
 * and authenticated-but-not-admin users to the home page.
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ message: 'Sign in to access the admin console.', from: location.pathname }}
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
