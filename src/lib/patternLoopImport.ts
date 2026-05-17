import { unzipSync, strFromU8 } from 'fflate';
import yaml from 'yaml';

export type ParsedLoopSpec = {
  name: string;
  mission: string;
  starter_prompt: string;
  target_user: string;
  raw_inputs: string;
  output_deliverables: string;
  guardrails: string;
  interview_summary: string;
  pattern_name: string;
  loopspec_hash: string;
};

function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  return crypto.subtle.digest('SHA-256', data).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
  );
}

function mapSpecToAgentFields(spec: Record<string, unknown>, loopspecHash: string): ParsedLoopSpec {
  const name = String(spec.name ?? 'imported_pattern');
  const system = String(spec.system_prompt ?? '').trim();
  const planner = String(spec.planner_prompt ?? '').trim();
  const goalTemplate = String(spec.goal_template ?? '{goal}').trim();
  const metaDesc = String((spec.meta as Record<string, unknown> | undefined)?.description ?? '').trim();
  const keywords = Array.isArray((spec.success as Record<string, unknown> | undefined)?.keywords)
    ? ((spec.success as Record<string, unknown>).keywords as string[]).join(', ')
    : '';

  return {
    name: name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    mission: metaDesc || goalTemplate.replace('{goal}', '').trim() || `Run the ${name} pattern.`,
    starter_prompt: [goalTemplate.includes('{goal}') ? goalTemplate : `Goal: {goal}\n${goalTemplate}`, planner]
      .filter(Boolean)
      .join('\n\n')
      .slice(0, 4000),
    target_user: 'Founders and SMB operators using Nora',
    raw_inputs: 'Notes, pasted context, optional URLs (Research agent)',
    output_deliverables: keywords
      ? `Pattern success signals: ${keywords}`
      : 'Structured workflow outputs in the Nora dashboard',
    guardrails: [
      system,
      'Outputs are staged for human review before publish or send.',
      'Do not claim live integrations unless enabled in Connections.',
    ]
      .filter(Boolean)
      .join('\n')
      .slice(0, 4000),
    interview_summary: `Imported from PatternLoop LoopSpec "${name}".`.slice(0, 8000),
    pattern_name: name,
    loopspec_hash: loopspecHash,
  };
}

export async function parseLoopSpecYaml(text: string): Promise<ParsedLoopSpec> {
  const spec = yaml.parse(text) as Record<string, unknown>;
  const hash = await sha256Hex(text);
  return mapSpecToAgentFields(spec, hash);
}

/** Parse a PatternLoop `.agent` zip (loopspec.yaml inside). */
export async function parseAgentBundle(file: File): Promise<ParsedLoopSpec> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const entries = unzipSync(buf);
  const yamlBytes = entries['loopspec.yaml'];
  if (!yamlBytes) {
    throw new Error('Invalid .agent bundle: missing loopspec.yaml');
  }
  const raw = strFromU8(yamlBytes);
  return parseLoopSpecYaml(raw);
}

export async function parseLoopSpecFile(file: File): Promise<ParsedLoopSpec> {
  const raw = await file.text();
  return parseLoopSpecYaml(raw);
}
