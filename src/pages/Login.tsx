import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/config/routes';

type LoginLocationState = { message?: string; from?: string };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const bannerMessage = (location.state as LoginLocationState | null)?.message;
  const fromCandidate = (location.state as LoginLocationState | null)?.from;
  const redirectTo =
    typeof fromCandidate === 'string' && fromCandidate.startsWith('/') ? fromCandidate : ROUTES.dashboard.nora;

  // Prefetch dashboard chunks the moment the user lands on Login so they're already
  // in the cache when sign-in completes. Cuts perceived post-login latency.
  useEffect(() => {
    const prefetch = () => {
      void import('@/pages/Dashboard.tsx');
      void import('@/pages/DashboardNora.tsx');
      void import('@/components/dashboard/DashboardLayout');
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(prefetch);
      return () => {
        try {
          (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
        } catch {
          /* ignore */
        }
      };
    }
    const t = setTimeout(prefetch, 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoading, user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Navigate immediately — the AuthProvider listener will update state on next tick
      // and ProtectedRoute will already see the cached session synchronously.
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[env(safe-area-inset-top,0px)]">
      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="mb-8 flex flex-col items-center gap-3">
          <XenoraLogo decorative className="h-14 w-14" />
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
        </Link>

        {bannerMessage && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-center text-sm text-foreground/85">
            {bannerMessage}
          </div>
        )}

        <div className="surface-panel p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                inputMode="email"
                className="min-h-[44px] bg-card/50 text-base border-border md:text-base"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                minLength={6}
                autoComplete="current-password"
                className="min-h-[44px] bg-card/50 text-base border-border md:text-base"
              />
            </div>

            <Button type="submit" disabled={loading} className="min-h-[44px] w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to={ROUTES.signup} className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
