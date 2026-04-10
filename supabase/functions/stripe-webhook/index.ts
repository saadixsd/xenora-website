import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import Stripe from "https://esm.sh/stripe@17.4.0?target=deno";

const stripeApiVersion = "2024-11-20.acacia";

function planFromPriceId(
  priceId: string,
  pricePlus: string,
  pricePro: string,
): "free" | "plus" | "pro" {
  if (priceId === pricePro) return "pro";
  if (priceId === pricePlus) return "plus";
  return "free";
}

function dbStatus(stripeStatus: string): string {
  const map: Record<string, string> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "unpaid",
    incomplete: "incomplete",
    incomplete_expired: "incomplete_expired",
    paused: "inactive",
  };
  return map[stripeStatus] ?? "inactive";
}

// deno-lint-ignore no-explicit-any
async function resolveUserId(
  admin: any,
  stripe: Stripe,
  customerId: string,
  subscription: Stripe.Subscription,
): Promise<string | null> {
  const metaUser = subscription.metadata?.supabase_user_id?.trim();
  if (metaUser) return metaUser;

  const { data: row } = await admin
    .from("billing_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (row?.user_id) return row.user_id as string;

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  const fromCustomer = customer.metadata?.supabase_user_id?.trim();
  return fromCustomer || null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function syncSubscription(
  admin: ReturnType<typeof createClient>,
  stripe: Stripe,
  sub: Stripe.Subscription,
  pricePlus: string,
  pricePro: string,
  /** From Payment Link / Checkout: `client_reference_id` = Supabase `auth.users.id` */
  overrideUserId?: string | null,
): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  let userId: string | null = null;
  const ref = overrideUserId?.trim();
  if (ref && UUID_RE.test(ref)) {
    userId = ref;
  }
  if (!userId) {
    userId = await resolveUserId(admin, stripe, customerId, sub);
  }
  if (!userId) {
    console.error("stripe-webhook: could not resolve user for customer", customerId);
    return;
  }

  const priceId = sub.items.data[0]?.price?.id ?? "";
  let plan: "free" | "plus" | "pro" = "free";
  if (sub.status === "active" || sub.status === "trialing") {
    plan = planFromPriceId(priceId, pricePlus, pricePro);
    if (plan === "free" && priceId) plan = "plus";
  }
  if (
    sub.status === "canceled" || sub.status === "unpaid" ||
    sub.status === "incomplete_expired"
  ) {
    plan = "free";
  }

  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  const { error } = await admin.from("billing_subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.status === "canceled" ? null : sub.id,
      plan,
      status: dbStatus(sub.status),
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) {
    console.error("billing_subscriptions upsert", error);
    return;
  }

  try {
    const cust = await stripe.customers.retrieve(customerId);
    if (typeof cust !== "object" || cust.deleted) return;
    if (cust.metadata?.supabase_user_id === userId) return;
    await stripe.customers.update(customerId, {
      metadata: { ...cust.metadata, supabase_user_id: userId },
    });
  } catch (e) {
    console.error("stripe customer metadata", e);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = Deno.env.get("STRIPE_SECRET_KEY");
  const whSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const pricePlus = Deno.env.get("STRIPE_PRICE_PLUS") ?? "";
  const pricePro = Deno.env.get("STRIPE_PRICE_PRO") ?? "";

  if (!secret || !whSecret || !supabaseUrl || !serviceKey) {
    console.error("stripe-webhook: missing env");
    return new Response("Server misconfigured", { status: 500 });
  }

  const stripe = new Stripe(secret, { apiVersion: stripeApiVersion });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (e) {
    console.error("stripe signature", e);
    return new Response("Invalid signature", { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;
        const subId = session.subscription;
        if (typeof subId !== "string") break;
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncSubscription(
          admin,
          stripe,
          sub,
          pricePlus,
          pricePro,
          session.client_reference_id,
        );
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(admin, stripe, sub, pricePlus, pricePro);
        break;
      }
      case "invoice.paid": {
        const inv = event.data.object as Stripe.Invoice;
        const subId = inv.subscription;
        if (typeof subId !== "string") break;
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncSubscription(admin, stripe, sub, pricePlus, pricePro);
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const subId = inv.subscription;
        if (typeof subId !== "string") break;
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncSubscription(admin, stripe, sub, pricePlus, pricePro);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("stripe-webhook handler", e);
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
