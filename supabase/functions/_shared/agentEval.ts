/**
 * PatternLoop-style evaluate → adapt → retry for Nora workflow runs.
 */
import {
  type AgentKind,
  AGENT_PROMPTS,
  buildEvaluatorUserMessage,
  outputsPassKeywordCheck,
} from "./agentPrompts.ts";

const EVAL_PASS_THRESHOLD = 0.65;

export function parseEvalScore(text: string): { score: number; reason: string } {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return { score: 0, reason: "no JSON in evaluator output" };
    const obj = JSON.parse(m[0]) as { score?: unknown; reason?: unknown };
    const score = typeof obj.score === "number" ? obj.score : Number(obj.score);
    const reason = typeof obj.reason === "string" ? obj.reason : "";
    if (Number.isNaN(score)) return { score: 0, reason: "invalid score" };
    return { score: Math.max(0, Math.min(1, score)), reason };
  } catch {
    return { score: 0, reason: "unparseable evaluator output" };
  }
}

export function shouldRetryGeneration(
  kind: AgentKind,
  serializedOutput: string,
  evalScore: number,
): boolean {
  if (evalScore >= EVAL_PASS_THRESHOLD && outputsPassKeywordCheck(kind, serializedOutput)) {
    return false;
  }
  return true;
}

export function adaptationHint(reason: string, kind: AgentKind): string {
  const keywords = AGENT_PROMPTS[kind].successKeywords.join(", ");
  return [
    "Your previous JSON output did not pass quality checks.",
    reason ? `Evaluator: ${reason}` : "",
    keywords ? `Ensure the JSON includes these concepts/fields: ${keywords}.` : "",
    "Return ONLY valid JSON matching the required schema. No markdown fences.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function evaluatorSystemPrompt(kind: AgentKind): string {
  return `${AGENT_PROMPTS[kind].evaluatorPrompt}

You are scoring a structured JSON workflow output (not markdown). Reply with JSON only: {"score":0.0-1.0,"reason":"..."}`;
}

export { buildEvaluatorUserMessage, outputsPassKeywordCheck, EVAL_PASS_THRESHOLD };
