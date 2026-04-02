

## Nora Beta Web App — Implementation Plan

### Overview

Transform the existing Nora landing site into a full beta SaaS app with authentication, a dashboard, workflow engine with visible step-by-step processing, history, and settings. The existing landing page stays as the public marketing page. Authenticated users access a new dashboard-based app experience.

### Architecture

```text
Public routes (no auth):
  /                 — Landing page (existing, updated copy)
  /about, /faq, /privacy — Keep as-is

Auth routes:
  /login            — Sign in / Sign up page

Protected routes (require auth):
  /dashboard        — Main dashboard (sidebar layout)
  /dashboard/run/:id — Workflow run detail + output view
  /dashboard/history — Past workflow runs
  /dashboard/settings — Profile, tone, audience, export
```

### Database Schema (4 new tables + auth)

1. **profiles** — user_id (FK auth.users), display_name, preferred_tone, default_audience, created_at
2. **workflow_templates** — id, name, description, icon, status (active/coming_soon), steps JSON
3. **workflow_runs** — id, user_id (FK profiles), template_id (FK workflow_templates), input_text, goal, tone, status (pending/running/completed/failed), current_step, created_at, completed_at
4. **workflow_outputs** — id, run_id (FK workflow_runs), output_type (x_post/hook/linkedin_post/cta), content, position, created_at

RLS: Users can only CRUD their own profiles, runs, and outputs. Templates are readable by all authenticated users. Seed 3 templates (Content Agent active, Research Agent + Lead Follow-up coming soon).

### New Edge Function: `nora-workflow`

Single edge function that processes the Content Agent workflow via Lovable AI (using LOVABLE_API_KEY, no Claude dependency for this flow):

- Accepts: `{ input_text, goal?, tone? }`
- Uses streaming SSE to report step progress in real-time
- Steps: `input_received` → `classifying` → `generating` → `formatting` → `done`
- Generates: 1 X post, 3 hooks, 1 LinkedIn post, 1 CTA
- Saves outputs to `workflow_outputs` table
- Uses `google/gemini-3-flash-preview` model

### Frontend Components to Create

**Layout:**
- `src/components/dashboard/DashboardLayout.tsx` — Sidebar + main content area using shadcn Sidebar
- `src/components/dashboard/DashboardSidebar.tsx` — Nora branding, nav links (Dashboard, History, Settings), user info, logout

**Pages:**
- `src/pages/Login.tsx` — Clean auth page with email/password sign in + sign up, Nora branding
- `src/pages/Dashboard.tsx` — Stats cards (total runs, drafts generated, time saved), recent runs, workflow templates grid, "New Workflow Run" button
- `src/pages/WorkflowRun.tsx` — 4-step wizard (choose template → paste input → optional goal/tone → run) + real-time workflow visualization timeline + output view with copy/edit/regenerate
- `src/pages/History.tsx` — Table/list of past runs with type, date, status, output preview
- `src/pages/Settings.tsx` — Profile info, preferred tone, default audience, export data button

**Shared components:**
- `src/components/dashboard/WorkflowTimeline.tsx` — Vertical step-by-step progress with animated states (pending/running/complete)
- `src/components/dashboard/OutputCard.tsx` — Single output block with copy button, edit toggle, regenerate
- `src/components/dashboard/StatsCards.tsx` — Total runs, drafts generated, estimated time saved
- `src/components/dashboard/TemplateCard.tsx` — Workflow template card (active or "coming soon" badge)
- `src/components/dashboard/NewRunWizard.tsx` — Multi-step modal/flow for creating a run

**Auth:**
- `src/components/auth/AuthGuard.tsx` — Redirects unauthenticated users to /login
- Auth hooks using Supabase `onAuthStateChange`

### Modifications to Existing Files

- `src/App.tsx` — Add new routes, wrap dashboard routes in AuthGuard
- `src/pages/Index.tsx` — Update hero copy to "AI workflow workspace for founders", update CTA to point to /login or /dashboard
- `src/components/nora-landing/SiteNav.tsx` — Add "Sign In" link, conditionally show "Dashboard" if logged in
- `src/index.css` — Add any needed utility classes for the workflow timeline

### UI/Design Direction

- Dark mode by default (existing theme system)
- Use existing design tokens (`surface-panel`, `premium-heading`, Inter font, teal primary)
- No DaisyUI in dashboard — pure shadcn/Tailwind tokens
- Clean cards with strong spacing, rounded-xl corners
- Workflow timeline: vertical with animated dots, connecting lines, step labels
- Minimal micro-interactions via framer-motion (fade in cards, step transitions)
- Mobile-first responsive design

### Implementation Order

1. Database migration (profiles, workflow_templates, workflow_runs, workflow_outputs + RLS + seed templates)
2. Auth page + AuthGuard + profile auto-creation trigger
3. Dashboard layout with sidebar
4. Dashboard page (stats, templates, recent runs)
5. New workflow run wizard + `nora-workflow` edge function with streaming
6. Workflow run detail page with real-time timeline visualization
7. Output view with copy/edit/regenerate
8. History page
9. Settings page
10. Landing page copy updates

### Key Decisions

- Content Agent uses **Lovable AI** (gemini-3-flash-preview) via a new edge function — not the existing Claude proxy (that stays for the Ask Nora chat)
- Streaming SSE for real-time step progress during workflow execution
- Email/password auth with email verification (no auto-confirm)
- Profile table auto-created via database trigger on signup
- Demo/sample data shown for empty states with realistic founder content

