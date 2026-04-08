/**
 * Canonical paths for marketing + app navigation.
 * Import from here instead of scattering string literals.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  faq: '/faq',
  privacy: '/privacy',
  login: '/login',
  signup: '/signup',
  authCallback: '/auth/callback',
  tryNora: '/try-nora',
  dashboard: {
    root: '/dashboard',
    nora: '/dashboard/nora',
    noraAgentBuilder: '/dashboard/nora?mode=builder',
    runNew: '/dashboard/run/new',
    history: '/dashboard/history',
    settings: '/dashboard/settings',
    connections: '/dashboard/connections',
    agents: {
      manage: '/dashboard/agents/manage',
      content: '/dashboard/agents/content',
      lead: '/dashboard/agents/lead',
      research: '/dashboard/agents/research',
    },
  },
} as const;

export function agentEditPath(agentId: string) {
  return `/dashboard/agents/${agentId}/edit`;
}

/** Link to an existing workflow run detail page. */
export function dashboardRunPath(runId: string) {
  return `${ROUTES.dashboard.root}/run/${runId}`;
}

/** Marketing header: in-app routes + home hashes (handled in SiteNav). */
export const MARKETING_NAV = [
  { label: 'Home', to: ROUTES.home },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'About', to: ROUTES.about },
  { label: 'FAQ', to: ROUTES.faq },
] as const;
