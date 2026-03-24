import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const focusKillers = [
  'Social media (Instagram, TikTok, etc.)',
  'Email and Slack notifications',
  'Context switching between tasks',
  'No clear schedule or structure',
  'Procrastination and low energy',
  'Other',
];

const schema = z.object({
  email: z.string().trim().email('Enter a valid email').max(255),
  focus_killer: z.string().min(1, 'Pick one'),
});

export const NoraWaitlistForm = () => {
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
        setServerError("You're already on the list.");
      } else {
        setServerError('Something went wrong. Try again.');
      }
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-base-content">You're on the list</p>
        <p className="mt-2 text-sm text-base-content/55">We'll reach out when your spot opens up.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="form-control w-full">
        <span className="label-text text-xs text-base-content/50 mb-1">Email address</span>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full border-base-content/10 bg-base-200/60 focus:border-primary/40 focus:outline-none"
          autoComplete="email"
        />
        {errors.email && <span className="label-text-alt text-error mt-1">{errors.email}</span>}
      </label>

      <label className="form-control w-full">
        <span className="label-text text-xs text-base-content/50 mb-1">What kills your focus most?</span>
        <select
          value={focusKiller}
          onChange={(e) => setFocusKiller(e.target.value)}
          className={`select select-bordered w-full border-base-content/10 bg-base-200/60 focus:border-primary/40 focus:outline-none ${
            !focusKiller ? 'text-base-content/40' : ''
          }`}
        >
          <option value="" disabled>Choose one</option>
          {focusKillers.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        {errors.focus_killer && <span className="label-text-alt text-error mt-1">{errors.focus_killer}</span>}
      </label>

      {serverError && <p className="text-center text-sm text-primary">{serverError}</p>}

      <button type="submit" disabled={loading} className="btn btn-outline btn-primary btn-block">
        {loading ? <span className="loading loading-spinner loading-sm" /> : 'Join the beta waitlist'}
      </button>
      <p className="text-center text-xs text-base-content/40">500 spots · First 100 get lifetime Pro free</p>
    </form>
  );
};
