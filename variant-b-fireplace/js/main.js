// Shared entry of the three fireplace parts (top, left, right); #stage names its part.
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

stage.classList.add('is-ready');
