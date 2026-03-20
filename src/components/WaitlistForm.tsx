import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const focusKillers = [
  'Social media (Instagram, TikTok, X)',
  'YouTube / streaming',
  'Email & Slack notifications',
  'Meetings & interruptions',
  'Procrastination / low energy',
  'Other',
];

const schema = z.object({
  email: z.string().trim().email('Enter a valid email').max(255),
  focus_killer: z.string().min(1, 'Pick one'),
});

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [focusKiller, setFocusKiller] = useState('');
  const [errors, setErrors] = useState<{ email?: string; focus_killer?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const result = schema.safeParse({ email, focus_killer: focusKiller });
    if (!result.success) {
      const fieldErrors: { email?: string; focus_killer?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'email' | 'focus_killer';
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('waitlist')
      .insert({ name: result.data.email.split('@')[0], email: result.data.email, focus_killer: result.data.focus_killer });
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
      <div className="text-center space-y-3 animate-scale-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-foreground font-semibold text-lg">You're in the beta!</p>
        <p className="text-sm text-muted-foreground">We'll reach out before launch. Stay focused.</p>
      </div>
    );
  }

  const inputClass = "h-12 bg-muted/40 border-border/50 focus:border-primary/60 focus:shadow-[0_0_12px_hsl(190_100%_44%/0.2)] transition-all text-sm rounded-lg";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          aria-label="Email"
        />
        {errors.email && <p className="text-destructive text-xs mt-1.5">{errors.email}</p>}
      </div>
      <div>
        <select
          value={focusKiller}
          onChange={(e) => setFocusKiller(e.target.value)}
          className={`w-full ${inputClass} px-3 bg-muted/40 border border-border/50 text-foreground appearance-none cursor-pointer ${!focusKiller ? 'text-muted-foreground' : ''}`}
          aria-label="What kills your focus most?"
        >
          <option value="" disabled>What kills your focus most?</option>
          {focusKillers.map((k) => (
            <option key={k} value={k} className="bg-card text-foreground">{k}</option>
          ))}
        </select>
        {errors.focus_killer && <p className="text-destructive text-xs mt-1.5">{errors.focus_killer}</p>}
      </div>
      {serverError && <p className="text-primary text-xs text-center">{serverError}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/85 active:scale-[0.97] transition-all rounded-lg glow-teal"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Joining...
          </span>
        ) : (
          'Join Beta Waitlist'
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        500 spots · First 100 get <span className="text-primary font-medium">lifetime Pro free</span>
      </p>
    </form>
  );
};

export default WaitlistForm;
