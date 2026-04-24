import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { Reveal } from '@/components/motion/Reveal';
import { ROUTES } from '@/config/routes';
import { toast } from '@/hooks/use-toast';

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Enter a valid email').max(255),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  website: z.string().trim().max(255).optional().or(z.literal('')),
  biggest_pain: z.string().trim().min(1, 'Tell me what you want to fix').max(2000),
  preferred_time: z.string().trim().max(120).optional().or(z.literal('')),
});

type FormState = z.infer<typeof ContactSchema>;

const FUNCTION_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/submit-lead`;

const Contact = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [form, setForm] = useState<FormState>({
    name: '', email: '', company: '', website: '', biggest_pain: '', preferred_time: '',
  });

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = ContactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrs: Partial<Record<keyof FormState, string>> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (v?.[0]) fieldErrs[k as keyof FormState] = v[0];
      }
      setErrors(fieldErrs);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, source: 'audit_request' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? 'Could not submit');
      }
      setSuccess(true);
    } catch (err) {
      toast({
        title: 'Submission failed',
        description: err instanceof Error ? err.message : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh bg-base-100 text-base-content">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-base-content/[0.07] bg-base-100/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:min-h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-9 w-9 sm:h-12 sm:w-12" />
            <span className="text-base font-semibold sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-8 sm:pt-32">
        <Reveal>
          <p className="font-syne text-[12px] font-medium uppercase tracking-[0.14em] text-base-content/45">
            20-minute automation audit
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="premium-heading mt-3 text-3xl font-medium leading-tight sm:text-4xl">
            Tell me where the busywork is hiding.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-base text-base-content/65 leading-relaxed">
            Share a few details and I will reply within one business day with a short Loom outlining what Xenora can automate first, and the realistic time it would save.
          </p>
        </Reveal>

        {success ? (
          <Reveal>
            <div className="surface-panel mt-10 flex flex-col items-center gap-4 p-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden />
              <h2 className="text-xl font-semibold">Got it. Thank you.</h2>
              <p className="max-w-md text-sm text-base-content/60">
                Your request landed in the Xenora pipeline. I will reach out personally within one business day.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-base-content/15 px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                Back to home
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.15}>
            <form onSubmit={handleSubmit} className="surface-panel mt-10 space-y-5 p-6 sm:p-8" noValidate>
              <Field label="Your name" error={errors.name} required>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  className="form-input"
                  autoComplete="name"
                  required
                />
              </Field>

              <Field label="Email" error={errors.email} required>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className="form-input"
                  autoComplete="email"
                  required
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Company" error={errors.company}>
                  <input
                    type="text"
                    value={form.company}
                    onChange={update('company')}
                    className="form-input"
                    autoComplete="organization"
                  />
                </Field>
                <Field label="Website" error={errors.website}>
                  <input
                    type="url"
                    placeholder="https://"
                    value={form.website}
                    onChange={update('website')}
                    className="form-input"
                    autoComplete="url"
                  />
                </Field>
              </div>

              <Field label="What is the biggest operational pain right now?" error={errors.biggest_pain} required>
                <textarea
                  rows={5}
                  value={form.biggest_pain}
                  onChange={update('biggest_pain')}
                  className="form-input resize-y"
                  placeholder="Where are you losing the most time? Lead replies, content, follow-ups, scheduling, support..."
                  required
                />
              </Field>

              <Field label="Preferred time for a 20-minute call (optional)">
                <input
                  type="text"
                  value={form.preferred_time}
                  onChange={update('preferred_time')}
                  className="form-input"
                  placeholder="e.g. Weekday mornings ET"
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_rgba(0,200,150,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,200,150,0.26)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request the audit
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-base-content/45">
                Prefer the waitlist instead?{' '}
                <Link to="/#product-updates" className="text-primary hover:underline">
                  Join the product updates list
                </Link>
                .
              </p>
            </form>
          </Reveal>
        )}
      </main>
    </div>
  );
};

function Field({ label, error, required, children }: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 inline-block font-medium text-base-content/80">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

export default Contact;
