/**
 * Accounts that skip the public daily Nora chat cap in the UI (must match edge logic).
 * Optional: VITE_NORA_UNLIMITED_EMAILS=comma@separated.com
 */
const BUILT_IN_EXEMPT: string[] = ['saadkashif2005@gmail.com'];

function envExtra(): string[] {
  const raw = import.meta.env.VITE_NORA_UNLIMITED_EMAILS as string | undefined;
  if (!raw?.trim()) return [];
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

const EXEMPT = new Set<string>([...BUILT_IN_EXEMPT.map((e) => e.toLowerCase()), ...envExtra()]);

export function isNoraQuotaExemptEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return EXEMPT.has(email.trim().toLowerCase());
}
