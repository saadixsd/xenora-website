/**
 * Hosted Stripe Payment Links (subscription checkout).
 * We append `client_reference_id` (Supabase auth user id) so `stripe-webhook` can upsert `billing_subscriptions`.
 *
 * In Stripe Dashboard → each Payment Link → After payment → set confirmation / redirect to your site, e.g.
 *   https://xenoraai.com/dashboard/settings?billing=success
 *
 * @see https://stripe.com/docs/payment-links/share#customize-checkout-with-url-parameters
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Nora Plus — default from your Stripe Payment Link */
export const STRIPE_PAYMENT_LINK_PLUS =
  import.meta.env.VITE_STRIPE_PAYMENT_LINK_PLUS?.trim() ||
  'https://buy.stripe.com/bJe4gy4RceG67dyaHwdnW03';

/** Nora Pro — default from your Stripe Payment Link */
export const STRIPE_PAYMENT_LINK_PRO =
  import.meta.env.VITE_STRIPE_PAYMENT_LINK_PRO?.trim() ||
  'https://buy.stripe.com/6oUeVcfvQcxY8hCcPEdnW02';

export function buildStripePaymentLinkUrl(
  paymentLinkBase: string,
  userId: string,
  email: string | null | undefined,
): string {
  const u = new URL(paymentLinkBase);
  if (UUID_RE.test(userId)) {
    u.searchParams.set('client_reference_id', userId);
  }
  const e = typeof email === 'string' ? email.trim() : '';
  if (e) {
    u.searchParams.set('prefilled_email', e);
  }
  return u.toString();
}
