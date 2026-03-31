

## Plan: Pivot to "Nora Clones Your Best Hires" — Landing Page + System Prompt + Chat Demo

Three files updated — text only on landing page and chat, full system prompt rewrite. No design changes.

---

### 1. Landing Page (`src/pages/Index.tsx`)

**Hero:**
- Tagline: `Nora — AI Recruiter`
- Headline: `Nora Clones Your Best Hires`
- Subline: `Feed her 3 past hires. Get 10x lookalikes sourced & scheduled — autonomously.`
- Secondary: `No job posts needed. No manual screening. Just candidates that feel like your team.`
- Footer CTA button: `Waitlist Open — Clone Your Best Hires`

**Workflow steps (`flowSteps`):**
| Step | Title | Body |
|------|-------|------|
| 01 | LinkedIn Scan | Hunts profiles matching your past hires' patterns — skills, experience, and vibe. |
| 02 | Taste Index | Builds a "clone score" from your examples — who feels like your team, quantified. |
| 03 | Learns You | Adapts from your feedback across roles. Tell her "no MBAs" once — she remembers. |
| 04 | Outreach & Book | Sends personalized messages, books Calendly interviews for 85%+ matches. |
| 05 | Taste Dashboard | Ranked clones, "why this one?" explanations, and interview prep notes. |

**Value cards (`valueCards`):**
| Card | Description |
|------|-------------|
| Taste Matcher | Clones ideal hires from your history, not generic keyword filters |
| Proactive Hunter | Finds hidden talent on LinkedIn — no waiting for applications |
| Vibe Scheduler | Books only high-match interviews, auto-follows up on no-replies |

**Section titles:**
- "How It Works" subtitle: `LinkedIn → Taste Index → Learns You → Outreach → Dashboard`
- "System Architecture" → `How Nora Hires For You`
- Subtitle: `From 3 past hires to a pipeline of lookalikes — no screening, no scheduling.`

---

### 2. System Prompt (`src/lib/claude.ts`)

Full rewrite of `buildNoraSystemPrompt()`:

- **Identity:** Nora, XenoraAI's AI Recruiter Who Learns Your Taste
- **Core mission:** Clone a founder's hiring playbook from 3-5 past examples, proactively source LinkedIn lookalikes, schedule interviews
- **Engagement hook:** "Always ask for 3 past hire examples to personalize" when users ask about getting started
- **How it works:** OBSERVE (scan LinkedIn), ADAPT (build clone score: skills 40%, experience 30%, vibe 30%), EXECUTE (outreach, score, book Calendly)
- **Pricing** (only when asked): $49/mo starter (10 clones/week), $99/mo pro (unlimited)
- **Scope:** Only Nora, XenoraAI, taste-based hiring, sourcing, scheduling. Redirect everything else.
- **Remove:** All IT/Finance/Jira/Stripe/invoice references, "based in Montréal"
- **Keep:** All links, response style rules, contextual waitlist mentions

---

### 3. Chat Demo Alignment (`src/pages/TryNora.tsx`)

**Suggestion chips** — update to hiring-focused:
- `Taste matching` → "How does Nora learn my hiring taste from past hires?"
- `Sourcing` → "How does Nora find candidates on LinkedIn without job posts?"
- `Scheduling` → "Can Nora book interviews automatically via Calendly?"

**Empty state text:**
- Headline stays: `Ask Nora`
- Subtitle: `AI recruiter that clones your best hires. Ask about sourcing, screening, or scheduling.`
- Placeholder: `Ask about hiring automation...`

---

### Files to modify
| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Hero text, `flowSteps`, `valueCards`, section titles, footer CTA |
| `src/lib/claude.ts` | Full `buildNoraSystemPrompt()` rewrite |
| `src/pages/TryNora.tsx` | Suggestion chips, empty state text, placeholder |

