/**
 * Captures contextual information about what the user is pointing at.
 * Used by voice assistant to describe UI elements under the cursor.
 */

let lastMouseX = 0;
let lastMouseY = 0;

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }, { passive: true });
}

export function getMousePosition() {
  return { x: lastMouseX, y: lastMouseY };
}

/** Build a short text description of the element under the cursor for AI context. */
export function describeElementUnderCursor(): string {
  if (typeof document === 'undefined') return '';

  const el = document.elementFromPoint(lastMouseX, lastMouseY);
  if (!el || el === document.body || el === document.documentElement) {
    return 'The user is pointing at an empty area of the dashboard.';
  }

  const parts: string[] = [];

  // Tag + role
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');
  const ariaLabel = el.getAttribute('aria-label');

  // Visible text (truncated)
  const visibleText = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200);

  // Closest interactive ancestor
  const interactive = el.closest('button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"]');
  const interactiveLabel = interactive?.getAttribute('aria-label')
    || interactive?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100)
    || '';

  // Section / landmark
  const section = el.closest('[data-section], section, main, aside, nav, header, footer, [role="region"]');
  const sectionLabel = section?.getAttribute('aria-label')
    || section?.getAttribute('data-section')
    || section?.tagName.toLowerCase()
    || '';

  // Heading context
  const heading = el.closest('h1, h2, h3, h4, h5, h6')
    || section?.querySelector('h1, h2, h3, h4, h5, h6');
  const headingText = heading?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) || '';

  parts.push(`The user is pointing at a <${tag}> element.`);

  if (ariaLabel) parts.push(`Aria-label: "${ariaLabel}".`);
  if (role) parts.push(`Role: ${role}.`);
  if (interactive && interactive !== el) {
    parts.push(`It is inside a clickable element${interactiveLabel ? `: "${interactiveLabel}"` : ''}.`);
  }
  if (sectionLabel) parts.push(`Section: ${sectionLabel}.`);
  if (headingText) parts.push(`Nearest heading: "${headingText}".`);
  if (visibleText && visibleText.length > 2) {
    parts.push(`Visible text: "${visibleText.slice(0, 120)}${visibleText.length > 120 ? '…' : ''}".`);
  }

  // CSS classes for extra context (only meaningful ones)
  const classes = Array.from(el.classList)
    .filter(c => !c.startsWith('_') && c.length < 40)
    .slice(0, 5);
  if (classes.length) parts.push(`CSS hints: ${classes.join(', ')}.`);

  return parts.join(' ');
}
