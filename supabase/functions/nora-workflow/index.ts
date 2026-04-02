import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function sseEvent(data: Record<string, unknown>) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { run_id, input_text, goal, tone } = await req.json();
    if (!run_id || !input_text) {
      return new Response(JSON.stringify({ error: "run_id and input_text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(sseEvent(data)));
        };

        const updateStep = async (step: string, status = "running") => {
          emit({ step, status });
          await supabase
            .from("workflow_runs")
            .update({ current_step: step, status })
            .eq("id", run_id);
        };

        try {
          // Step 1: Input received
          await updateStep("input_received");
          await new Promise((r) => setTimeout(r, 600));

          // Step 2: Classifying
          await updateStep("classifying");
          await new Promise((r) => setTimeout(r, 800));

          // Step 3: Generating
          await updateStep("generating");

          const systemPrompt = `You are Nora, an AI content agent for founders. Generate content from the user's raw thought.

Output EXACTLY this JSON structure (no markdown, no code fences):
{
  "x_post": "A single X/Twitter post (max 280 chars, punchy, no hashtags)",
  "hooks": ["Hook 1", "Hook 2", "Hook 3"],
  "linkedin_post": "A LinkedIn post (2-3 paragraphs, professional, no hashtags)",
  "cta": "A call-to-action line"
}

Tone: ${tone || "professional"}
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
                { role: "user", content: input_text },
              ],
            }),
          });

          if (!aiResp.ok) {
            const errText = await aiResp.text();
            console.error("AI error:", aiResp.status, errText);
            if (aiResp.status === 429) {
              emit({ error: "Rate limited. Please try again later.", status: "failed" });
              controller.close();
              return;
            }
            if (aiResp.status === 402) {
              emit({ error: "Credits exhausted. Please add funds.", status: "failed" });
              controller.close();
              return;
            }
            throw new Error(`AI gateway error: ${aiResp.status}`);
          }

          const aiData = await aiResp.json();
          let rawContent = aiData.choices?.[0]?.message?.content || "";

          // Strip markdown code fences if present
          rawContent = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

          let parsed: { x_post: string; hooks: string[]; linkedin_post: string; cta: string };
          try {
            parsed = JSON.parse(rawContent);
          } catch {
            throw new Error("Failed to parse AI response as JSON");
          }

          // Step 4: Formatting
          await updateStep("formatting");
          await new Promise((r) => setTimeout(r, 500));

          // Save outputs
          const outputRows = [
            { run_id, output_type: "x_post", content: parsed.x_post, position: 0 },
            ...parsed.hooks.map((h: string, i: number) => ({
              run_id,
              output_type: "hook",
              content: h,
              position: i + 1,
            })),
            { run_id, output_type: "linkedin_post", content: parsed.linkedin_post, position: 4 },
            { run_id, output_type: "cta", content: parsed.cta, position: 5 },
          ];

          await supabase.from("workflow_outputs").insert(outputRows);

          // Step 5: Done
          await supabase
            .from("workflow_runs")
            .update({ current_step: "done", status: "completed", completed_at: new Date().toISOString() })
            .eq("id", run_id);

          emit({ step: "done", status: "completed", outputs: outputRows });
          emit({ done: true });
        } catch (e) {
          console.error("Workflow error:", e);
          await supabase
            .from("workflow_runs")
            .update({ status: "failed" })
            .eq("id", run_id);
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
  } catch (e) {
    console.error("Handler error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
