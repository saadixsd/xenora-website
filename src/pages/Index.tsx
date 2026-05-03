import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(255),
  email: z.string().trim().email('Enter a valid email').max(255),
});

const Index = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const result = schema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'name' | 'email';
        if (field === 'name' || field === 'email') fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('waitlist').insert({
      name: result.data.name,
      email: result.data.email,
    });
    setLoading(false);

    if (error) {
      if (error.code === '23505') setServerError('This email is already on the list.');
      else setServerError('Something went wrong. Try again.');
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="px-6 py-6 sm:px-10">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <XenoraLogo decorative className="h-8 w-8" />
          <span className="text-base font-medium tracking-tight">XenoraAI</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-xl text-center">
          <Reveal>
            <p className="font-space-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Coming soon
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="premium-heading mt-5 text-[2.25rem] sm:text-[3.5rem] md:text-[4.25rem]">
              Join the waitlist.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              We're building something for builders who demand simple wins. Be the first to know when it's ready.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            {success ? (
              <div className="mt-12 rounded-2xl border border-border bg-card/40 p-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">You're on the list.</p>
                <p className="mt-2 text-sm text-muted-foreground">We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-md space-y-4 text-left">
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="min-h-[44px]"
                  />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="min-h-[44px]"
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                {serverError && <p className="text-center text-sm text-destructive">{serverError}</p>}
                <Button type="submit" disabled={loading} className="min-h-[48px] w-full rounded-full">
                  {loading ? 'Joining…' : 'Join the waitlist'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-muted-foreground sm:px-10">
        © {new Date().getFullYear()} XenoraAI
      </footer>
    </div>
  );
};

export default Index;
