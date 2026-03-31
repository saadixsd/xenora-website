

## Plan: Hero Rewrite, Honest Social Proof, FAQ Overhaul, About Page

Based on the critique, there are four actionable changes. No design changes — text and content only, plus one new page.

---

### 1. Hero copy rewrite (`src/pages/Index.tsx`)

**Current**: "Clone Your Best Hires on Autopilot" — confusing "clone" connotation.

**New hero**:
- Tagline: `Nora by XenoraAI`
- Headline: `Stop Screening. Start Meeting Your People.`
- Subline: `Upload 3 hires you loved. Nora's TalentGraph™ scours GitHub, X, and portfolios to find 10 more just like them — and books the calls.`
- Secondary: `No job posts. No resume hell. No recruiters.`
- CTA label: `Get Early Access` (single CTA, remove secondary "See how it works" link)
- Below CTA: `Founding access — limited spots.`

### 2. Replace fake "Early Users" with honest framing (`src/pages/Index.tsx`)

Remove the `earlyUsers` array and the "Early users" section. Replace with a single honest line:

`Nora is in early access. We're working with our first 10 founding teams to get this right.`

No fake quotes, no placeholder logos.

### 3. FAQ page overhaul (`src/pages/FAQ.tsx`)

Replace the outdated "agentic engine / IT / HR / Finance" FAQs with four focused, TalentGraph-aligned questions:

1. **How does TalentGraph™ find candidates without LinkedIn?** — Searches publicly available profiles across GitHub, X, and personal portfolios. No scraping of platforms that prohibit it.
2. **What happens to my data?** — Uploads stay private to your account. We don't train on your hiring preferences or share them.
3. **How accurate is the 85% match rate?** — Target benchmark from internal testing. Your first 10 matches help Nora calibrate to your taste.
4. **Is this free right now?** — Founding members get free access during early build phase. Pricing announced before waitlist closes.

Also update the subtitle from "agentic engine" to match the recruiting focus.

### 4. Add About page (`src/pages/About.tsx`)

New page with:
- Photo placeholder (or XenoraLogo as stand-in)
- One honest paragraph: why you built this, who you are
- Link to X account
- "Built with conviction" tagline in footer area

Add `/about` route in `App.tsx` and add "About" link in `SiteNav.tsx` navigation.

### 5. Footer addition (`src/pages/Index.tsx`)

Add `Built by XenoraAI` text in the footer center column.

---

### Files to modify

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Hero rewrite, remove fake quotes, honest early access line, footer text |
| `src/pages/FAQ.tsx` | Replace all FAQ content with 4 focused questions |
| `src/pages/About.tsx` | New page — founder story, photo placeholder, X link |
| `src/App.tsx` | Add `/about` route |
| `src/components/nora-landing/SiteNav.tsx` | Add "About" nav link |

