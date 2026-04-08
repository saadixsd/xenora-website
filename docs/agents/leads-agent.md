# Leads Agent

## Purpose

Continuously classify inbound messages (email, DMs, form submissions), summarize each in one sentence, draft personalized replies, and queue follow-ups. Nothing sends without the founder's explicit approval.

## Connected APIs

| Platform | API           | Scopes                        |
|----------|---------------|-------------------------------|
| Gmail    | Gmail API v1  | `gmail.readonly`, `gmail.send`|

## Email Classification

Every new email is classified into one of four categories using a Claude prompt:

| Category       | Action                                          |
|----------------|------------------------------------------------|
| `lead`         | Score, summarize, draft reply, queue follow-up  |
| `reply-needed` | Summarize, draft reply                          |
| `newsletter`   | Archive, no action                              |
| `spam`         | Archive, no action                              |

System prompt for classification:

```
You are the Leads Agent. Classify this email into exactly one category:
lead, reply-needed, newsletter, spam.

For leads and reply-needed: summarize in one sentence, draft a reply in
{tone} tone, and note any time-sensitive details.

For leads specifically: score warmth (cold/warm/hot) based on signals like
specificity of ask, company size, urgency language, prior interaction history.
```

## Summary Format

One sentence per email. Examples:
- "Warm lead from Sarah at Acme (Series A) asking about enterprise pricing with a Q2 deadline."
- "Reply needed: investor update request from existing backer, due Friday."

## 48-Hour Follow-up Timer

When a lead reply is approved and sent, a follow-up timer starts:

- Stored as a `feed_items` row with `action_type = 'approve'` and `action_payload`:
  ```json
  {
    "follow_up_at": "2026-04-11T14:00:00Z",
    "original_message_id": "gmail_msg_abc123",
    "draft_follow_up": "Following up on my note from Tuesday..."
  }
  ```
- A Supabase cron job (pg_cron or edge function) checks for overdue follow-ups every hour.

## Approval State Machine

```
queued --> approved --> sent
queued --> dismissed
queued --> (24h no action) --> reminder feed item
queued --> (72h no action) --> auto-dismissed
```

States stored in `feed_items.action_payload.approval_status`:
- `queued`: Draft ready for review
- `approved`: User tapped "Approve to send"
- `sent`: Gmail API confirmed delivery
- `dismissed`: User or auto-dismiss removed it
- `reminder`: 24h nudge inserted as new feed item

## Output JSON (per email processed)

```json
{
  "classification": "lead",
  "summary": "Warm lead from Sarah at Acme asking about enterprise pricing.",
  "warmth_score": "warm",
  "score_rationale": "Specific ask, named company, Q2 deadline mentioned.",
  "reply_draft": "Hi Sarah, thanks for reaching out...",
  "follow_up_draft": "Following up on my note from Tuesday...",
  "follow_up_delay_hours": 48
}
```

## UI Elements

- Feed card per email with: classification badge, one-line summary, warmth indicator
- Expandable reply draft with Edit button
- "Approve to send" and "Dismiss" action buttons
- Follow-up timer countdown visible on approved items
- Nothing auto-sends -- every outbound action requires a tap

## Hours Saved Estimate

10 minutes per run (replaces: reading email, classifying, writing reply, setting reminder).
