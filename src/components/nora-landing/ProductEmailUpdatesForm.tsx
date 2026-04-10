import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const PRODUCT_UPDATES_ROLE = 'Product updates';

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(255),
  email: z.string().trim().email('Enter a valid email').max(255),
  note: z.string().max(500).optional(),
});

/** Joins the marketing email list (same `waitlist` table; role tags product-news subscribers). */
export function ProductEmailUpdatesForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const result = schema.safeParse({ name, email, note });
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
      role: PRODUCT_UPDATES_ROLE,
      biggest_pain: result.data.note?.trim() || null,
    });
    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        setServerError('This email is already on the list.');
      } else {
        setServerError('Something went wrong. Try again.');
      }
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-base-content">You&apos;re subscribed.</p>
        <p className="mt-2 text-sm text-base-content/55">We&apos;ll email you product updates. No spam.</p>
      </div>
    );
  }

  const inputClass =
    'input input-bordered w-full min-h-[44px] text-base border-base-content/10 bg-base-200/60 focus:border-primary/40 focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="form-control w-full">
        <span className="label-text mb-1 text-sm text-base-content/50">Name</span>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
        {errors.name && <span className="label-text-alt mt-1 text-error">{errors.name}</span>}
      </label>

      <label className="form-control w-full">
        <span className="label-text mb-1 text-sm text-base-content/50">Email</span>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          autoComplete="email"
        />
        {errors.email && <span className="label-text-alt mt-1 text-error">{errors.email}</span>}
      </label>

      <label className="form-control w-full">
        <span className="label-text mb-1 text-sm text-base-content/50">
          Note <span className="text-base-content/30">(optional)</span>
        </span>
        <input
          type="text"
          placeholder="What you build or what you want to hear about"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputClass}
        />
      </label>

      {serverError && <p className="text-center text-sm text-error">{serverError}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary btn-block min-h-[44px]">
        {loading ? 'Sending…' : 'Subscribe'}
      </button>
    </form>
  );
}
