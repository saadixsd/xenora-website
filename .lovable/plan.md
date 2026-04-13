

## Plan: Update FAQ pricing + font audit & improvement

### 1. Fix FAQ pricing (quick)
Update the pricing FAQ answer from "$13.99/$19.99" to **$49.99/$79.99**, and add the 7-day free trial mention to match the landing page.

**File:** `src/pages/FAQ.tsx` line 38

### 2. Font consolidation & improvement

**Current state — the problem:**
The site loads **4 Google Font families** but uses them inconsistently:
- **Inter** — body default (set in CSS)
- **Playfair Display** — used only once (Index.tsx tagline)
- **DM Sans / DM Serif Display** — used in dashboard pages, chat panel, agent editors
- **Syne** — used for `premium-heading`, dashboard stats, sidebar branding
- **Space Mono** — used for dashboard labels (`dash-label`)

This creates a fragmented feel: landing pages use Syne headings + Playfair accents, dashboard uses DM Serif headings + Syne stats, FAQ uses Syne headings with Inter body. Too many typefaces competing.

**Proposed simplification — 2 font families:**

| Role | Font | Where |
|------|-------|-------|
| Headings & brand | **Syne** (already loaded, bold & distinctive) | All `premium-heading`, page titles, sidebar brand, stats |
| Body & UI | **Inter** (already the default) | Everything else — paragraphs, labels, inputs, nav |

**What gets removed:**
- **Playfair Display** — replace the one usage on Index.tsx with Syne
- **DM Serif Display** — replace ~6 usages (`font-dm-serif`) with Syne
- **DM Sans** — replace ~2 usages (`font-dm-sans`) with Inter (already the default, so just remove the class)

**What stays:**
- **Space Mono** for `dash-label` (monospace labels are intentional and distinctive)

**Files to edit:**
- `src/index.css` — remove Playfair and DM font imports (lines 2-3)
- `tailwind.config.ts` — keep `syne` and `space-mono` font families, can remove unused ones
- `src/pages/Index.tsx` — replace `font-playfair` with `font-syne`
- `src/pages/FAQ.tsx` — update pricing text
- `src/components/dashboard/NoraChatPanel.tsx` — replace `font-dm-serif` with `font-syne`
- `src/pages/AgentEditPage.tsx` — replace `font-dm-serif`/`font-dm-sans` 
- `src/pages/AgentWorkspacePage.tsx` — replace `font-dm-serif`
- `src/pages/Connections.tsx` — remove `font-dm-sans`
- `src/pages/NotFound.tsx` — replace `font-dm-serif`

This cuts 2 network requests (fewer font downloads = faster load) and gives the site a consistent voice: **Syne for personality, Inter for clarity**.

