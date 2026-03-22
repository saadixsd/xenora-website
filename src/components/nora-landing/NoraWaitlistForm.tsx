import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const workflowPains = [
  'Scattered docs & context switching',
  'Email and chat fragmentation',
  'Manual handoffs between tools',
  'Hard to automate recurring workflows',
  'Other',
];

const schema = z.object({
  email: z.string().trim().email('Enter a valid email').max(255),
  focus_killer: z.string().min(1, 'Pick one'),
});

/** DaisyUI-styled waitlist for Nora — same Supabase `waitlist` table as legacy form. */
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
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-base-content">You&apos;re on the list</p>
        <p className="mt-2 text-sm text-base-content/60">We&apos;ll email you when your Nora workspace is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="form-control w-full">
        <span className="label-text text-xs text-base-content/50">Work email</span>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full border-base-content/10 bg-base-200/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          autoComplete="email"
        />
        {errors.email && <span className="label-text-alt text-error">{errors.email}</span>}
      </label>

      <label className="form-control w-full">
        <span className="label-text text-xs text-base-content/50">What slows your workflows most?</span>
        <select
          value={focusKiller}
          onChange={(e) => setFocusKiller(e.target.value)}
          className={`select select-bordered w-full border-base-content/10 bg-base-200/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            !focusKiller ? 'text-base-content/40' : ''
          }`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {workflowPains.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        {errors.focus_killer && <span className="label-text-alt text-error">{errors.focus_killer}</span>}
      </label>

      {serverError && <p className="text-center text-sm text-primary">{serverError}</p>}

      <button type="submit" disabled={loading} className="btn btn-outline btn-primary btn-block hover:shadow-[0_0_24px_rgb(34_211_238_/_0.25)]">
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          'Request Nora access'
        )}
      </button>
      <p className="text-center text-xs text-base-content/45">No spam · Early access is limited</p>
    </form>
  );
};
