const SCROLL_DURATION_MS = 820;
const HIGHLIGHT_MS = 1600;
const SECTION_WAIT_MS = 5000;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Sticky navbar + optional announcement bar clearance. */
export function getStickyNavOffset(): number {
  const hasAnnouncement = document.documentElement.hasAttribute('data-announcement-bar');
  const announcementH = hasAnnouncement ? 40 : 0;
  const navH = window.matchMedia('(min-width: 768px)').matches ? 80 : 56;
  return announcementH + navH + 12;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function smoothScrollToY(targetY: number, duration = SCROLL_DURATION_MS): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const delta = targetY - startY;

    if (Math.abs(delta) < 2 || prefersReducedMotion()) {
      window.scrollTo(0, targetY);
      resolve();
      return;
    }

    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      window.scrollTo(0, startY + delta * easeInOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

/**
 * Some homepage bands are lazy-mounted.
 * Wait until the target node exists, nudging scroll only if needed.
 */
async function waitForSectionElement(sectionId: string): Promise<HTMLElement | null> {
  const existing = document.getElementById(sectionId);
  if (existing) return existing;

  const started = performance.now();
  const savedY = window.scrollY;

  const step = Math.max(window.innerHeight * 0.85, 480);
  let probeY = 0;
  const maxY = Math.max(document.documentElement.scrollHeight, step);

  while (performance.now() - started < SECTION_WAIT_MS) {
    const found = document.getElementById(sectionId);
    if (found) {
      window.scrollTo(0, savedY);
      return found;
    }

    probeY = Math.min(probeY + step, maxY);
    window.scrollTo(0, probeY);
    await new Promise((resolve) => setTimeout(resolve, 40));

    if (probeY >= maxY) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      const late = document.getElementById(sectionId);
      if (late) {
        window.scrollTo(0, savedY);
        return late;
      }
      break;
    }
  }

  window.scrollTo(0, savedY);
  return document.getElementById(sectionId);
}

function focusContactForm(): void {
  const section = document.getElementById('contact');
  if (!section) return;

  const focusTarget =
    section.querySelector<HTMLElement>('input[name="name"]') ??
    section.querySelector<HTMLElement>('form input, form textarea, form button');

  if (!focusTarget) return;

  try {
    focusTarget.focus({ preventScroll: true });
  } catch {
    focusTarget.focus();
  }
}

function highlightServicesHeading(): void {
  const heading = document.getElementById('services-heading');
  if (!heading) return;

  heading.classList.add('hero-target-highlight');
  window.setTimeout(() => {
    heading.classList.remove('hero-target-highlight');
  }, HIGHLIGHT_MS);
}

export async function scrollToContactSection(): Promise<void> {
  const el = await waitForSectionElement('contact');
  if (!el) return;

  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  const top = el.getBoundingClientRect().top + window.scrollY - getStickyNavOffset();
  await smoothScrollToY(Math.max(0, top));
  window.setTimeout(focusContactForm, 80);
}

/** @deprecated Prefer scrollToContactSection for CTAs; kept for hash routing. */
export async function scrollToHomeSection(
  section: 'contact' | 'services',
  options?: { focusForm?: boolean; highlightHeading?: boolean },
): Promise<void> {
  if (section === 'contact') {
    await scrollToContactSection();
    return;
  }

  const el = await waitForSectionElement(section);
  if (!el) return;

  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  const top = el.getBoundingClientRect().top + window.scrollY - getStickyNavOffset();
  await smoothScrollToY(Math.max(0, top));

  if (options?.highlightHeading !== false) {
    highlightServicesHeading();
  }
}

export function isHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}
