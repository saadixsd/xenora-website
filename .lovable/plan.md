

## Plan: Fix Light Mode + Refine Typography Weight

### Problems Identified

1. **Light mode is broken**: The CSS in `index.css` only overrides `--bg-base` for light theme but never overrides the shadcn HSL variables (`--background`, `--foreground`, `--card`, `--border`, etc.). These stay dark regardless of theme. The NeuralMeshBackground also uses hardcoded dark colors (`rgba(10,10,15,...)`, `rgba(255,255,255,...)`).

2. **Text feels too heavy/robust**: Playfair Display + Lora serif combo at `font-semibold` (600) across headings and body creates a dense, heavy feel. Modern premium landing pages (Linear, Vercel, Figma) use lighter weights, more whitespace, and sans-serif for body.

### What Makes Top Sites Feel Light and Premium
Sites like Linear, Vercel, Raycast, and Figma share: thinner font weights (400-500 for headings, 400 for body), generous letter-spacing, high contrast but soft muted text, clean sans-serif body with one accent serif, and light modes with warm whites (#fafafa-#f8fafd) and soft gray borders.

---

### Changes

#### 1. `src/index.css` — Add full light-mode CSS variable overrides

Add a `.light` class block that overrides all shadcn HSL variables for light mode:
- `--background`: warm white
- `--foreground`: dark charcoal
- `--card`, `--popover`: slightly off-white
- `--border`, `--input`: soft gray
- `--muted`, `--muted-foreground`: light grays
- `--primary`: keep teal, adjust `--primary-foreground` to white
- Update `surface-panel` shadow from black to a softer gray for light mode

#### 2. `src/index.css` — Swap body font to Inter (sans-serif)

Replace Lora with Inter for body text. Keep Playfair Display for `.premium-heading` only. This immediately lightens the text feel.

#### 3. `src/components/nora-landing/NeuralMeshBackground.tsx` — Theme-aware colors

Replace hardcoded `rgba(10,10,15,...)` and `rgba(255,255,255,...)` with CSS custom properties so the grid and vignette adapt to light/dark.

#### 4. `src/pages/Index.tsx` — Reduce heading weight

Change `font-semibold` (600) to `font-medium` (500) on the hero h1 and section h2s. Reduce body text opacity classes slightly for a lighter feel.

#### 5. `src/pages/TryNora.tsx` — Light mode prose fix

The chat uses `prose-invert` unconditionally. Add a conditional class so light mode gets normal prose styling.

#### 6. `src/pages/FAQ.tsx` + `src/pages/Privacy.tsx` — Same heading weight reduction

Match the lighter typography from Index.

---

### Files to modify

| File | Change |
|------|--------|
| `src/index.css` | Add `.light` CSS variable overrides, swap body font to Inter, add light-mode surface-panel |
| `src/components/nora-landing/NeuralMeshBackground.tsx` | Use CSS vars for grid/vignette colors, theme-aware |
| `src/pages/Index.tsx` | Reduce heading weights, adjust text opacity |
| `src/pages/TryNora.tsx` | Conditional `prose-invert` for dark only |
| `src/pages/FAQ.tsx` | Lighter heading weights |
| `src/pages/Privacy.tsx` | Lighter heading weights |

