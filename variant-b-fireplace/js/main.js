// Shared entry of the three fireplace parts (top, left, right); #stage names its part.
import { setupClickout } from './clickout.js';
import { addIdle } from './idle.js';
import { setupIntro } from './intro.js';
import { gsap, reducedMotion } from './motion.js';
import { sharedNow, waitForStart } from './sync.js';

const PARTS = ['top', 'left', 'right'];

const stage = document.getElementById('stage');
const part = stage?.dataset.part;

if (!PARTS.includes(part)) {
  throw new Error(`Fireplace: #stage with data-part ${PARTS.join(' | ')} is missing (got ${part})`);
}

async function preloadImages(images) {
  const results = await Promise.allSettled(images.map((image) => image.decode()));
  const failed = images.filter((image, index) => results[index].status === 'rejected');

  if (failed.length > 0) {
    const files = failed.map((image) => image.getAttribute('src')).join(', ');
    throw new Error(`Fireplace ${part}: failed to load ${files}`);
  }
}

// The stage stays hidden until every layer is decoded, so it never appears half-loaded.
await preloadImages([...stage.querySelectorAll('img')]);

if (new URLSearchParams(location.search).get('overlay') === '1') {
  const { showDesignOverlay } = await import('./debug.js');
  showDesignOverlay(stage);
}

// Starts the timeline at the shared start time, or at once without one. A part that gets
// the time late starts that much into it, so the parts stay on the same moment.
function playAt(timeline, startAt) {
  const waitSeconds = startAt === undefined ? 0 : (startAt - sharedNow()) / 1000;
  if (waitSeconds > 0) {
    gsap.delayedCall(waitSeconds, () => timeline.play(0));
  } else {
    timeline.play(-waitSeconds);
  }
}

// Animations, and a start still waiting for its time, pause with the page.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
  } else {
    gsap.globalTimeline.resume();
  }
});

setupClickout(stage);

// The intro and the calm motion after it form one timeline. It is built before the reveal,
// so the stage first appears at the intro's first frame. With reduced motion it appears at
// the end, with no motion and nothing to start together.
const timeline = setupIntro(stage, part);
addIdle(timeline, stage, part);

if (reducedMotion.matches) {
  timeline.progress(1, true);
  stage.classList.add('is-ready');
} else {
  stage.classList.add('is-ready');
  playAt(timeline, await waitForStart());
}
