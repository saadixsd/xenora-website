import { ROUTES } from '@/config/routes';

/**
 * Short description of where the user is in the app, sent with Ask Nora requests
 * so the model can tailor examples (no PII; path only).
 */
export function describeNoraAppRoute(pathname: string): string {
  if (!pathname.startsWith('/dashboard')) {
    return 'Context: marketing or auth page (not inside the signed-in dashboard).';
  }

  if (pathname === ROUTES.dashboard.root || pathname === `${ROUTES.dashboard.root}/`) {
    return 'Context: dashboard home (Command Center) — metrics, agents, activity feed.';
  }
  if (pathname === ROUTES.dashboard.nora) {
    return 'Context: Ask Nora chat (product Q&A or agent builder, depending on mode).';
  }
  if (pathname.startsWith(`${ROUTES.dashboard.root}/agents/manage`)) {
    return 'Context: Manage agents list.';
  }
  if (/\/agents\/[^/]+\/edit$/.test(pathname)) {
    return 'Context: editing a saved agent (prompt, tone, tools).';
  }
  const agentMatch = pathname.match(/^\/dashboard\/agents\/([^/]+)$/);
  if (agentMatch) {
    const slug = agentMatch[1];
    return `Context: agent workspace for "${slug}" — run workflows and view logs for this agent.`;
  }
  if (pathname.startsWith(`${ROUTES.dashboard.root}/run/`)) {
    return 'Context: workflow run detail — timeline, inputs, outputs; user may be reviewing or approving.';
  }
  if (pathname === ROUTES.dashboard.history) {
    return 'Context: History — past workflow runs and Ask Nora threads.';
  }
  if (pathname === ROUTES.dashboard.settings) {
    return 'Context: Settings — profile and preferences.';
  }
  if (pathname === ROUTES.dashboard.connections) {
    return 'Context: Connections — integrations status.';
  }

  return `Context: dashboard route ${pathname}.`;
}
