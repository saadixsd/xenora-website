import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(1, 'Required').max(100),
  email: z.string().trim().email('Enter a valid email').max(255),
});

const WaitlistForm = () => {
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
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('waitlist')
      .insert({ name: result.data.name, email: result.data.email });
    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        setServerError("You're already on the list ✓");
      } else {
        setServerError('Something went wrong. Try again.');
      }
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center space-y-2 animate-scale-in">
        <p className="text-foreground font-medium">You're in.</p>
        <p className="text-sm text-muted-foreground">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 bg-muted/30 border-border/40 focus:border-primary/50 focus:shadow-[0_0_8px_hsl(var(--primary)/0.15)] transition-shadow text-sm"
          aria-label="Name"
        />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 bg-muted/30 border-border/40 focus:border-primary/50 focus:shadow-[0_0_8px_hsl(var(--primary)/0.15)] transition-shadow text-sm"
          aria-label="Email"
        />
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
      </div>
      {serverError && <p className="text-primary text-xs text-center">{serverError}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all rounded-lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            Joining...
          </span>
        ) : (
          'Join Waitlist'
        )}
      </Button>
    </form>
  );
};

export default WaitlistForm;
