

## TalentGraph Dashboard Redesign + Nora Integration

### Problems identified

1. **Design inconsistency**: TalentGraph uses DaisyUI class names (`btn btn-primary`, `input input-bordered`, `btn-ghost`, `btn-outline`, `btn-sm`) that don't match the custom Tailwind/shadcn design system used on Index and TryNora pages. The site uses custom CSS variables (`--primary`, `--card`, etc.) with shadcn-style tokens, not DaisyUI.
2. **No Nora integration**: TalentGraph has a simple "Ask Nora" link but no inline Nora assistant. When a user gets results, they can't ask Nora about a candidate.
3. **Layout feels utilitarian**: The two-column layout with plain panels lacks the premium feel of the rest of the site.

### Plan

#### 1. Redesign TalentGraph page with consistent design system

Replace all DaisyUI classes with the project's own Tailwind tokens:
- Inputs: custom styled with `rounded-xl border border-border bg-card/35` etc.
- Buttons: use the same button patterns from Index page (not `btn btn-primary`)
- Cards: use `surface-panel` utility + refined card layouts
- Add avatar images for candidates (using `avatar_url` already in the data)
- Add a proper loading/progress indicator during stages (animated steps bar)
- Score display: circular or bar-style score badges instead of plain numbers
- Responsive: stack to single column on mobile, side-by-side on desktop

#### 2. Add inline Nora chat drawer

- Add a floating "Ask Nora" button (bottom-right) on the TalentGraph page
- Opens a slide-over panel with the Nora chat interface
- Pre-populate context: when results are available, Nora's system prompt context includes the taste profile and top candidates so users can ask "Tell me more about candidate X" or "Why did this person score low?"
- Reuse the existing `sendClaudeChat` function from `src/lib/claude.ts`

#### 3. Connect TalentGraph results to Nora context

- When user clicks "Ask Nora about this candidate" on a result card, it opens the Nora drawer with a pre-filled message like "Tell me about @username's fit for my team"
- Pass candidate data as context in the chat message so Nora can give informed answers

### Files to modify

| File | Changes |
|------|---------|
| `src/pages/TalentGraph.tsx` | Full redesign — replace DaisyUI with custom tokens, add avatar display, progress stepper, inline Nora drawer |
| `src/index.css` | Potentially add a utility class for score badges |

### Files to create

| File | Purpose |
|------|---------|
| `src/components/talentgraph/NoraChatDrawer.tsx` | Slide-over Nora chat panel with context awareness |
| `src/components/talentgraph/CandidateCard.tsx` | Extracted candidate result card component |
| `src/components/talentgraph/StageProgress.tsx` | Visual progress indicator for parsing/matching/scoring stages |

### Design details

- **Score badges**: Circular ring with score number inside, color-coded (teal for 85+, green for 70+, amber for 55+, gray below)
- **Candidate cards**: Show avatar, name, location, bio, language tags as pills, score ring, sub-scores as small bars, "Ask Nora" button per card
- **Stage progress**: Horizontal stepper with 4 dots (Parse → Profile → Search → Score) that animate as stages progress
- **Nora drawer**: 400px wide slide-in from right, same chat UI as TryNora but compact, with close button

