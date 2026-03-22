export type NeuralNodeId =
  | 'platform'
  | 'how'
  | 'pricing'
  | 'docs'
  | 'enterprise'
  | 'start';

export const NEURAL_NODES: {
  id: NeuralNodeId;
  label: string;
  sectionId: string;
  shape: 'teardrop' | 'prism' | 'triangle';
}[] = [
  { id: 'platform', label: 'Platform', sectionId: 'nora-platform', shape: 'teardrop' },
  { id: 'how', label: 'How Nora Works', sectionId: 'how-nora-works', shape: 'prism' },
  { id: 'pricing', label: 'Pricing', sectionId: 'pricing', shape: 'triangle' },
  { id: 'docs', label: 'Docs', sectionId: 'docs', shape: 'teardrop' },
  { id: 'enterprise', label: 'Enterprise', sectionId: 'enterprise', shape: 'prism' },
  { id: 'start', label: 'Get Started', sectionId: 'get-started', shape: 'triangle' },
];

export const SECTION_IDS = NEURAL_NODES.map((n) => n.sectionId);

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
