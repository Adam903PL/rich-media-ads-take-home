// Fail and win endcards: entrance timelines, clickout and replay.
const { gsap } = window;
if (!gsap) {
  throw new Error('Gut Run: GSAP (vendor/gsap.min.js) is not loaded');
}

// The crash or the finish stays visible this long before the endcard comes in.
const HOLD_SECONDS = { fail: 0.6, win: 0.4 };
const POO_DROP = { autoAlpha: 0, y: -60, duration: 0.8, ease: 'bounce.out' };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function openClickTag() {
  const clickTag = window.clickTag || 'https://example.com/landing';
  window.open(clickTag, '_blank');
}

function findAll(parent, selector) {
  const elements = [...parent.querySelectorAll(selector)];
  if (elements.length === 0) {
    throw new Error(`Gut Run: ${selector} is missing from index.html`);
  }
  return elements;
}

function find(parent, selector) {
  return findAll(parent, selector)[0];
}

// Both entrances share one frame: the endcard fades in over the frozen game and its
// bubble pops, `addBeats` adds the outcome's own moments, then the headline rises and
// the buttons pop in last. The markup holds the final layout, so every tween animates
// from an offset back to it.
function buildEntrance(endcard, addBeats) {
  const timeline = gsap.timeline({ paused: true })
    .from(endcard, { autoAlpha: 0, duration: 0.35, ease: 'power1.inOut' })
    .from(find(endcard, '.endcard-bubble'), { autoAlpha: 0, scale: 0.7, duration: 0.6, ease: 'back.out(1.6)' }, 0.2);
  addBeats(timeline);
  return timeline
    .from(find(endcard, '.endcard-headline'), { autoAlpha: 0, y: 20, duration: 0.5, ease: 'power2.out' }, 0.95)
    .from(findAll(endcard, '.endcard-button'), { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: 'back.out(2)', stagger: 0.15 }, 1.25);
}

// `onCue` marks the moment for the endcard's sound: the sad poo starting to drop, and
// the confetti bursting.
function buildFailEntrance(endcard, onCue) {
  return buildEntrance(endcard, (timeline) => timeline
    .call(onCue, ['fail'], 0.45)
    .from(find(endcard, '.endcard-poo'), { ...POO_DROP }, 0.45)
    .from(findAll(endcard, '.bacterium'), {
      autoAlpha: 0,
      scale: 0,
      rotation: (index) => (index % 2 === 0 ? -25 : 25),
      duration: 0.5,
      ease: 'back.out(2.5)',
      stagger: 0.07,
    }, 0.55));
}

function buildWinEntrance(endcard, onCue) {
  return buildEntrance(endcard, (timeline) => timeline
    .call(onCue, ['win'], 0.35)
    .from(findAll(endcard, '.confetti'), { autoAlpha: 0, scale: 0.4, rotation: -12, duration: 0.9, ease: 'back.out(1.4)' }, 0.35)
    .from(find(endcard, '.endcard-poo'), { ...POO_DROP }, 0.6));
}

// `show('fail' | 'win')` plays that endcard's entrance after a short hold, or jumps to
// its end with reduced motion; the sound cue fires either way. `hide()` returns both to
// their hidden start without firing cues, so nothing keeps running into the next run.
export function setupEndcards(stage, { onReplay, onCue }) {
  const failCard = find(stage, '#endcard-fail');
  const entrances = {
    fail: buildFailEntrance(failCard, onCue),
    win: buildWinEntrance(find(stage, '#endcard-win'), onCue),
  };
  let hold = null;

  findAll(stage, '.endcard-cta').forEach((cta) => cta.addEventListener('click', openClickTag));
  find(failCard, '.endcard-replay').addEventListener('click', onReplay);

  return {
    show(outcome) {
      const entrance = entrances[outcome];
      hold = gsap.delayedCall(HOLD_SECONDS[outcome], () => {
        if (reducedMotion.matches) {
          entrance.progress(1, false);
        } else {
          entrance.play(0);
        }
      });
    },
    hide() {
      hold?.kill();
      hold = null;
      Object.values(entrances).forEach((entrance) => entrance.pause(0, true));
    },
  };
}
