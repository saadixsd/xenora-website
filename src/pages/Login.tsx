import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/config/routes';

type LoginLocationState = { message?: string };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const bannerMessage = (location.state as LoginLocationState | null)?.message;

  useEffect(() => {
    if (!authLoading && user) {
      navigate(ROUTES.dashboard.nora, { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate(ROUTES.dashboard.nora);
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

  if (authLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <NeuralMeshBackground />
        <span className="relative z-10 text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[env(safe-area-inset-top,0px)]">
      <NeuralMeshBackground />

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
