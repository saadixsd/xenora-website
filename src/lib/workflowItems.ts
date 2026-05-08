/**
 * Shared types + helpers for the persistent `workflow_items` table introduced in
 * Phase 2 of the agentic workspace. Centralised here so the board, detail drawer,
 * capture panel, and follow-ups page agree on stage ordering and labels.
 */

export type WorkflowItemType = 'post' | 'reply' | 'idea' | 'research_note' | 'follow_up';
export type WorkflowItemStage = 'idea' | 'drafting' | 'review' | 'ready' | 'sent' | 'archived';

export interface WorkflowItem {
  id: string;
  user_id: string;
  run_id: string | null;
  source_output_id: string | null;
  type: WorkflowItemType;
  stage: WorkflowItemStage;
  title: string | null;
  input_text: string | null;
  ai_draft: string | null;
  platform: string | null;
  due_date: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export const STAGE_ORDER: WorkflowItemStage[] = ['idea', 'drafting', 'review', 'ready', 'sent'];

export const STAGE_LABEL: Record<WorkflowItemStage, string> = {
  idea: 'Ideas',
  drafting: 'Drafting',
  review: 'Review',
  ready: 'Ready',
  sent: 'Sent',
  archived: 'Archived',
};

export const STAGE_HELP: Record<WorkflowItemStage, string> = {
  idea: 'Captured thoughts Nora has not started on yet.',
  drafting: 'Nora is generating or refining a draft.',
  review: 'Awaiting your approval before it leaves.',
  ready: 'Approved and ready to send or use.',
  sent: 'Marked as sent or published.',
  archived: 'Hidden from the board.',
};

export const TYPE_LABEL: Record<WorkflowItemType, string> = {
  post: 'Post',
  reply: 'Reply',
  idea: 'Idea',
  research_note: 'Research note',
  follow_up: 'Follow-up',
};

/** Returns the stage that comes after `stage`, or null if it's the terminal stage. */
export function nextStage(stage: WorkflowItemStage): WorkflowItemStage | null {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}
