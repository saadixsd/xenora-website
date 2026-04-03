/**
 * Nora workflow runner (SSE). Requires verify_jwt = true in config.
 * Client must send Authorization: Bearer <user access_token> (session JWT).
 * Verifies workflow_runs row belongs to the caller before calling AI.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number; dailyCount: number; dailyResetAt: number }
>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 8;
const DAILY_MAX = 80;
const DAY_MS = 86_400_000;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  let entry = rateLimitMap.get(userId);
  if (!entry || now > entry.dailyResetAt) {
    entry = { count: 1, resetAt: now + RATE_WINDOW_MS, dailyCount: 1, dailyResetAt: now + DAY_MS };
    rateLimitMap.set(userId, entry);
    return false;
  }
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_WINDOW_MS;
  } else {
    entry.count++;
  }
  entry.dailyCount++;
  return entry.count > RATE_MAX || entry.dailyCount > DAILY_MAX;
}

function sseEvent(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function jsonRes(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonRes({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonRes({ error: "Unauthorized" }, 401);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonRes({ error: "Server misconfigured" }, 500);
  }

  const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabaseUser.auth.getUser();
  if (userErr || !user) {
    return jsonRes({ error: "Unauthorized" }, 401);
  }

  if (isRateLimited(user.id)) {
    return jsonRes({ error: "Too many requests. Please wait a moment." }, 429);
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return jsonRes(
      { error: "Workflow AI is not configured (LOVABLE_API_KEY missing on the function)." },
      503,
    );
  }

  let body: { run_id?: string; input_text?: string; goal?: string; tone?: string };
  try {
    body = await req.json();
  } catch {
    return jsonRes({ error: "Invalid JSON" }, 400);
  }

  const runId = body.run_id;
  const inputText = typeof body.input_text === "string" ? body.input_text.trim() : "";
  if (!runId || !inputText) {
    return jsonRes({ error: "run_id and input_text required" }, 400);
  }

  const { data: run, error: runErr } = await supabaseUser
    .from("workflow_runs")
    .select("id, user_id, status")
    .eq("id", runId)
    .single();

  if (runErr || !run || run.user_id !== user.id) {
    return jsonRes({ error: "Forbidden" }, 403);
  }

  if (run.status !== "running") {
    return jsonRes({ error: "Run is not in a runnable state" }, 400);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const goal = typeof body.goal === "string" ? body.goal.trim() : "";
  const tone = typeof body.tone === "string" && body.tone.trim() ? body.tone.trim() : "professional";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(data)));
      };

      const updateStep = async (step: string, status = "running") => {
        emit({ step, status });
        await supabaseAdmin
          .from("workflow_runs")
          .update({ current_step: step, status })
          .eq("id", runId);
      };

      try {
        await updateStep("input_received");
        await new Promise((r) => setTimeout(r, 600));

        await updateStep("classifying");
        await new Promise((r) => setTimeout(r, 800));

        await updateStep("generating");

        const systemPrompt = `You are Nora, XenoraAI's content agent for founders. Generate content from the user's raw thought.

Output EXACTLY this JSON structure (no markdown, no code fences):
{
  "x_post": "A single X/Twitter post (max 280 chars, punchy, no hashtags)",
  "hooks": ["Hook 1", "Hook 2", "Hook 3"],
  "linkedin_post": "A LinkedIn post (2-3 paragraphs, professional, no hashtags)",
  "cta": "A call-to-action line"
}

Tone: ${tone}
${goal ? `Goal: ${goal}` : ""}
Target audience: solo founders, indie hackers, creators building in public.
Be direct, sharp, no fluff, no emojis.`;

        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: inputText },
            ],
          }),
        });

        if (!aiResp.ok) {
          const errText = await aiResp.text();
          console.error("AI error:", aiResp.status, errText);
          if (aiResp.status === 429) {
            emit({ error: "Rate limited. Please try again later.", status: "failed" });
            await supabaseAdmin.from("workflow_runs").update({ status: "failed" }).eq("id", runId);
            controller.close();
            return;
          }
          if (aiResp.status === 402) {
            emit({ error: "AI credits exhausted. Please try again later.", status: "failed" });
            await supabaseAdmin.from("workflow_runs").update({ status: "failed" }).eq("id", runId);
            controller.close();
            return;
          }
          throw new Error(`AI gateway error: ${aiResp.status}`);
        }

        const aiData = await aiResp.json();
        let rawContent = aiData.choices?.[0]?.message?.content || "";
        rawContent = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        let parsed: { x_post: string; hooks: string[]; linkedin_post: string; cta: string };
        try {
          parsed = JSON.parse(rawContent);
        } catch {
          throw new Error("Failed to parse AI response as JSON");
        }

        await updateStep("formatting");
        await new Promise((r) => setTimeout(r, 500));

        const outputRows = [
          { run_id: runId, output_type: "x_post", content: parsed.x_post, position: 0 },
          ...parsed.hooks.map((h: string, i: number) => ({
            run_id: runId,
            output_type: "hook",
            content: h,
            position: i + 1,
          })),
          { run_id: runId, output_type: "linkedin_post", content: parsed.linkedin_post, position: 4 },
          { run_id: runId, output_type: "cta", content: parsed.cta, position: 5 },
        ];

        await supabaseAdmin.from("workflow_outputs").insert(outputRows);

        await supabaseAdmin
          .from("workflow_runs")
          .update({
            current_step: "done",
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", runId);

        emit({ step: "done", status: "completed", outputs: outputRows });
        emit({ done: true });
      } catch (e) {
        console.error("Workflow error:", e);
        await supabaseAdmin.from("workflow_runs").update({ status: "failed" }).eq("id", runId);
        emit({ error: e instanceof Error ? e.message : "Unknown error", status: "failed" });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
});
