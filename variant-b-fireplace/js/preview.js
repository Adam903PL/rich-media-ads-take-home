// Preview page: the three parts in iframes, laid out as one fireplace and fitted to the
// window, started together (D-026).
import { MESSAGE, START_LEAD_MS, sharedNow } from './sync.js';

const FIREPLACE_WIDTH = 1680;
const FIREPLACE_HEIGHT = 975;

const fireplace = document.getElementById('fireplace');
const frames = fireplace ? [...fireplace.querySelectorAll('iframe')] : [];
if (frames.length !== 3) {
  throw new Error('Fireplace preview: #fireplace with the three part iframes is missing from preview.html');
}

// Never above 1:1, and whole-pixel offsets, so at full size the parts render crisp.
function fitFireplaceToWindow() {
  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    const scale = Math.min(1, width / FIREPLACE_WIDTH, height / FIREPLACE_HEIGHT);
    fireplace.style.setProperty('--scale', scale);
    fireplace.style.setProperty('--x', `${Math.round((width - FIREPLACE_WIDTH * scale) / 2)}px`);
    fireplace.style.setProperty('--y', `${Math.round((height - FIREPLACE_HEIGHT * scale) / 2)}px`);
  });
  observer.observe(document.documentElement);
}

// Every part that reports ready is told to hold; once all are ready, they all get the same
// start time. A part that fails to load reports its error and keeps the others waiting.
function startPartsTogether() {
  const ready = new Set();
  window.addEventListener('message', (event) => {
    const frame = frames.find(({ contentWindow }) => contentWindow === event.source);
    if (!frame || event.origin !== location.origin || event.data?.type !== MESSAGE.ready) return;

    frame.contentWindow.postMessage({ type: MESSAGE.hold }, location.origin);
    ready.add(frame);
    if (ready.size < frames.length) return;

    const startAt = sharedNow() + START_LEAD_MS;
    frames.forEach(({ contentWindow }) => contentWindow.postMessage({ type: MESSAGE.start, startAt }, location.origin));
  });
}

startPartsTogether();
fitFireplaceToWindow();

if (new URLSearchParams(location.search).get('overlay') === '1') {
  const { showDesignOverlay } = await import('./debug.js');
  showDesignOverlay(fireplace);
}
