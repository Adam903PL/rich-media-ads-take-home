// GSAP is vendored as one classic script (D-012); modules take it, and the viewer's
// motion preference, from here.
export const { gsap } = window;
if (!gsap) {
  throw new Error('Gut Run: GSAP (vendor/gsap.min.js) is not loaded');
}

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
