// Intro of a fireplace part. All three parts use the same beats on the same clock, so
// together they play one intro: the moss settles, the top headline builds line by line,
// the logos pop in, the panels open, the copy rises and the CTAs come last (D-025).
import { find, findAll } from './dom.js';
import { gsap } from './motion.js';

// Seconds from the start of the intro, shared by all parts.
const BEATS = { background: 0, headline: 0.35, logo: 0.45, panel: 1.2, copy: 1.6, cta: 2.2 };

// The background settles from this scale to the design's 1. The crops of bg-big.jpg allow
// at most 1.10 around the fireplace centre, and nothing below 1 (D-020).
const ZOOM_FROM = 1.08;
const ZOOM_SECONDS = 3.5;

const HEADLINE_LINE = { duration: 0.6, stagger: 0.35 };

function addBackground(timeline, stage) {
  const background = find(stage, '.bg');
  timeline
    .from(background, { scale: ZOOM_FROM, duration: ZOOM_SECONDS, ease: 'power2.out' }, BEATS.background)
    .from(background, { autoAlpha: 0, duration: 0.8, ease: 'power1.out' }, BEATS.background);
}

// The headline's soft shadow runs through the gaps between its lines, so each line is a
// copy of the whole image with a soft-edged mask (css/style.css). Stacked copies are a
// few percent lighter where the masks blend, so once the last line has landed the copies
// give way to the single full image.
function addHeadline(timeline, stage) {
  const headline = find(stage, '.headline');
  const lines = findAll(stage, '.headline-line');
  const built = BEATS.headline + HEADLINE_LINE.stagger * (lines.length - 1) + HEADLINE_LINE.duration;

  timeline
    .set(headline, { autoAlpha: 0, immediateRender: true }, 0)
    .fromTo(lines, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, ease: 'power2.out', ...HEADLINE_LINE }, BEATS.headline)
    .set(headline, { autoAlpha: 1 }, built)
    .set(lines, { autoAlpha: 0 }, built);
}

function addSkyscraper(timeline, stage) {
  timeline
    .from(find(stage, '.logo'), { autoAlpha: 0, scale: 0.8, duration: 0.7, ease: 'back.out(1.6)' }, BEATS.logo)
    .from(find(stage, '.panel'), { autoAlpha: 0, scaleY: 0, duration: 0.6, ease: 'power3.out' }, BEATS.panel)
    .from(find(stage, '.copy'), { autoAlpha: 0, y: 10, duration: 0.5, ease: 'power2.out' }, BEATS.copy)
    .from(find(stage, '.cta'), { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: 'back.out(2)' }, BEATS.cta);
}

// Returns the paused intro, already showing its first frame.
export function setupIntro(stage, part) {
  const timeline = gsap.timeline({ paused: true });
  addBackground(timeline, stage);
  if (part === 'top') {
    addHeadline(timeline, stage);
  } else {
    addSkyscraper(timeline, stage);
  }
  return timeline;
}
