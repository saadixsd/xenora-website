

## Plan: Fix Mobile Zoom/Scroll Issues on Ask Nora Chat

### Problem
On mobile, when the keyboard opens (tapping the input), the browser auto-zooms and the viewport shifts — making it hard to see messages or type. This is a classic mobile web issue caused by two things:

1. **Auto-zoom on focus**: iOS Safari zooms in when an input has `font-size < 16px` (current inputs use `text-sm` = 14px)
2. **Viewport resize on keyboard open**: The mobile keyboard shrinks the viewport, causing layout jumps with `fixed inset-0`
3. **Missing touch prevention**: No meta tag or CSS to prevent pinch-zoom on the chat interface

### Changes

**`index.html`** — Prevent pinch-zoom on mobile:
- Update viewport meta to add `maximum-scale=1, user-scalable=no` (prevents accidental zoom while chatting)

**`src/pages/TryNora.tsx`** — Fix input font size + viewport stability:
- Change input `text-sm` → `text-base` (16px) on both input fields to prevent iOS auto-zoom on focus
- Add `touch-action: manipulation` on the outer container to prevent double-tap zoom
- Use `dvh` (dynamic viewport height) via CSS to handle keyboard resize properly
- Add `overscroll-behavior: none` on the container to prevent pull-to-refresh and bounce effects

### Files to modify
| File | Change |
|------|--------|
| `index.html` | Add `maximum-scale=1, user-scalable=no` to viewport meta |
| `src/pages/TryNora.tsx` | Input font size → 16px, add touch-action/overscroll CSS |

