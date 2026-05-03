/**
 * Canonical paths for marketing navigation.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  faq: '/faq',
  privacy: '/privacy',
} as const;

/** Marketing header navigation. */
export const MARKETING_NAV = [
  { label: 'Home', to: ROUTES.home },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'About', to: ROUTES.about },
  { label: 'FAQ', to: ROUTES.faq },
] as const;
