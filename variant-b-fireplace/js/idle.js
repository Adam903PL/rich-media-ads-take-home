// Calm motion after the intro, on the same timeline so the parts stay in step (D-027): the
// moss slowly zooms in and settles back, and the CTA pulses gently a few times. All of it
// comes to rest at the design layout 25.5 s after the start, inside the 30 s limit for
// ambient motion.
import { find } from './dom.js';

// One slow zoom in and back around the fireplace centre; well inside the crops' 1.10 (D-020).
const BREATH = { scale: 1.025, duration: 11 };

const CTA_PULSE = { scale: 1.05, duration: 0.6 };
// Seconds after the intro's end.
const CTA_PULSE_OFFSETS = [1.5, 6, 10.5, 15, 19.5];

const settleBack = { ease: 'sine.inOut', yoyo: true, repeat: 1 };

export function addIdle(timeline, stage, part) {
  const idleStart = timeline.duration();
  timeline.to(find(stage, '.bg'), { ...BREATH, ...settleBack }, idleStart);

  if (part === 'top') return;

  const cta = find(stage, '.cta');
  CTA_PULSE_OFFSETS.forEach((offset) => {
    timeline.to(cta, { ...CTA_PULSE, ...settleBack }, idleStart + offset);
  });
}
