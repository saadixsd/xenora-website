export type GitHubUser = {
  login: string;
  name?: string | null;
  bio?: string | null;
  location?: string | null;
  followers?: number | null;
  following?: number | null;
  public_repos?: number | null;
  avatar_url?: string | null;
};

export type GitHubRepo = {
  name: string;
  html_url: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number | null;
  forks_count?: number | null;
  pushed_at?: string | null;
};

export type GitHubCandidateBundle = {
  user: GitHubUser;
  topRepos: GitHubRepo[];
  languages: string[];
  totalStars: number;
};

const GITHUB_API = 'https://api.github.com';

function uniqStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

type GitHubUserApi = {
  login?: unknown;
  name?: unknown;
  bio?: unknown;
  location?: unknown;
  followers?: unknown;
  following?: unknown;
  public_repos?: unknown;
  avatar_url?: unknown;
};

type GitHubRepoApi = {
  name?: unknown;
  html_url?: unknown;
  description?: unknown;
  language?: unknown;
  stargazers_count?: unknown;
  forks_count?: unknown;
  pushed_at?: unknown;
};

type GitHubSearchUsersApi = {
  items?: unknown;
};

export function normalizeGitHubHandleOrUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Handle @user
  const at = raw.startsWith('@') ? raw.slice(1) : raw;

  // Handle URL forms
  if (/^https?:\/\//i.test(at)) {
    try {
      const url = new URL(at);
      if (url.hostname !== 'github.com') return null;
      const parts = url.pathname.split('/').filter(Boolean);
      const username = parts[0];
      if (!username) return null;
      return username;
    } catch {
      return null;
    }
  }

  // Handle plain username
  if (!/^[A-Za-z0-9-]{1,39}$/.test(at)) return null;
  return at;
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const u = await gh<GitHubUserApi>(`/users/${encodeURIComponent(username)}`);
  return {
    login: typeof u.login === 'string' && u.login.trim() ? u.login : username,
    name: typeof u.name === 'string' ? u.name : null,
    bio: typeof u.bio === 'string' ? u.bio : null,
    location: typeof u.location === 'string' ? u.location : null,
    followers: typeof u.followers === 'number' ? u.followers : null,
    following: typeof u.following === 'number' ? u.following : null,
    public_repos: typeof u.public_repos === 'number' ? u.public_repos : null,
    avatar_url: typeof u.avatar_url === 'string' ? u.avatar_url : null,
  };
}

export async function fetchTopRepos(username: string, perPage = 10): Promise<GitHubRepo[]> {
  const repos = await gh<GitHubRepoApi[]>(
    `/users/${encodeURIComponent(username)}/repos?sort=stars&per_page=${Math.max(1, Math.min(25, perPage))}`,
  );
  return repos.map((r) => ({
    name: typeof r.name === 'string' ? r.name : '',
    html_url: typeof r.html_url === 'string' ? r.html_url : `https://github.com/${username}`,
    description: typeof r.description === 'string' ? r.description : null,
    language: typeof r.language === 'string' ? r.language : null,
    stargazers_count: typeof r.stargazers_count === 'number' ? r.stargazers_count : null,
    forks_count: typeof r.forks_count === 'number' ? r.forks_count : null,
    pushed_at: typeof r.pushed_at === 'string' ? r.pushed_at : null,
  }));
}

export async function fetchGitHubCandidateBundle(usernameOrUrlOrHandle: string): Promise<GitHubCandidateBundle> {
  const username = normalizeGitHubHandleOrUrl(usernameOrUrlOrHandle);
  if (!username) throw new Error('Invalid GitHub handle/URL.');

  const [user, topRepos] = await Promise.all([fetchGitHubUser(username), fetchTopRepos(username, 10)]);
  const languages = uniqStrings(topRepos.map((r) => r.language || '').filter(Boolean));
  const totalStars = topRepos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

  return { user, topRepos, languages, totalStars };
}

export async function searchGitHubUserLogins(query: string, count = 20): Promise<string[]> {
  const q = query.trim();
  if (!q) return [];

  // Keep query simple; public unauth'd search is rate-limited.
  const search = await gh<GitHubSearchUsersApi>(
    `/search/users?q=${encodeURIComponent(q)}&sort=followers&order=desc&per_page=${Math.max(1, Math.min(30, count))}`,
  );

  const items = Array.isArray(search.items) ? search.items : [];
  return items
    .map((u) => (typeof (u as { login?: unknown }).login === 'string' ? String((u as { login?: unknown }).login) : ''))
    .filter(Boolean);
}

