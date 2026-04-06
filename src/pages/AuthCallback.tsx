import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { ROUTES } from '@/config/routes';

/**
 * Handles Supabase email confirmation / magic-link redirects.
 * Add this URL to Supabase Auth → URL Configuration → Redirect URLs:
 *   https://<your-domain>/auth/callback
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const redirected = useRef(false);

  useEffect(() => {
    const go = (path: string) => {
      if (redirected.current) return;
      redirected.current = true;
      navigate(path, { replace: true });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        go(ROUTES.dashboard.nora);
      }
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) go(ROUTES.dashboard.nora);
    });

    const timeout = window.setTimeout(() => {
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (redirected.current) return;
        if (!session?.user) go(ROUTES.login);
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <NeuralMeshBackground />
      <p className="relative z-10 text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
