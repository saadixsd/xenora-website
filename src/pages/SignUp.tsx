import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const authCallbackUrl = () => `${window.location.origin}/auth/callback`;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please re-enter your password.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: authCallbackUrl() },
      });
      if (error) throw error;

      if (data.session) {
        toast({
          title: 'Welcome to XenoraAI',
          description: "You're signed in.",
        });
        navigate('/dashboard', { replace: true });
      } else {
        setAwaitingEmailConfirmation(true);
      }
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <NeuralMeshBackground />
        <span className="relative z-10 text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <NeuralMeshBackground />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="mb-8 flex flex-col items-center gap-3">
          <XenoraLogo decorative className="h-14 w-14" />
          <h1 className="text-xl font-semibold text-foreground">Create account</h1>
        </Link>

        <div className="surface-panel p-6">
          {awaitingEmailConfirmation ? (
            <div className="space-y-4 text-center">
              <p className="text-base font-medium text-foreground leading-snug">
                Check your email — we sent you a confirmation link. Once confirmed you&apos;ll land straight in your
                dashboard.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Didn&apos;t get it? Check spam or contact{' '}
                <a href="mailto:xenoraai@gmail.com" className="text-primary underline-offset-4 hover:underline">
                  xenoraai@gmail.com
                </a>
              </p>
              <p className="pt-2 text-sm text-muted-foreground">
                <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <>
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
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="min-h-[44px] bg-card/50 text-base border-border md:text-base"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Confirm password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="min-h-[44px] bg-card/50 text-base border-border md:text-base"
                  />
                </div>

                <Button type="submit" disabled={loading} className="min-h-[44px] w-full">
                  {loading ? 'Creating account…' : 'Sign up'}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                  Already have an account? Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
