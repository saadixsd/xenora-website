import type { GitHubCandidateBundle } from '@/lib/talentgraph/github';

export type TasteProfile = {
  primaryLanguages?: string[];
  signals?: string[];
  locationPreference?: string;
  senioritySignals?: string[];
  avoidSignals?: string[];
  searchQuery?: string;
};

export type ScoredCandidate = {
  user: GitHubCandidateBundle['user'];
  topRepos: GitHubCandidateBundle['topRepos'];
  languages: GitHubCandidateBundle['languages'];
  totalStars: GitHubCandidateBundle['totalStars'];

  score?: number;
  skillsScore?: number;
  outputScore?: number;
  vibeScore?: number;
  whyThisOne?: string;
  redFlags?: string[];
  verdict?: string;
};

const EDGE_FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/talentgraph`;

function errorFromJson(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const maybe = (data as { error?: unknown }).error;
  return typeof maybe === 'string' && maybe.trim() ? maybe : null;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${EDGE_FN_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(errorFromJson(data) || res.statusText || 'Request failed');
  return data as T;
}

export async function buildTasteProfile(exemplars: GitHubCandidateBundle[]): Promise<TasteProfile> {
  return await postJson<TasteProfile>('/taste', { exemplars });
}

export async function scoreCandidate(taste: TasteProfile, candidate: GitHubCandidateBundle): Promise<ScoredCandidate> {
  return await postJson<ScoredCandidate>('/score', { taste, candidate });
}

