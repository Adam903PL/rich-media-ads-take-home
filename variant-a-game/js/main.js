import { createMask, erodeMask } from './collision.js';
import { COLLISION_TOLERANCE, startGame } from './game.js';
import { OBSTACLES, obstacleSource } from './level.js';

const STAGE_WIDTH = 360;
const STAGE_HEIGHT = 640;
const MIN_VISIBLE_STRIP_PX = 1;

function scaleToFit(width, height) {
  const fitWidth = width / STAGE_WIDTH;
  const fitHeight = height / STAGE_HEIGHT;
  const scale = Math.min(fitWidth, fitHeight);
  const strip = Math.max(width - STAGE_WIDTH * scale, height - STAGE_HEIGHT * scale);

  // A strip thinner than 1 px only shows up as a hairline next to the logo bar,
  // so close it by covering instead; that crops less than 1 px per edge.
  return strip < MIN_VISIBLE_STRIP_PX ? Math.max(fitWidth, fitHeight) : scale;
}

function fitStageToViewport(root, stage) {
  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    stage.style.setProperty('--stage-scale', scaleToFit(width, height));
  });
  observer.observe(root);
}

async function preloadImages(images) {
  const results = await Promise.allSettled(images.map((image) => image.decode()));
  const failed = images.filter((image, index) => results[index].status === 'rejected');

  if (failed.length > 0) {
    const files = failed.map((image) => image.getAttribute('src')).join(', ');
    throw new Error(`Gut Run: failed to load ${files}`);
  }
}

function addObstacleImages(track) {
  return [...OBSTACLES]
    .sort((a, b) => a.x - b.x)
    .map(({ id, x, y }) => {
      const image = new Image();
      image.className = 'obstacle';
      image.src = obstacleSource(id);
      image.alt = '';
      image.draggable = false;
      image.style.left = `${x}px`;
      image.style.top = `${y}px`;
      track.append(image);
      return { id, x, y, image };
    });
}

// Sizes come from the 2x images, so level.js only stores positions.
function prepareObstacles(obstacles) {
  return obstacles.map(({ id, x, y, image }) => {
    const width = image.naturalWidth / 2;
    const height = image.naturalHeight / 2;
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    return { id, x, y, width, height, mask: createMask(image) };
  });
}

const root = document.getElementById('ad');
const stage = document.getElementById('stage');
const track = stage?.querySelector('.track');
const player = stage?.querySelector('.player');

if (!root || !stage || !track || !player) {
  throw new Error('Gut Run: #ad, #stage, .track or .player is missing from index.html');
}

fitStageToViewport(root, stage);
const obstacleImages = addObstacleImages(track);

// The stage stays hidden until every layer is decoded, so it never appears half-loaded.
await preloadImages([...stage.querySelectorAll('img')]);
const obstacles = prepareObstacles(obstacleImages);
const playerMask = erodeMask(createMask(player), COLLISION_TOLERANCE);
stage.classList.add('is-ready');

const params = new URLSearchParams(location.search);
const debug = params.has('debug') || params.has('overlay') ? await import('./debug.js') : null;
if (params.get('overlay') === '1') {
  debug.showDesignOverlay(stage);
}
const onFrame = params.get('debug') === '1' ? debug.showHitboxes(stage, { obstacles, playerMask }) : undefined;

startGame({ root, track, player, playerMask, obstacles, onFrame });
