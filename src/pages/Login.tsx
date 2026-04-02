import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split('@')[0] },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: 'Check your email',
          description: 'We sent you a verification link. Please confirm your email to sign in.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <NeuralMeshBackground />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="mb-8 flex flex-col items-center gap-3">
          <XenoraLogo decorative className="h-14 w-14" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Nora</h1>
            <p className="text-xs text-muted-foreground">AI workflow workspace for founders</p>
          </div>
        </Link>

        <div className="surface-panel p-6">
          <h2 className="text-lg font-medium text-foreground">
            {isSignUp ? 'Create your account' : 'Sign in to Nora'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp ? 'Start building workflows in minutes.' : 'Welcome back.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="bg-card/50 border-border"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-card/50 border-border"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="bg-card/50 border-border"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/50">
          By continuing, you agree to our{' '}
          <Link to="/privacy" className="underline hover:text-muted-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
