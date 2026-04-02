import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const roleOptions = ['Solo Founder', 'Indie Hacker', 'Creator Founder', 'Micro-SaaS Team', 'Other'];

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(255),
  email: z.string().trim().email('Enter a valid email').max(255),
  role: z.string().min(1, 'Pick one'),
  ops_pain: z.string().max(500).optional(),
});

export const NoraWaitlistForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [opsPain, setOpsPain] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const result = schema.safeParse({ name, email, role, ops_pain: opsPain });
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; role?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'name' | 'email' | 'role';
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    // Store role + ops pain in focus_killer column (existing schema)
    const focusKiller = [result.data.role, result.data.ops_pain].filter(Boolean).join(' | ');

    const { error } = await supabase
      .from('waitlist')
      .insert({
        name: result.data.name,
        email: result.data.email,
        focus_killer: focusKiller || null,
      });
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
        <p className="text-lg font-semibold text-base-content">You're on the list.</p>
        <p className="mt-2 text-sm text-base-content/55">
          We'll reach out personally — not a mass email. Building something real here.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="form-control w-full">
        <span className="label-text text-[12px] sm:text-xs text-base-content/50 mb-1">Name</span>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full border-base-content/10 bg-base-200/60 focus:border-primary/40 focus:outline-none"
          autoComplete="name"
        />
        {errors.name && <span className="label-text-alt text-error mt-1">{errors.name}</span>}
      </label>

      <label className="form-control w-full">
        <span className="label-text text-[12px] sm:text-xs text-base-content/50 mb-1">Email address</span>
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
        <span className="label-text text-[12px] sm:text-xs text-base-content/50 mb-1">Role</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`select select-bordered w-full border-base-content/10 bg-base-200/60 focus:border-primary/40 focus:outline-none ${
            !role ? 'text-base-content/40' : ''
          }`}
        >
          <option value="" disabled>Choose one</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.role && <span className="label-text-alt text-error mt-1">{errors.role}</span>}
      </label>

      <label className="form-control w-full">
        <span className="label-text text-[12px] sm:text-xs text-base-content/50 mb-1">
          Biggest ops pain <span className="text-base-content/30">(optional)</span>
        </span>
        <input
          type="text"
          placeholder="What takes the most time you wish Nora could handle?"
          value={opsPain}
          onChange={(e) => setOpsPain(e.target.value)}
          className="input input-bordered w-full border-base-content/10 bg-base-200/60 focus:border-primary/40 focus:outline-none"
        />
      </label>

      {serverError && <p className="text-center text-sm text-primary">{serverError}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary btn-block">
        {loading ? <span className="loading loading-spinner loading-sm" /> : 'Secure My Spot'}
      </button>
    </form>
  );
};
