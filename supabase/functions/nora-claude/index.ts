/**
 * Public Claude proxy for static hosting (GitHub Pages).
 * Secret: set CLAUDE_API_KEY (or ANTHROPIC_API_KEY) with `supabase secrets set`.
 *
 * Browser calls (same contract as vite/plugin-claude-api.ts):
 *   GET  .../functions/v1/nora-claude/claude/health
 *   POST .../functions/v1/nora-claude/claude
 */

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

type AnthropicMessage = { role: "user" | "assistant"; content: string };
type AnthropicResponse = {
  content?: { type: string; text?: string }[];
  error?: { message?: string; type?: string };
};

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }

  const pathname = new URL(req.url).pathname;
  const isHealth = pathname.endsWith("/claude/health");
  const isChat = req.method === "POST" && pathname.endsWith("/claude");

  const apiKey = Deno.env.get("CLAUDE_API_KEY") ?? Deno.env.get("ANTHROPIC_API_KEY");
  const defaultModel =
    Deno.env.get("CLAUDE_MODEL")?.trim() ||
    Deno.env.get("ANTHROPIC_MODEL")?.trim() ||
    DEFAULT_MODEL;

  if (req.method === "GET" && isHealth) {
    return json({ ok: Boolean(apiKey) });
  }

  if (!isChat) {
    return new Response("Not found", { status: 404, headers: corsHeaders() });
  }

  if (!apiKey) {
    return json({ error: "CLAUDE_API_KEY is not set on this function (use supabase secrets set)." }, 503);
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json({ error: "Invalid body" }, 400);
  }

  if (raw.length > 512_000) {
    return json({ error: "Request body too large" }, 413);
  }

  let body: {
    system?: string;
    messages?: { role: string; content: string }[];
    model?: string;
  };
  try {
    body = JSON.parse(raw) as typeof body;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const system = typeof body.system === "string" ? body.system : "";
  const model =
    typeof body.model === "string" && body.model.trim() ? body.model.trim() : defaultModel;
  const rawMsgs = Array.isArray(body.messages) ? body.messages : [];
  const messages: AnthropicMessage[] = rawMsgs
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content ?? "") }));

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      system,
      messages,
      temperature: 0.35,
    }),
  });

  const data = (await anthropicRes.json().catch(() => ({}))) as AnthropicResponse;

  if (!anthropicRes.ok) {
    return json(
      { error: data.error?.message || anthropicRes.statusText || "Anthropic request failed" },
      anthropicRes.status,
    );
  }

  const text =
    data.content?.find((b) => b.type === "text")?.text ??
    data.content?.map((b) => (b.type === "text" ? b.text : "")).join("") ??
    "";

  if (!text.trim()) {
    return json({ error: "Empty response from Claude" }, 502);
  }

  return json({ content: text });
});
