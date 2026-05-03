## Goal

Reposition public-facing copy around Nora as an **agentic AI engine** that observes → adapts → executes workflows, with XenoraAI as the umbrella company and Nora as the flagship product.

Tone stays formal/editorial. No competitor names, no location, no founder mentions. No Mac/desktop/Ollama claims yet (those are forward-looking and not yet shipped on the web app).

---

## 1. Landing hero — `src/pages/Index.tsx`

Replace the current hero headline + subtitle.

**Headline**
> The Agentic Engine
> That Runs Your Ops.

**Subtitle**
> Nora observes how your business operates, adapts to your tools, and autonomously executes the repetitive workflows that drain your day — tickets, outreach, hiring, finance nudges, and more.

CTAs unchanged ("View Dashboard" + "See it run").

---

## 2. About page — `src/pages/About.tsx`

Restructure into three short sections:

- **What XenoraAI is** — the umbrella company building agentic workflow infrastructure for SMBs and founders.
- **What Nora is** — the agentic engine. One-liner: *"Nora is an agentic AI workflow assistant that turns messy, real-world operations into autonomous, reviewable runs that actually execute work."*
- **How Nora works** — the observe → adapt → execute loop, in three short bullets:
  1. **Observe** — connects to the tools you already use and learns how work gets done.
  2. **Adapt** — decides what should happen next based on patterns, context, and your guardrails.
  3. **Execute** — runs end-to-end workflows: resolves tickets, advances hiring, nudges invoices, drafts outreach. You review; Nora executes.

Closing line: *"Remove the 80% of operations work that is repetitive, invisible, and kills momentum."*

---

## 3. FAQ — `src/pages/FAQ.tsx`

Update (or insert at top) the **"What is Nora?"** entry with the one-liner + core idea condensed:

> Nora is XenoraAI's agentic AI engine. It watches how your business operates, then autonomously runs workflows for you instead of just giving suggestions. It follows an observe → adapt → execute loop: it learns patterns from your tools and data, decides what to do next, and takes action — with every run reviewable before it ships.

Add a second new entry: **"How is Nora different from a chatbot or automation builder?"**

> Chatbots answer questions. Automation builders need you to wire every step yourself. Nora is agentic: it learns your operation, decides what to do, and executes the work end-to-end — leaving you a reviewable run instead of a to-do list.

---

## 4. Memory

Save the canonical positioning to `mem://product/positioning` and reference it in `mem://index.md` so future copy stays consistent. Update Core to note: *Nora = agentic engine (observe → adapt → execute), not a chat or automation builder.*

---

## Out of scope (for now)

- Mac desktop / local-first / Ollama messaging — hold until that surface ships.
- Pricing, dashboard, or auth changes.
- Visual/layout redesign — copy only.
