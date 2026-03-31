/**
 * TalentGraph demo API (public, hardened).
 *
 * Endpoints:
 *   GET  /taste/health
 *   POST /taste   { exemplars: GitHubCandidateBundle[] } -> TasteProfile (JSON)
 *   POST /score   { taste: TasteProfile, candidate: GitHubCandidateBundle } -> ScoredCandidate (JSON)
 *
 * Security layers (mirrors nora-claude):
 *   1) Origin allowlist
 *   2) In-memory per-IP rate limiting
 *   3) Body size caps
 *   4) Server-side prompts + locked model
 */

const ALLOWED_MODEL = "claude-sonnet-4-20250514";
const MAX_BODY_BYTES = 96_000;
const MAX_EXEMPLARS = 5;
const MAX_CANDIDATE_REPOS = 12;

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
  return ALLOWED_ORIGINS.includes(origin);
}

// --- Rate limiting (per-IP) ---
const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number; dailyCount: number; dailyResetAt: number }
>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 4; // tighter: expensive endpoint
const DAILY_LIMIT = 25;
const DAY_MS = 86_400_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now > entry.dailyResetAt) {
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS, dailyCount: 1, dailyResetAt: now + DAY_MS };
    rateLimitMap.set(ip, entry);
    return false;
  }

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  } else {
    entry.count++;
  }

  entry.dailyCount++;
  return entry.count > RATE_LIMIT_MAX || entry.dailyCount > DAILY_LIMIT;
}

function corsHeaders(origin?: string | null): HeadersInit {
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

type GitHubUser = {
  login: string;
  name?: string | null;
  bio?: string | null;
  location?: string | null;
  followers?: number | null;
  public_repos?: number | null;
};

type GitHubRepo = {
  name: string;
  html_url: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number | null;
  pushed_at?: string | null;
};

type GitHubCandidateBundle = {
  user: GitHubUser;
  topRepos: GitHubRepo[];
  languages: string[];
  totalStars: number;
};

type TasteProfile = {
  primaryLanguages?: string[];
  signals?: string[];
  locationPreference?: string;
  senioritySignals?: string[];
  avoidSignals?: string[];
  searchQuery?: string;
};

type ScoredCandidate = {
  score?: number;
  skillsScore?: number;
  outputScore?: number;
  vibeScore?: number;
  whyThisOne?: string;
  redFlags?: string[];
  verdict?: string;
};

type AnthropicMessage = { role: "user" | "assistant"; content: string };
type AnthropicResponse = {
  content?: { type: string; text?: string }[];
  error?: { message?: string; type?: string };
};

function sanitizeBundle(bundle: GitHubCandidateBundle): GitHubCandidateBundle {
  return {
    user: {
      login: String(bundle.user?.login ?? ""),
      name: bundle.user?.name ?? null,
      bio: bundle.user?.bio ?? null,
      location: bundle.user?.location ?? null,
      followers: typeof bundle.user?.followers === "number" ? bundle.user.followers : null,
      public_repos: typeof bundle.user?.public_repos === "number" ? bundle.user.public_repos : null,
    },
    topRepos: Array.isArray(bundle.topRepos)
      ? bundle.topRepos.slice(0, MAX_CANDIDATE_REPOS).map((r) => ({
          name: String(r?.name ?? ""),
          html_url: String(r?.html_url ?? ""),
          description: r?.description ?? null,
          language: r?.language ?? null,
          stargazers_count: typeof r?.stargazers_count === "number" ? r.stargazers_count : null,
          pushed_at: r?.pushed_at ?? null,
        }))
      : [],
    languages: Array.isArray(bundle.languages) ? bundle.languages.slice(0, 12).map((l) => String(l)) : [],
    totalStars: typeof bundle.totalStars === "number" ? bundle.totalStars : 0,
  };
}

function tastePrompt(exemplars: GitHubCandidateBundle[]): string {
  return `You are TalentGraph. You will be given 3-5 exemplar developer profiles (GitHub user + top repos).

Task: infer a hiring "taste profile" describing what these exemplars have in common, and output ONLY strict JSON matching this schema:
{
  "primaryLanguages": string[],
  "signals": string[],
  "locationPreference": string,
  "senioritySignals": string[],
  "avoidSignals": string[],
  "searchQuery": string
}

Rules:
- Return JSON only. No markdown.
- Keep arrays short (max 8 each).
- Make searchQuery optimized for GitHub user search (short, keyword-like).

Exemplars:
${JSON.stringify(exemplars, null, 2)}
`;
}

function scorePrompt(taste: TasteProfile, candidate: GitHubCandidateBundle): string {
  return `You are TalentGraph. Score a candidate against a taste profile.

Return ONLY strict JSON matching this schema:
{
  "score": number,
  "skillsScore": number,
  "outputScore": number,
  "vibeScore": number,
  "whyThisOne": string,
  "redFlags": string[],
  "verdict": string
}

Rules:
- score is 0-100.
- Keep whyThisOne under 180 chars.
- redFlags max 5.

TasteProfile:
${JSON.stringify(taste, null, 2)}

Candidate:
${JSON.stringify(candidate, null, 2)}
`;
}

async function anthropic(system: string, messages: AnthropicMessage[], apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ALLOWED_MODEL,
      max_tokens: 1800,
      system,
      messages,
      temperature: 0.2,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as AnthropicResponse;
  if (!res.ok) {
    console.error("Anthropic error:", data.error?.message);
    throw new Error("AI request failed");
  }

  const text =
    data.content?.find((b) => b.type === "text")?.text ??
    data.content?.map((b) => (b.type === "text" ? b.text : "")).join("") ??
    "";
  return text;
}

function parseJsonOrThrow<T>(raw: string): T {
  const trimmed = raw.trim();
  // Claude sometimes wraps JSON in ```; strip if present.
  const unwrapped = trimmed.startsWith("```")
    ? trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim()
    : trimmed;
  return JSON.parse(unwrapped) as T;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  const pathname = new URL(req.url).pathname;
  const isHealth = req.method === "GET" && pathname.endsWith("/taste/health");
  const isTaste = req.method === "POST" && pathname.endsWith("/taste");
  const isScore = req.method === "POST" && pathname.endsWith("/score");

  if (isHealth) {
    const hasKey = Boolean(Deno.env.get("CLAUDE_API_KEY") ?? Deno.env.get("ANTHROPIC_API_KEY"));
    return json({ ok: hasKey }, 200, origin);
  }

  if (!isTaste && !isScore) {
    return new Response("Not found", { status: 404, headers: corsHeaders(origin) });
  }

  if (!isOriginAllowed(origin)) {
    return json({ error: "Forbidden" }, 403, origin);
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  if (isRateLimited(clientIp)) {
    return json({ error: "Too many requests. Please wait a moment." }, 429, origin);
  }

  const apiKey = Deno.env.get("CLAUDE_API_KEY") ?? Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "AI backend is not configured." }, 503, origin);

  let raw = "";
  try {
    raw = await req.text();
  } catch {
    return json({ error: "Invalid body" }, 400, origin);
  }

  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: "Request too large" }, 413, origin);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw) as unknown;
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  try {
    if (isTaste) {
      const exemplarsRaw = Array.isArray((body as { exemplars?: unknown }).exemplars)
        ? ((body as { exemplars?: unknown }).exemplars as unknown[]).slice(0, MAX_EXEMPLARS)
        : [];
      const exemplars = exemplarsRaw.map((b) => sanitizeBundle(b as GitHubCandidateBundle));
      if (exemplars.length < 3) return json({ error: "Provide 3 exemplars." }, 400, origin);

      const system = "You generate hiring taste profiles as strict JSON.";
      const prompt = tastePrompt(exemplars);
      const text = await anthropic(system, [{ role: "user", content: prompt }], apiKey);
      const taste = parseJsonOrThrow<TasteProfile>(text);

      return json(taste, 200, origin);
    }

    // score
    const taste = ((body as { taste?: unknown }).taste ?? {}) as TasteProfile;
    const candidate = sanitizeBundle((body as { candidate?: unknown }).candidate as GitHubCandidateBundle);
    if (!candidate.user?.login) return json({ error: "Candidate is required." }, 400, origin);

    const system = "You score candidates and return strict JSON only.";
    const prompt = scorePrompt(taste, candidate);
    const text = await anthropic(system, [{ role: "user", content: prompt }], apiKey);
    const scored = parseJsonOrThrow<ScoredCandidate>(text);

    return json(
      {
        ...candidate,
        ...scored,
      },
      200,
      origin,
    );
  } catch (e) {
    console.error("TalentGraph error:", e);
    return json({ error: "AI request failed. Please try again." }, 502, origin);
  }
});

