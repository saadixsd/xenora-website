

# XenoraAI Landing Page — "Know Beyond"

Minimal, dark cosmic landing page inspired by Perplexity/Claude's clean aesthetic. Connected to Supabase for waitlist storage, pushed to GitHub as private repo `Xenora-website`.

## Design
- **Dark-only** cosmic theme: black → deep purple gradient
- **Teal/cyan accents** (#00D4FF, #00FF88) with neon glow effects
- **Inter font**, massive hero typography, glassmorphism cards
- **Canvas neural network animation** in hero background (animated nodes + connections)
- Minimal layout — lots of whitespace, Perplexity-style clarity

## Page Structure

### 1. Hero Section (full viewport)
- Animated neural network canvas background (abstract nodes expanding/connecting)
- "XenoraAI" in bold glowing text (large, clean)
- "Powered by Nora" subtle badge
- **"Know Beyond"** — main tagline, large and centered
- "Agentic AI for creators & teams" — small subtitle
- **"Join Waitlist"** CTA button → smooth scroll to form

### 2. Waitlist Section (centered, glassmorphism card)
- Name + Email fields with glowing focus states
- Submit stores to Supabase `waitlist` table
- Live validation, success confetti animation
- "10,000+ builders waiting" social proof text
- Loading and success micro-interactions

### 3. Footer
- Social icons: X, LinkedIn, Instagram (@xenoraai)
- "Built in Montréal, Canada"
- Minimal copyright

## Interactions & Polish
- Cursor glow trail effect
- Scroll-triggered fade-in reveals
- Form field glow on focus, submit button pulse
- Skeleton loading states
- Fully responsive mobile-first design
- 100% accessible (ARIA labels, focus states, contrast)

## Backend (Supabase)
- Create `waitlist` table: id, name, email (unique), created_at
- RLS policy: anyone can insert, no one can read (secure)
- Simple client-side Supabase insert (no auth required)

## GitHub
- Connect to GitHub, create private repo named `Xenora-website`

