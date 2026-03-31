/**
 * Claude proxy for Nora chat. Rate-limited, model-locked.
 *
 * Routes:
 *   GET  .../functions/v1/nora-claude/claude/health
 *   POST .../functions/v1/nora-claude/claude
 */

const ALLOWED_MODEL = "claude-sonnet-4-20250514";
const MAX_BODY_BYTES = 128_000;
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 8_000;

// Simple in-memory rate limiter (per-IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

type AnthropicMessage = { role: "user" | "assistant"; content: string };
type AnthropicResponse = {
  content?: { type: string; text?: string }[];
  error?: { message?: string; type?: string };
};

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

  const apiKey =
    Deno.env.get("CLAUDE_API_KEY") ?? Deno.env.get("ANTHROPIC_API_KEY");

  if (req.method === "GET" && isHealth) {
    return json({ ok: Boolean(apiKey) });
  }

  if (!isChat) {
    return new Response("Not found", { status: 404, headers: corsHeaders() });
  }

  // Rate limiting
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  if (isRateLimited(clientIp)) {
    return json({ error: "Too many requests. Please wait a moment." }, 429);
  }

  if (!apiKey) {
    return json(
      { error: "AI backend is not configured." },
      503,
    );
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json({ error: "Invalid body" }, 400);
  }

  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: "Request too large" }, 413);
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

  // Lock model — don't let callers pick arbitrary models
  const model = ALLOWED_MODEL;

  const system = typeof body.system === "string" ? body.system.slice(0, 4000) : "";

  const rawMsgs = Array.isArray(body.messages) ? body.messages.slice(0, MAX_MESSAGES) : [];
  const messages: AnthropicMessage[] = rawMsgs
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content ?? "").slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (messages.length === 0) {
    return json({ error: "At least one message is required" }, 400);
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages,
      temperature: 0.35,
    }),
  });

  const data = (await anthropicRes.json().catch(() => ({}))) as AnthropicResponse;

  if (!anthropicRes.ok) {
    // Don't leak upstream error details to client
    console.error("Anthropic error:", data.error?.message);
    return json({ error: "AI request failed. Please try again." }, 502);
  }

  const text =
    data.content?.find((b) => b.type === "text")?.text ??
    data.content?.map((b) => (b.type === "text" ? b.text : "")).join("") ??
    "";

  if (!text.trim()) {
    return json({ error: "Empty response from AI" }, 502);
  }

  return json({ content: text });
});
