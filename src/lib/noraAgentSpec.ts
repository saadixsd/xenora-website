/** Parsed from assistant message when Nora finishes the agent-design interview. */
export type NoraAgentSpec = {
  name: string;
  mission: string;
  target_user: string;
  raw_inputs: string;
  output_deliverables: string;
  guardrails: string;
  starter_prompt: string;
  interview_summary: string;
};

export function extractNoraAgentSpec(text: string): NoraAgentSpec | null {
  const m = text.match(/```nora-agent-spec\s*([\s\S]*?)```/i);
  if (!m) return null;
  try {
    const o = JSON.parse(m[1].trim()) as Record<string, unknown>;
    if (typeof o.name !== 'string' || typeof o.mission !== 'string') return null;
    return {
      name: o.name,
      mission: o.mission,
      target_user: String(o.target_user ?? ''),
      raw_inputs: String(o.raw_inputs ?? ''),
      output_deliverables: String(o.output_deliverables ?? ''),
      guardrails: String(o.guardrails ?? ''),
      starter_prompt: String(o.starter_prompt ?? ''),
      interview_summary: String(o.interview_summary ?? ''),
    };
  } catch {
    return null;
  }
}
