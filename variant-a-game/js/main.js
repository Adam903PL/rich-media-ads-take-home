import { loadSounds, setupAudio } from './audio.js';
import { createMask, erodeMask } from './collision.js';
import { find } from './dom.js';
import { setupEndcards } from './endcards.js';
import { COLLISION_TOLERANCE, startGame } from './game.js';
import { setupIntro } from './intro.js';
import { OBSTACLES, obstacleSource } from './level.js';
import { gsap } from './motion.js';

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

const ENDCARD_SOUNDS = { fail: ['fail'], win: ['cheer', 'applause'] };

const root = find(document, '#ad');
const stage = find(document, '#stage');
const track = find(stage, '.track');
const player = find(stage, '.player');
const muteButton = find(stage, '.mute');

fitStageToViewport(root, stage);
const obstacleImages = addObstacleImages(track);

// The stage stays hidden until every layer and sound is decoded, so it never appears half-loaded.
const [, sounds] = await Promise.all([preloadImages([...stage.querySelectorAll('img')]), loadSounds()]);
const obstacles = prepareObstacles(obstacleImages);
const playerMask = erodeMask(createMask(player), COLLISION_TOLERANCE);
const audio = setupAudio(sounds, muteButton);
const endcards = setupEndcards(stage, {
  onReplay: replay,
  onCue: (outcome) => ENDCARD_SOUNDS[outcome].forEach((name) => audio.play(name)),
});
const intro = setupIntro(stage);

const params = new URLSearchParams(location.search);
const wantsOverlay = params.get('overlay') === '1';
const wantsHitboxes = params.get('debug') === '1';
const debug = wantsOverlay || wantsHitboxes ? await import('./debug.js') : null;
if (wantsOverlay) {
  debug.showDesignOverlay(stage);
}
const onFrame = wantsHitboxes ? debug.showHitboxes(stage, { obstacles, playerMask }) : undefined;

let game = null;

function handleStateChange(state) {
  if (state === 'start') {
    intro.play();
  } else if (state === 'ready') {
    intro.finish();
    audio.startMusic();
  } else if (state === 'fail' || state === 'win') {
    audio.stopMusic();
    if (state === 'fail') audio.play('crash');
    endcards.show(state);
  }
}

function startRun() {
  game = startGame({ root, track, player, playerMask, obstacles, onStateChange: handleStateChange, onFrame });
}

// The previous run is torn down completely before the next one starts on the start screen.
function replay() {
  game.destroy();
  endcards.hide();
  audio.stopAll();
  startRun();
}

// Animations and sound pause with the page.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
    audio.suspend();
  } else {
    gsap.globalTimeline.resume();
    audio.resume();
  }
});

startRun();
// Revealed only now: the game already listens for taps and the intro waits at its first frame.
stage.classList.add('is-ready');
