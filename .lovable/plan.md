

## Plan: Redesign Ask Nora Chat — Clean, Minimal, Perplexity-Inspired

### Current Problems
- Too much visual clutter: sidebar with session modes, quick-start bar, status badges, retry buttons, decorative blurs
- Complex two-column layout on landing state
- Not mobile-optimized
- No markdown rendering for AI responses
- No streaming (full response buffered then animated char-by-char)

### Design Direction
Inspired by Perplexity/Claude/Grok: centered, minimal, full-screen chat with a clean empty state.

```text
┌─────────────────────────────────────────┐
│  Logo    XenoraAI           Nav  Menu   │  ← slim header
├─────────────────────────────────────────┤
│                                         │
│           [XenoraAI logo 8% opacity]    │
│                                         │
│              Ask Nora                   │
│     AI ops automation for SMBs          │
│                                         │
│   ┌─────────────────────────────┐       │
│   │  Ask about automation...  → │       │  ← centered input
│   └─────────────────────────────┘       │
│                                         │
│   [Jira tickets] [Invoicing] [Hiring]   │  ← suggestion chips
│                                         │
└─────────────────────────────────────────┘

After first message → transitions to chat:

┌─────────────────────────────────────────┐
│  Logo    XenoraAI           Nav  Menu   │
├─────────────────────────────────────────┤
│                                         │
│  User message (right-aligned)           │
│                                         │
│  Nora response with markdown rendering  │
│  (left-aligned, prose styling)          │
│                                         │
│  ...scrollable...                       │
│                                         │
├─────────────────────────────────────────┤
│   ┌─────────────────────────────┐       │
│   │  Follow up...             → │       │  ← bottom input bar
│   └─────────────────────────────┘       │
└─────────────────────────────────────────┘
```

### Implementation Steps

**Step 1: Add react-markdown dependency**
- Install `react-markdown` for rendering AI responses with proper formatting.

**Step 2: Update edge function CORS headers**
- Add the required Supabase client headers to `Access-Control-Allow-Headers` in `nora-claude/index.ts` for reliable cross-origin calls.

**Step 3: Update system prompt**
- Revise `buildNoraSystemPrompt` in `src/lib/claude.ts` to match the new personality spec (pricing $99/mo + $49/agent, ROI quantification, always end with waitlist CTA, more conversational tone).

**Step 4: Redesign TryNora.tsx — full rewrite**
- **Empty state**: Centered layout with logo watermark, "Ask Nora" heading, single input field, and 3 suggestion chips ("Jira tickets", "Invoicing", "Hiring").
- **Chat state**: Clean scrollable message list. User messages right-aligned with subtle teal bg. Assistant messages left-aligned with markdown rendering (`react-markdown` + `prose` classes). Minimal typing indicator (3 animated dots, no spinner).
- **Input bar**: Fixed to bottom in chat mode. Single text input with send arrow button. Clean, no borders except subtle separator line.
- **Remove**: Session mode sidebar, quick-start header bar, status badge, retry connection button, decorative blur orbs, workflow focus selector. The system prompt handles domain routing automatically.
- **Mobile**: Full-width, touch-friendly input (min-height 48px), safe-area padding.

**Step 5: Keep existing backend infrastructure**
- No changes to the edge function logic or Supabase tables.
- Keep the existing `CLAUDE_API_KEY` secret and `nora-claude` function as-is (it works).
- Keep the typing animation (char-by-char reveal) — it's a nice touch that doesn't require streaming infrastructure changes.

### Files to Create/Modify
| File | Action |
|------|--------|
| `src/pages/TryNora.tsx` | Full rewrite — minimal chat UI |
| `src/lib/claude.ts` | Update system prompt with new personality |
| `supabase/functions/nora-claude/index.ts` | Fix CORS headers |
| `package.json` | Add `react-markdown` |

### What's NOT changing
- Edge function proxy logic (already working)
- Claude API key storage (already configured)
- Supabase waitlist table
- Other pages (Index, FAQ, Privacy)
- No new database tables (chat persistence deferred — MVP keeps in-memory conversations)

