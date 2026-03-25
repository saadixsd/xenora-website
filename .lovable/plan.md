# XenoraAI Landing Page — Nora Agents

Minimal, dark cosmic landing page inspired by Perplexity/Claude's clean aesthetic. Connected to Supabase for waitlist storage, pushed to GitHub as private repo `Xenora-website`.

## Design
- **Dark-only** cosmic theme: black → deep purple gradient
- **Teal/green accents** (#14B8A6, #00FF88) with neon glow effects
- **Playfair Display headings** + **Lora body**, massive hero typography, glassmorphism cards
- **Canvas neural network animation** in hero background (animated nodes + connections)
- Minimal layout — lots of whitespace, Perplexity-style clarity

## Page Structure

### 1. Hero Section (full viewport)
- Animated neural network canvas background (abstract nodes expanding/connecting)
- "Nora by XenoraAI — Agentic AI Engine" (large, clean)
- Supporting line: "Automate IT/HR/Finance workflows. Observe→adapt→execute."
- **"Join Waitlist to Try Nora"** CTA button → smooth scroll to form

### 2. Waitlist Section (centered, glassmorphism card)
- Name + Email fields with glowing focus states
- Role (Founder/Op Manager/SMB/Creator) and Company Size fields
- Submit to Supabase `waitlist` table
- Live validation, success confetti animation
- Fixed success message for early access
- Loading and success micro-interactions

### 3. Footer
- Social icons: X, LinkedIn, Instagram (@xenoraai)
- Minimal copyright
- Minimal copyright

## Interactions & Polish
- Cursor glow trail effect
- Scroll-triggered fade-in reveals
- Form field glow on focus, submit button pulse
- Skeleton loading states
- Fully responsive mobile-first design
- 100% accessible (ARIA labels, focus states, contrast)

## Backend (Supabase)
- Create `waitlist` table: id, name, email (unique), role, company_size, created_at (and legacy `focus_killer` column if present)
- RLS policy: anyone can insert, no one can read (secure)
- Simple client-side Supabase insert (no auth required)

## GitHub
- Connect to GitHub, create private repo named `Xenora-website`

