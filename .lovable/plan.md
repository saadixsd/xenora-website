# Make Nora feel agentic — phased dashboard rework

Homepage and marketing pages stay frozen. All work is inside `/dashboard/*`.

The spec you wrote is good but builds in the wrong order. The kanban and metrics
strip are visible *consequences* of agency, not the cause of it. Two changes do
all the heavy lifting on perception:

1. A live **step trace** that narrates what Nora is doing in real time.
2. **Items** that persist across runs and move through stages, instead of
   one-shot generations that vanish.

Everything else (kanban, capture panel, follow-ups tab, metrics) becomes a
natural surface on top of those primitives.

---

## Phase 1 — Perception shift (ship first, ~1 session)

Goal: the next time you click "Run", it *reads* as an agent, not a generator.

1. **Step trace UI on the workflow run page.**
   `nora-workflow` already streams SSE stages
   (`input_received → analyzing → drafting → reviewing → finalizing`). Today
   they're collapsed into a progress bar. Replace it with a vertical timeline
   that prints each step as it arrives, with timestamp, a one-line description
   of what Nora did, and the input/output snippet that step produced. Keep
   completed steps visible — don't replace, append.

2. **Reframe stage names** to read as agent actions, not pipeline labels:
   - `analyzing` → "Read your input and classified it as a [type]"
   - `drafting` → "Generated 3 candidate hooks"
   - `reviewing` → "Picked hook #2 and expanded it into a post"
   - `finalizing` → "Wrote the CTA and tightened the copy"
   The edge function already knows what it did at each stage; we just need it
   to emit a `narration` field in the SSE event.

3. **"Next actions" strip on the dashboard home.** A single horizontal row
   above the existing stat blocks: 2–3 cards generated from current state
   (e.g. "Approve 3 drafts from your last run", "Re-run last week's content
   workflow"). Pulled from existing `workflow_outputs` + `workflow_runs` —
   no new tables.

After phase 1, no new database tables, no kanban, but Nora visibly *runs steps*
and the dashboard tells you what to do next. This is enough to change the
sentence "it's a content generator" to "it's running a workflow."

## Phase 2 — Items that persist (~1–2 sessions)

Goal: stop losing work between runs. An idea you capture today should still be
sitting in "Drafting" tomorrow.

1. **New table `workflow_items`.** Columns:
   `id, user_id, workflow_run_id (nullable), type (post | reply | idea),
    stage (idea | drafting | review | ready | sent), title, input_text,
    ai_draft, platform, due_date, created_at, updated_at`.
   RLS scoped by `user_id`. Items can exist without a run (captured ideas)
   and get linked to a run when Nora processes them.

2. **New table `workflow_step_logs`.** Columns:
   `id, item_id, step_name, status, narration, timestamp, debug_info jsonb`.
   This is what powers the step trace per-item (phase 1's trace is per-run;
   this one is per-item, finer-grained).

3. **Adapt `nora-workflow`** to write items + step logs instead of (or in
   addition to) the current `workflow_outputs` rows. Keep `workflow_outputs`
   for backward compatibility with existing UI; new code reads from `items`.

## Phase 3 — Workspace UI (~2 sessions)

Now the kanban actually has something real to render.

1. **Workflow run view at `/dashboard/run/:id`** becomes three columns:
   - Left: run metadata + list of past runs for the same template.
   - Middle: stage lanes (Ideas → Drafting → Review → Ready → Sent), each
     lane lists `workflow_items` filtered by stage.
   - Right: clicked item detail with input, AI draft, step trace, and
     buttons (Regenerate, Edit & Save, Mark Ready, Mark Sent).

2. **Idea capture as a side panel**, not a separate route. Triggered from
   a "Capture" button in the dashboard header. Submits an item with
   `stage = 'idea'`, no run linked. Toast on success.

3. **Follow-ups tab at `/dashboard/follow-ups`.** Same data model — items
   with `type = 'reply'`. List view + the same right-panel detail. Mock
   the "source" field (X, email, call) for now.

## Phase 4 — Metrics + polish (~half session)

The "ideas captured / posts approved / follow-ups drafted" trio on the
dashboard home, computed from `workflow_items` aggregates. Progress bars on
workflow cards ("3/5 posts ready") become trivial counts. Empty states are
copywritten so a brand-new user sees example items, not a void.

---

## What I'd cut from your spec

- **Sample/seed data for new users.** Ship without it. A real workflow run
  takes 30 seconds — better to nudge them to run one than to fake activity.
- **Cadence/frequency UI.** Out of scope for beta. Add when you have weekly
  scheduling logic to back it up.
- **`Workflow` and `WorkflowRun` as new tables.** We already have
  `workflow_templates` and `workflow_runs`. Don't duplicate.

## What changes in the codebase

- `supabase/functions/nora-workflow/index.ts` — add `narration` field to SSE
  events; later, write `workflow_items` + `workflow_step_logs`.
- New migration for `workflow_items` and `workflow_step_logs` with RLS.
- `src/pages/WorkflowRun.tsx` — replace progress bar with step trace
  timeline (phase 1), then three-column layout (phase 3).
- `src/pages/Dashboard.tsx` — add "Next actions" strip, keep existing layout.
- New `src/pages/FollowUps.tsx` and route in `src/config/routes.ts` + `App.tsx`.
- `src/components/dashboard/CaptureSidePanel.tsx` (new).
- `src/components/dashboard/StepTrace.tsx` (new, used in two places).
- `mem://product/nora-agentic-loop` (new) — record the loop concept so
  future copy stays consistent.

## What stays untouched

- `Index.tsx`, `About.tsx`, `FAQ.tsx`, `Privacy.tsx`, `SiteNav` — all
  marketing surfaces.
- Pricing, auth, billing edge functions.
- The chat panel (`NoraChatPanel`) — that's a separate surface; conflating
  it with the workflow workspace is what made it feel like a chat tool.

## Recommendation

Approve **phase 1 only** for the next build. It's the smallest change with
the biggest perception delta, and it lets us see whether the step trace alone
moves the needle before we invest in new tables and a three-column layout.
If it lands, we ship phase 2–4 over the following sessions.