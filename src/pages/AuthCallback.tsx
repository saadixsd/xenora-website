import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { ROUTES } from '@/config/routes';

/**
 * Handles Supabase email confirmation / magic-link redirects.
 * Add this URL to Supabase Auth → URL Configuration → Redirect URLs:
 *   https://xenoraai.com/auth/callback
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const redirected = useRef(false);

  useEffect(() => {
    if (window.location.hostname !== 'xenoraai.com') {
      window.location.replace(`https://xenoraai.com${ROUTES.authCallback}${window.location.search}${window.location.hash}`);
      return;
    }

    const go = (path: string) => {
      if (redirected.current) return;
      redirected.current = true;
      navigate(path, { replace: true });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        go(ROUTES.dashboard.root);
      }
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) go(ROUTES.dashboard.root);
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
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[env(safe-area-inset-top,0px)]">
      <NeuralMeshBackground />
      <p className="relative z-10 text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
