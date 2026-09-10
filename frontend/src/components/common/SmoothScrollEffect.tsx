import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Provides smooth, natural vertical page scrolling across the site.
 * Keeps speed and feel close to native behavior, adding subtle fluid damping.
 */
export function SmoothScrollEffect() {
  useEffect(() => {
    // Respect user's accessibility preference
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false, // Maintain 100% native touch gestures on mobile devices
      wheelMultiplier: 1, // Keep identical scroll speed/distance as native
      lerp: 0.12, // Subtle, natural smoothing without lag or floatiness
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      prevent: (node) => {
        // Prevent smoothing inside modals, dialogs, selects, dropdowns, and opt-out areas
        return (
          node.hasAttribute('data-lenis-prevent') ||
          Boolean(
            node.closest(
              '[data-lenis-prevent], [role="dialog"], [role="menu"], [role="listbox"], [role="combobox"], .radix-scroll-area, [data-radix-popper-content-wrapper]'
            )
          )
        );
      },
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
