import { supabase } from '@/integrations/supabase/client';

/**
 * Builds a compact, privacy-safe summary of the signed-in user's agents,
 * recent workflow runs, and output samples so Ask Nora can answer
 * questions like "what's been going well with my agents?" with real data.
 *
 * Hard-capped to ~1800 chars to fit inside the edge function's
 * 2000-char client_context budget after the route prefix.
 */
export async function buildNoraPersonalContext(userId: string): Promise<string> {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [agentsRes, runsRes] = await Promise.all([
      supabase
        .from('user_custom_agents' as any)
        .select('name, mission, output_deliverables, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('workflow_runs' as any)
        .select('id, template_id, status, current_step, goal, estimated_minutes_saved, created_at, completed_at')
        .eq('user_id', userId)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit: undefined as never,
    ]);

    // Re-query runs cleanly (the limit chain above is intentionally split for clarity)
    const runs = await supabase
      .from('workflow_runs' as any)
      .select('id, template_id, status, current_step, goal, estimated_minutes_saved, created_at, completed_at')
      .eq('user_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(15);

    const templates = await supabase
      .from('workflow_templates' as any)
      .select('id, name')
      .limit(50);
    const tmplMap = new Map<string, string>();
    (templates.data ?? []).forEach((t: any) => tmplMap.set(t.id, t.name));

    const agents = (agentsRes.data ?? []) as any[];
    const runRows = (runs.data ?? []) as any[];

    const total = runRows.length;
    const completed = runRows.filter((r) => r.status === 'completed').length;
    const failed = runRows.filter((r) => r.status === 'failed' || r.status === 'error').length;
    const minutesSaved = runRows.reduce((s, r) => s + (Number(r.estimated_minutes_saved) || 0), 0);

    const byTemplate = new Map<string, { runs: number; minutes: number; completed: number }>();
    for (const r of runRows) {
      const name = tmplMap.get(r.template_id) || 'Workflow';
      const cur = byTemplate.get(name) || { runs: 0, minutes: 0, completed: 0 };
      cur.runs += 1;
      cur.minutes += Number(r.estimated_minutes_saved) || 0;
      if (r.status === 'completed') cur.completed += 1;
      byTemplate.set(name, cur);
    }

    // Pull a small sample of recent outputs for the most active template
    const topTemplateRunIds = runRows
      .filter((r) => r.status === 'completed')
      .slice(0, 3)
      .map((r) => r.id);

    let recentOutputs: any[] = [];
    if (topTemplateRunIds.length) {
      const { data } = await supabase
        .from('workflow_outputs' as any)
        .select('output_type, content, run_id')
        .in('run_id', topTemplateRunIds)
        .order('position', { ascending: true })
        .limit(8);
      recentOutputs = data ?? [];
    }

    const lines: string[] = [];
    lines.push('## User personal data (signed-in account)');
    lines.push(
      `Last 30 days: ${total} run(s), ${completed} completed, ${failed} failed, ~${minutesSaved} min saved.`,
    );

    if (byTemplate.size) {
      lines.push('Per workflow:');
      for (const [name, v] of byTemplate.entries()) {
        const rate = v.runs ? Math.round((v.completed / v.runs) * 100) : 0;
        lines.push(`- ${name}: ${v.runs} runs, ${v.completed} completed (${rate}%), ~${v.minutes} min saved`);
      }
    } else {
      lines.push('No workflow runs yet in the last 30 days.');
    }

    if (agents.length) {
      lines.push('Custom agents:');
      for (const a of agents) {
        const mission = (a.mission || '').replace(/\s+/g, ' ').slice(0, 120);
        lines.push(`- ${a.name}${mission ? ` — ${mission}` : ''}`);
      }
    } else {
      lines.push('No custom agents saved.');
    }

    if (recentOutputs.length) {
      lines.push('Recent output samples:');
      for (const o of recentOutputs.slice(0, 5)) {
        const snippet = String(o.content || '').replace(/\s+/g, ' ').slice(0, 140);
        lines.push(`- (${o.output_type}) ${snippet}`);
      }
    }

    lines.push(
      'Use this data to answer questions like "what is going well with my agents", "which workflow saves me the most time", or "summarize my recent runs". Be specific and cite numbers from above. Do not invent data not listed here.',
    );

    return lines.join('\n').slice(0, 1800);
  } catch (err) {
    console.error('buildNoraPersonalContext failed', err);
    return '';
  }
}
