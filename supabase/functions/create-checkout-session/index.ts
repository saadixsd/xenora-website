import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import Stripe from "https://esm.sh/stripe@17.4.0?target=deno";

const stripeApiVersion = "2024-11-20.acacia";

const ALLOWED_ORIGINS = [
  "https://xenoraai.com",
  "https://www.xenoraai.com",
  "https://xenora-ai-portal.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (origin.endsWith(".lovable.app") || origin.endsWith(".lovableproject.com")) return true;
  try {
    const u = new URL(origin);
    if (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) {
      return true;
    }
  } catch {
    /* ignore */
  }
  return ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin?: string | null): HeadersInit {
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-app-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

function json(data: unknown, status = 200, origin?: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  if (!isOriginAllowed(origin)) {
    return json({ error: "Forbidden" }, 403, origin);
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const pricePlus = Deno.env.get("STRIPE_PRICE_PLUS");
  const pricePro = Deno.env.get("STRIPE_PRICE_PRO");
  const appUrl = (Deno.env.get("APP_URL") ?? "https://xenoraai.com").replace(/\/$/, "");

  if (!stripeSecret || !supabaseUrl || !anonKey || !serviceKey || !pricePlus || !pricePro) {
    return json({ error: "Server misconfigured" }, 500, origin);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401, origin);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    return json({ error: "Unauthorized" }, 401, origin);
  }

  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const plan = body.plan === "pro" ? "pro" : body.plan === "plus" ? "plus" : "";
  if (!plan) {
    return json({ error: "plan must be plus or pro" }, 400, origin);
  }

  const priceId = plan === "pro" ? pricePro : pricePlus;
  const stripe = new Stripe(stripeSecret, { apiVersion: stripeApiVersion });
  const admin = createClient(supabaseUrl, serviceKey);

  let customerId: string;
  const { data: existing } = await admin
    .from("billing_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.stripe_customer_id) {
    customerId = existing.stripe_customer_id as string;
  } else {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    const { error: insErr } = await admin.from("billing_subscriptions").upsert(
      {
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: null,
        plan: "free",
        status: "inactive",
        current_period_end: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (insErr) {
      console.error("billing_subscriptions bootstrap", insErr);
      return json({ error: "Could not prepare billing profile" }, 500, origin);
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/settings?billing=success`,
    cancel_url: `${appUrl}/dashboard/settings?billing=canceled`,
    client_reference_id: user.id,
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan },
    },
    metadata: { supabase_user_id: user.id, plan },
  });

  if (!session.url) {
    return json({ error: "No checkout URL" }, 500, origin);
  }

  return json({ url: session.url }, 200, origin);
});
