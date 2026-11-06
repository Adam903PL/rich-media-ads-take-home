// Start-screen intro: the gut fades in under the clouds, the headline rises, the poo pops
// in and the tutorial hand arrives. The hand then keeps tapping, for less than 30 seconds.
import { find } from './dom.js';
import { gsap, reducedMotion } from './motion.js';

const HAND_TAP = { y: 6, duration: 0.45, ease: 'sine.inOut' };
// Ambient loops settle within 30 seconds of the screen appearing (ads/animation standard).
const AMBIENT_LIMIT_SECONDS = 30;

// `play()` runs the intro whenever the start screen appears; `finish()` jumps to its end
// on the first tap. The intro only uses opacity, not autoAlpha: an inline visibility would
// override the CSS that hides the hand outside the start state.
export function setupIntro(stage) {
  const gesture = find(stage, '.gesture');
  let handLoop = null;

  function startHandLoop() {
    const tapCycle = HAND_TAP.duration * 2;
    const taps = Math.floor((AMBIENT_LIMIT_SECONDS - timeline.duration()) / tapCycle);
    // An odd repeat count with yoyo ends the hand back at rest.
    handLoop = gsap.to(gesture, { ...HAND_TAP, yoyo: true, repeat: taps * 2 - 1 });
  }

  const timeline = gsap.timeline({ paused: true, onComplete: startHandLoop })
    .from(find(stage, '.scene'), { opacity: 0, duration: 0.6, ease: 'power1.out' })
    .from(find(stage, '.headline'), { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' }, 0.1)
    .from(find(stage, '.player-wrap'), { opacity: 0, scale: 0, duration: 0.6, ease: 'back.out(2.2)' }, 0.45)
    .from(gesture, { opacity: 0, y: 16, duration: 0.45, ease: 'power2.out' }, 0.8);

  return {
    play() {
      if (reducedMotion.matches) {
        timeline.progress(1, true);
      } else {
        timeline.play(0);
      }
    },
    finish() {
      timeline.progress(1, true);
      handLoop?.kill();
      handLoop = null;
      gsap.set(gesture, { y: 0 });
    },
  };
}
