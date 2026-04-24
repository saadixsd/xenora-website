// Public endpoint: validates a contact-form submission and inserts a new lead
// using the service role (so RLS doesn't apply). Also writes a 'created'
// activity row so the lead immediately shows up on the admin timeline.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const BodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  website: z.string().trim().max(255).optional().or(z.literal('')),
  biggest_pain: z.string().trim().max(2000).optional().or(z.literal('')),
  preferred_time: z.string().trim().max(120).optional().or(z.literal('')),
  source: z.enum(['contact_form', 'audit_request']).default('contact_form'),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = parsed.data;
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: lead, error: insertErr } = await admin
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        website: data.website || null,
        biggest_pain: data.biggest_pain || null,
        preferred_time: data.preferred_time || null,
        source: data.source,
        status: 'new',
      })
      .select('id')
      .single();

    if (insertErr) {
      console.error('insert lead failed', insertErr);
      return new Response(JSON.stringify({ error: 'Could not save lead' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await admin.from('lead_activities').insert({
      lead_id: lead.id,
      type: 'created',
      details: { source: data.source },
    });

    return new Response(JSON.stringify({ ok: true, id: lead.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('submit-lead error', err);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
