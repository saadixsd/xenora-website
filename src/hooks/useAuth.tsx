import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Reads any cached session from localStorage so we can render the right tree
 * (logged-in vs. logged-out) on the very first paint, without waiting for
 * Supabase's network round-trip. This eliminates the post-login "blank/spinner"
 * flash users see while getSession() resolves.
 */
function readCachedSession(): { session: Session | null; hasCache: boolean } {
  try {
    if (typeof window === 'undefined') return { session: null, hasCache: false };
    // Supabase stores the session under a key like sb-<project-ref>-auth-token
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith('sb-') || !key.endsWith('-auth-token')) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { currentSession?: Session } & Partial<Session>;
      const session = (parsed.currentSession ?? (parsed as Session)) || null;
      if (session && session.user) {
        return { session, hasCache: true };
      }
      return { session: null, hasCache: true };
    }
  } catch {
    /* ignore — fall through */
  }
  return { session: null, hasCache: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(readCachedSession, []);
  const [session, setSession] = useState<Session | null>(initial.session);
  const [user, setUser] = useState<User | null>(initial.session?.user ?? null);
  // If we already have a cached session, we can skip the loading state entirely.
  const [loading, setLoading] = useState<boolean>(!initial.hasCache);

  useEffect(() => {
    // Listen FIRST so we never miss an event that fires while getSession() is in-flight.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: fetched } }) => {
      setSession(fetched);
      setUser(fetched?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;
  // Fallback for any test/storybook render without the provider — keeps API stable.
  return { user: null, session: null, loading: false, signOut: async () => { /* noop */ } };
}
