// Preview page: the three parts in iframes, laid out as one fireplace and fitted to the window.
const FIREPLACE_WIDTH = 1680;
const FIREPLACE_HEIGHT = 975;

const fireplace = document.getElementById('fireplace');
if (!fireplace) {
  throw new Error('Fireplace preview: #fireplace is missing from preview.html');
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

fitFireplaceToWindow();

if (new URLSearchParams(location.search).get('overlay') === '1') {
  const { showDesignOverlay } = await import('./debug.js');
  showDesignOverlay(fireplace);
}
