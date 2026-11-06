// Clickout: the button over the whole part opens the landing page in a new window, on a
// click anywhere or on Enter / Space. Ad servers may set window.clickTag after load, so it
// is read at click time.
import { find } from './dom.js';

function openClickTag() {
  const clickTag = window.clickTag || 'https://example.com/landing';
  window.open(clickTag, '_blank');
}

export function setupClickout(stage) {
  find(stage, '.clickout').addEventListener('click', openClickTag);
}
