// Domain helpers for lead status + label formatting used across admin pages.

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
export type LeadSource = 'contact_form' | 'audit_request' | 'waitlist_convert' | 'manual';

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  won: 'Won',
  lost: 'Lost',
};

export const STATUS_TONE: Record<LeadStatus, string> = {
  new: 'bg-primary/15 text-primary ring-1 ring-primary/30',
  contacted: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
  qualified: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30',
  won: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
  lost: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30',
};

export const SOURCE_LABEL: Record<string, string> = {
  contact_form: 'Contact form',
  audit_request: 'Audit request',
  waitlist_convert: 'Waitlist',
  manual: 'Manual',
};

/**
 * Placeholder for the future Claude/GPT lead summary call.
 * TODO: wire to an edge function that posts to Claude with the lead's notes
 * + activity history and returns a structured summary.
 */
export async function generateLeadSummary(_leadId: string): Promise<string> {
  // TODO: replace with a call to a `lead-summary` edge function.
  return 'Xenora AI Summary will appear here once enabled. It will pull the lead\'s context, notes, and activity to suggest the next best action.';
}
