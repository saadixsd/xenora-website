/**
 * Nora workflow runner (SSE). Requires verify_jwt = true in config.
 * Template-aware: Content, Lead Follow-up, Research (optional URL fetch).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { isNoraQuotaExemptEmail } from "../_shared/noraQuota.ts";
import { fetchBillingRow, FREE_MONTHLY_RUNS, isPaidNoraAccess } from "../_shared/billing.ts";

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

const MAX_SOURCE_URLS = 5;
const FETCH_TIMEOUT_MS = 8_000;
const MAX_FETCH_BYTES = 120_000;
const MAX_CONTEXT_CHARS = 24_000;

const MINUTES_BY_AGENT = { content: 15, lead: 10, research: 25 } as const;

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

type AgentKind = "content" | "lead" | "research";

function classifyTemplate(name: string): AgentKind {
  const n = name.toLowerCase();
  if (n.includes("lead")) return "lead";
  if (n.includes("research")) return "research";
  return "content";
}

const STEPS_BY_AGENT: Record<AgentKind, readonly string[]> = {
  content: ["input_received", "classifying", "generating", "formatting", "done"],
  lead: ["input_received", "parsing", "drafting", "personalizing", "formatting", "done"],
  research: ["input_received", "researching", "analyzing", "summarizing", "formatting", "done"],
} as const;

function safeStep(agentKind: AgentKind, step: string): string {
  const allowed = STEPS_BY_AGENT[agentKind];
  return allowed.includes(step) ? step : allowed[0];
}

function normalizeRedditJsonUrl(raw: string): string {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^old\./, "www.");
    if (!host.endsWith("reddit.com")) return raw;
    let path = u.pathname.replace(/\/$/, "");
    if (!path.endsWith(".json")) path = `${path}.json`;
    return `https://www.reddit.com${path}`;
  } catch {
    return raw;
  }
}

async function fetchUrlText(url: string): Promise<{ ok: boolean; summary: string; error?: string }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const target = url.includes("reddit.com") ? normalizeRedditJsonUrl(url) : url;
    const res = await fetch(target, {
      signal: controller.signal,
      headers: {
        "User-Agent": "NoraResearchBot/1.0 (founder research; contact: support@xenora.ai)",
        Accept: url.includes("reddit.com") ? "application/json" : "text/html, text/plain, */*",
      },
    });
    clearTimeout(t);
    if (!res.ok) {
      return { ok: false, summary: "", error: `${target} → HTTP ${res.status}` };
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    const slice = buf.length > MAX_FETCH_BYTES ? buf.slice(0, MAX_FETCH_BYTES) : buf;
    const text = new TextDecoder("utf-8", { fatal: false }).decode(slice);

    if (target.endsWith(".json") || text.trimStart().startsWith("{") || text.trimStart().startsWith("[")) {
      try {
        const data = JSON.parse(text) as unknown;
        const excerpt = summarizeRedditJson(data);
        return { ok: true, summary: excerpt || text.slice(0, MAX_CONTEXT_CHARS) };
      } catch {
        return { ok: true, summary: text.slice(0, MAX_CONTEXT_CHARS) };
      }
    }

    const stripped = text
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return { ok: true, summary: stripped.slice(0, MAX_CONTEXT_CHARS) };
  } catch (e) {
    clearTimeout(t);
    const msg = e instanceof Error ? e.message : "fetch failed";
    return { ok: false, summary: "", error: msg };
  }
}

function summarizeRedditJson(data: unknown): string {
  const lines: string[] = [];
  const walk = (node: unknown, depth: number) => {
    if (depth > 14 || lines.join("\n").length > MAX_CONTEXT_CHARS) return;
    if (!node || typeof node !== "object") return;
    const o = node as Record<string, unknown>;
    if (typeof o.title === "string") lines.push(`Title: ${o.title}`);
    if (typeof o.selftext === "string" && o.selftext.trim()) {
      lines.push(`Post: ${o.selftext.slice(0, 4_000)}`);
    }
    if (typeof o.body === "string" && o.body.trim()) {
      lines.push(`Comment: ${o.body.slice(0, 1_500)}`);
    }
    const children = (o.data as Record<string, unknown> | undefined)?.children;
    if (Array.isArray(children)) {
      for (const c of children.slice(0, 30)) {
        const d = c && typeof c === "object" ? (c as Record<string, unknown>).data : null;
        walk(d, depth + 1);
      }
    }
    if (Array.isArray(node)) {
      for (const item of node.slice(0, 5)) walk(item, depth + 1);
    }
  };
  walk(data, 0);
  return lines.join("\n").slice(0, MAX_CONTEXT_CHARS);
}

async function gatherResearchContext(
  inputText: string,
  urls: string[],
): Promise<string> {
  const notes: string[] = [`User notes:\n${inputText}`];
  const fetchNotes: string[] = [];
  const limited = urls.slice(0, MAX_SOURCE_URLS);
  for (const u of limited) {
    const trimmed = u.trim();
    if (!trimmed) continue;
    const r = await fetchUrlText(trimmed);
    if (r.ok && r.summary) {
      notes.push(`\n--- Source (${trimmed}) ---\n${r.summary}`);
      fetchNotes.push(`OK: ${trimmed}`);
    } else {
      fetchNotes.push(`Failed (${trimmed}): ${r.error || "empty"}`);
    }
  }
  if (fetchNotes.length) {
    notes.push(`\n--- Fetch log ---\n${fetchNotes.join("\n")}`);
  }
  let combined = notes.join("\n");
  if (combined.length > MAX_CONTEXT_CHARS) {
    combined = combined.slice(0, MAX_CONTEXT_CHARS) + "\n[…truncated…]";
  }
  return combined;
}

async function callLovable(
  apiKey: string,
  systemPrompt: string,
  userContent: string,
): Promise<string> {
  const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    }),
  });
  if (!aiResp.ok) {
    const errText = await aiResp.text();
    console.error("AI error:", aiResp.status, errText);
    const err = new Error(`AI gateway error: ${aiResp.status}`) as Error & { httpStatus?: number };
    err.httpStatus = aiResp.status;
    throw err;
  }
  const aiData = await aiResp.json();
  let rawContent = aiData.choices?.[0]?.message?.content || "";
  return rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
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

  if (!isNoraQuotaExemptEmail(user.email) && isRateLimited(user.id)) {
    return jsonRes({ error: "Too many requests. Please wait a moment." }, 429);
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return jsonRes(
      { error: "Workflow AI is not configured (LOVABLE_API_KEY missing on the function)." },
      503,
    );
  }

  let body: {
    run_id?: string;
    input_text?: string;
    goal?: string;
    tone?: string;
    source_urls?: string[];
  };
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

  const sourceUrls = Array.isArray(body.source_urls)
    ? body.source_urls.filter((u): u is string => typeof u === "string")
    : [];

  const { data: run, error: runErr } = await supabaseUser
    .from("workflow_runs")
    .select("id, user_id, status, template_id")
    .eq("id", runId)
    .single();

  if (runErr || !run || run.user_id !== user.id) {
    return jsonRes({ error: "Forbidden" }, 403);
  }

  if (run.status !== "running") {
    return jsonRes({ error: "Run is not in a runnable state" }, 400);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  if (!isNoraQuotaExemptEmail(user.email)) {
    const billingRow = await fetchBillingRow(supabaseAdmin, user.id);
    if (!isPaidNoraAccess(billingRow)) {
      const { data: runCount, error: cntErr } = await supabaseAdmin.rpc(
        "get_workflow_run_count_this_month",
        { p_user_id: user.id },
      );
      if (cntErr) {
        console.error("get_workflow_run_count_this_month", cntErr);
        return jsonRes({ error: "Could not verify usage." }, 500);
      }
      const n = typeof runCount === "number" ? runCount : 0;
      if (n > FREE_MONTHLY_RUNS) {
        await supabaseAdmin
          .from("workflow_runs")
          .update({ status: "failed", current_step: "quota_exceeded" })
          .eq("id", runId);
        return jsonRes(
          {
            error: "free_tier_exhausted",
            message:
              "You've used all free workflow runs for this calendar month (UTC). Upgrade to Nora Plus or Nora Pro in Settings to continue.",
          },
          429,
        );
      }
    }
  }

  const { data: templateRow } = await supabaseAdmin
    .from("workflow_templates")
    .select("name")
    .eq("id", run.template_id)
    .single();

  const templateName = templateRow?.name || "Content Agent";
  const agentKind = classifyTemplate(templateName);

  const agentId = null;
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

      const minutesSaved = MINUTES_BY_AGENT[agentKind];

      try {
        await updateStep(safeStep(agentKind, "input_received"));
        await new Promise((r) => setTimeout(r, 400));

        let userContent = inputText;

        if (agentKind === "research") {
          await updateStep(safeStep(agentKind, "researching"));
          await new Promise((r) => setTimeout(r, 500));
          userContent = await gatherResearchContext(inputText, sourceUrls);
          await updateStep(safeStep(agentKind, "analyzing"));
          await new Promise((r) => setTimeout(r, 400));
          await updateStep(safeStep(agentKind, "summarizing"));
          await new Promise((r) => setTimeout(r, 350));
        } else if (agentKind === "lead") {
          await updateStep(safeStep(agentKind, "parsing"));
          await new Promise((r) => setTimeout(r, 450));
          await updateStep(safeStep(agentKind, "drafting"));
          await new Promise((r) => setTimeout(r, 450));
          await updateStep(safeStep(agentKind, "personalizing"));
          await new Promise((r) => setTimeout(r, 350));
        } else {
          await updateStep(safeStep(agentKind, "classifying"));
          await new Promise((r) => setTimeout(r, 500));
        }

        if (agentKind === "content") {
          await updateStep(safeStep(agentKind, "generating"));
        }

        let systemPrompt: string;
        let outputRows: Array<{ run_id: string; output_type: string; content: string; position: number }>;

        if (agentKind === "content") {
          systemPrompt = `You are Nora, XenoraAI's content agent for founders. Generate content from the user's raw thought.

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

          const rawContent = await callLovable(LOVABLE_API_KEY, systemPrompt, userContent);
          let parsed: { x_post: string; hooks: string[]; linkedin_post: string; cta: string };
          try {
            parsed = JSON.parse(rawContent);
          } catch {
            throw new Error("Failed to parse AI response as JSON");
          }
          outputRows = [
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
        } else if (agentKind === "lead") {
          systemPrompt = `You are Nora's Lead Follow-up agent. From meeting notes, inbound message, or lead context, produce actionable sales follow-up. The user approves before anything is sent.

Output EXACTLY this JSON (no markdown, no code fences):
{
  "lead_summary": "2-4 sentences: who they are, intent, stage",
  "score_rationale": "Why this lead is warm/cold and what signals matter",
  "reply_draft": "A concise first reply email or DM (professional, ${tone})",
  "follow_up_48h": "What to send ~48h later if they go quiet",
  "objections_to_watch": "Bullet-style string: likely objections and how to handle"
}
${goal ? `Goal: ${goal}` : ""}
Be specific to the user's input. No placeholders like [Name] unless truly unknown — use "there" or omit.`;

          const rawContent = await callLovable(LOVABLE_API_KEY, systemPrompt, userContent);
          let parsed: {
            lead_summary: string;
            score_rationale: string;
            reply_draft: string;
            follow_up_48h: string;
            objections_to_watch: string;
          };
          try {
            parsed = JSON.parse(rawContent);
          } catch {
            throw new Error("Failed to parse AI response as JSON");
          }
          outputRows = [
            { run_id: runId, output_type: "lead_summary", content: parsed.lead_summary, position: 0 },
            { run_id: runId, output_type: "score_rationale", content: parsed.score_rationale, position: 1 },
            { run_id: runId, output_type: "lead_reply_draft", content: parsed.reply_draft, position: 2 },
            { run_id: runId, output_type: "follow_up_48h", content: parsed.follow_up_48h, position: 3 },
            { run_id: runId, output_type: "objections_to_watch", content: parsed.objections_to_watch, position: 4 },
          ];
        } else {
          systemPrompt = `You are Nora's Research agent. You receive user notes and optional fetched thread/page text (may be partial). Extract pain signals, content angles, and relevance for a founder building in public.

Output EXACTLY this JSON (no markdown, no code fences):
{
  "pain_signals": "Markdown bullet list of distinct pain signals",
  "content_angles": "Markdown bullet list of hooks or post angles",
  "quotes_evidence": "Short quotes or paraphrases tied to evidence (or say what was missing)",
  "relevance_score_rationale": "2-4 sentences: how relevant this is to the user's stated goal and why",
  "caveats": "Gaps, bias, or fetch failures the user should know"
}
${goal ? `User goal: ${goal}` : ""}
If sources failed or are thin, say so in caveats and still infer carefully from user notes.`;

          const rawContent = await callLovable(LOVABLE_API_KEY, systemPrompt, userContent);
          let parsed: {
            pain_signals: string;
            content_angles: string;
            quotes_evidence: string;
            relevance_score_rationale: string;
            caveats: string;
          };
          try {
            parsed = JSON.parse(rawContent);
          } catch {
            throw new Error("Failed to parse AI response as JSON");
          }
          outputRows = [
            { run_id: runId, output_type: "pain_signals", content: parsed.pain_signals, position: 0 },
            { run_id: runId, output_type: "content_angles", content: parsed.content_angles, position: 1 },
            { run_id: runId, output_type: "quotes_evidence", content: parsed.quotes_evidence, position: 2 },
            {
              run_id: runId,
              output_type: "relevance_rationale",
              content: parsed.relevance_score_rationale,
              position: 3,
            },
            { run_id: runId, output_type: "research_caveats", content: parsed.caveats, position: 4 },
          ];
        }

        await updateStep(safeStep(agentKind, "formatting"));
        await new Promise((r) => setTimeout(r, 400));

        await supabaseAdmin.from("workflow_outputs").insert(outputRows);

        await supabaseAdmin
          .from("workflow_runs")
          .update({
            current_step: safeStep(agentKind, "done"),
            status: "completed",
            completed_at: new Date().toISOString(),
            estimated_minutes_saved: minutesSaved,
          })
          .eq("id", runId);

        emit({ step: "done", status: "completed", outputs: outputRows });
        emit({ done: true });
      } catch (e) {
        console.error("Workflow error:", e);
        const httpStatus = (e as { httpStatus?: number }).httpStatus;
        let message = e instanceof Error ? e.message : "Unknown error";
        if (httpStatus === 429) {
          message = "Rate limited. Please try again later.";
        } else if (httpStatus === 402) {
          message = "AI credits exhausted. Please try again later.";
        }
        await supabaseAdmin.from("workflow_runs").update({ status: "failed" }).eq("id", runId);

        emit({ error: message, status: "failed" });
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
