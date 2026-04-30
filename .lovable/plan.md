# Xenora — Jobs-inspired Redesign

A focused pass on the marketing site and dashboard guided by one principle: **simplicity is the ultimate sophistication**. Less chrome, more clarity. Outcome-first copy. Quiet, confident surfaces. Type that breathes.

---

## 1. Design system reset (foundation)

Before touching pages, retune the system so every screen inherits the new look.

**Typography**
- Replace `Syne` (display) with **Instrument Serif** for hero / section heads — editorial, calm, unmistakably premium (Jobs-era restraint, not techno-futurism).
- Keep **Inter** for body but tighten: weights 400/500 only, default tracking `-0.011em`, body size `15px` desktop / `16px` mobile, line-height `1.6`.
- Drop `Space Mono` from public surfaces; keep only in dashboard for data labels.
- Headline scale: H1 `clamp(2.5rem, 6vw, 4.75rem)`, H2 `clamp(1.75rem, 3.5vw, 2.5rem)`. Generous `text-wrap: balance`.

**Color & surfaces**
- Dark: deeper near-black `#0B0B0E`, single elevated surface `#141418`, hairline borders `rgba(255,255,255,0.08)`. No gradients on cards.
- Light: warm paper `#FAFAF7`, surface `#FFFFFF`, border `rgba(15,15,20,0.08)`.
- Accent stays Xenora green but desaturated one notch (`#10B981` dark / `#0E8F6E` light) — used sparingly (CTA, single accent line, focus ring only).

**Remove visual noise**
- Delete `NeuralMeshBackground` from public pages (background mesh + animated grid).
- Delete the giant centered `XenoraLogo` watermark on `Index`, `Login`, `SignUp`, `FAQ`, `About`, `Contact`, `Privacy`, `AdminLayout`.
- Remove `.glass` and `backdrop-blur-*` from public surfaces. Replace `surface-panel` with a flat card: `bg-surface border border-hairline rounded-xl`.
- Header: solid background, no blur, thin bottom border only after scroll.

---

## 2. Marketing site (`src/pages/Index.tsx`)

Rebuild as a quiet, product-led page. Fewer sections, stronger ones.

```text
1. Hero            — one sentence, one CTA
2. Live demo       — the Input → Workflow → Output card (kept, simplified)
3. The three agents
4. Why Nora        — 3 outcomes, no comparison table
5. Pricing         — Free / Plus / Pro, plain cards
6. Final CTA + footer
```

**Hero rewrite (chosen direction — outcome-led, founder-brutal):**
> An operations teammate for founders who are doing too much.
>
> Nora turns rough notes, leads, and links into reviewable workflow runs. You stay in control of what ships.
>
> [ Join the beta → ]   See it run

- Single primary CTA. Secondary is a text link, not a button.
- Kill the "Ask Nora · Dashboard" micro-links under the CTA.
- Kill the sticky bottom CTA bar (it competes with the hero — Jobs would cut it).

**Sections trimmed**
- Remove the long comparison table and the persona cards — they're noise. Fold the strongest line from each into the "Why Nora" section.
- "How Nora works" merges into the demo section (3 inline labels under the visual, not a separate grid).
- Footer slims to: logo, three links (Privacy · FAQ · Contact), copyright, and a quiet "Admin" link (instead of the current footer).

---

## 3. Dashboard refresh

Same design tokens — dashboard already uses `--dash-*` variables, just retune them and remove blur.

- Sidebar: flat surface, no blur, single hairline border, route labels in Inter 14/medium, accent only on active row (left bar + label color).
- Header: remove backdrop-blur on mobile bar.
- Cards (`dash-panel`, stats, activity feed, output cards): flat, no shadow on hover — only border color shift.
- Floating "Ask Nora" button: shrink to 44px, single solid fill, no glow ring.
- Voice bar: compress vertical padding; same flat treatment.

---

## 4. Theme toggle in Settings

Add a "Appearance" section to `src/pages/Settings.tsx` (dashboard settings) with a Light / Dark segmented control wired to the existing `useTheme()` hook. Persists via the existing `xenora-theme-mode` localStorage key. Place it as the second card, right under "Profile". Remove the public-site theme toggle from the marketing nav (the dashboard is where users live; the public site auto-follows system preference).

---

## 5. File cleanup

Delete files no longer referenced after the redesign:
- `src/components/nora-landing/NeuralMeshBackground.tsx`
- `src/pages/admin/*` and `src/components/admin/AdminLayout.tsx`, `src/components/AdminRoute.tsx`, `src/hooks/useAdminRole.ts`, `src/lib/leads.ts`, `src/pages/Contact.tsx`, `supabase/functions/submit-lead/` — **only if** you confirm the standalone CRM/admin console added in the earlier "leads" pass is no longer wanted. (It is not linked from the new footer plan; if you want to keep it, say so and I'll wire an "Admin" footer link instead.)
- Unused `glass` / watermark CSS utilities in `src/index.css`.

I'll do a final `rg` sweep to remove any orphaned imports.

---

## 6. Security pass

Run `security--run_security_scan` and `supabase--linter` after the redesign and fix anything that surfaces. Targeted manual checks:
- Confirm `user_roles` RLS still blocks self-promotion (was hardened previously — re-verify after any admin file deletions).
- Confirm `submit-lead` edge function (if kept) still rate-limits and validates input.
- Confirm no new `console.log` of `session` / tokens introduced.
- Verify the Settings appearance toggle doesn't read/write anything beyond the existing localStorage key (no auth surface).

---

## 7. QA before declaring done

- Build passes (auto), no TS errors.
- Visit `/`, `/dashboard`, `/dashboard/settings`, `/login` at 375px, 944px, 1440px — no horizontal scroll, no visible glass blur, no giant watermark.
- Light/dark toggle in Settings flips both dashboard and (next visit) the public site.
- Console clean on each route.

---

## Technical details (for the implementer)

- Add Instrument Serif via Google Fonts import in `src/index.css`; update `tailwind.config.ts` `fontFamily.serif` and replace `font-syne` usages (search/replace across `src/`).
- Tighten `--xenora-accent`, refresh `--dash-*` tokens in both `:root` and `.light` blocks.
- New `<Card>` primitive in `src/components/ui/card.tsx` (or extend existing) — flat variant. Replace `surface-panel` instances on the public pages with it.
- `Index.tsx`: remove `NeuralMeshBackground`, watermark `motion.div`, sticky CTA, comparison table block, persona block; rewrite hero copy; collapse "How Nora works" into the demo section.
- `Settings.tsx`: insert Appearance card using `useTheme()`; segmented control = two buttons sharing a parent with `data-active` styling.
- Delete files listed in §5 only after confirming no imports remain (`rg "from.*<path>" src`).
- After edits, run security scan + linter; address findings or document why deferred.
