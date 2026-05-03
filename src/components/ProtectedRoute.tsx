import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

type ProtectedRouteProps = {
  children: React.ReactNode;
  /** Shown via login page when redirecting unauthenticated users */
  loginMessage?: string;
};

export function ProtectedRoute({ children, loginMessage = 'Sign in to access Nora.' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ message: loginMessage, from: location.pathname }} />;
  }

  return <>{children}</>;
}
