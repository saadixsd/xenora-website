/** Founder / internal accounts: skip public daily caps (case-insensitive). */
const BUILT_IN_EXEMPT = ["saadkashif2005@gmail.com"];

export function noraQuotaExemptEmails(): Set<string> {
  const set = new Set(BUILT_IN_EXEMPT.map((e) => e.toLowerCase()));
  const fromEnv = Deno.env.get("NORA_UNLIMITED_EMAILS") ?? "";
  for (const part of fromEnv.split(",")) {
    const t = part.trim().toLowerCase();
    if (t) set.add(t);
  }
  return set;
}

export function isNoraQuotaExemptEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return noraQuotaExemptEmails().has(email.trim().toLowerCase());
}
