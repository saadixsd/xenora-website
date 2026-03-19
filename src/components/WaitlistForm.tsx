import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
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
        setServerError('You\'re already on the waitlist! 🎉');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="glass glow-border rounded-2xl p-8 md:p-12 max-w-md mx-auto text-center animate-scale-in">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-foreground mb-2">You're in!</h3>
        <p className="text-muted-foreground">We'll notify you when XenoraAI launches. Get ready to Know Beyond.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass glow-border rounded-2xl p-8 md:p-12 max-w-md mx-auto space-y-5"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Join the Waitlist</h2>
        <p className="text-sm text-muted-foreground">10,000+ builders waiting</p>
      </div>

      <div className="space-y-1.5">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-muted/50 border-border/50 focus:border-primary focus:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-shadow h-12"
          aria-label="Name"
        />
        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-muted/50 border-border/50 focus:border-primary focus:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-shadow h-12"
          aria-label="Email"
        />
        {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
      </div>

      {serverError && <p className="text-primary text-sm text-center">{serverError}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] transition-all duration-300"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Joining...
          </span>
        ) : (
          'Get Early Access'
        )}
      </Button>
    </form>
  );
};

export default WaitlistForm;
