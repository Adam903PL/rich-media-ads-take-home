import { masksOverlap } from './collision.js';

// All values are logical stage px (360×640) and seconds. Sources: docs/asset-audit.md,
// D-008, D-009, D-011. Exported for tools/audit/level-check.mjs.
// Positions mirror .player and .track in style.css.
export const PLAYER_LEFT = 55.5;
const PLAYER_START_TOP = 258.5;
export const TRACK_LEFT = -2;
// Highest and lowest player top that does not touch the clouds with the 2 px collision
// tolerance (tools/audit/cloud-limits.mjs --tolerance=2).
export const PLAYER_TOP_MIN = 230;
export const PLAYER_TOP_MAX = 535.5;
export const COLLISION_TOLERANCE = 2;
export const READY_TOP = (PLAYER_TOP_MIN + PLAYER_TOP_MAX) / 2;
export const READY_SECONDS = 0.6;
// Gut width 2528 − stage width 360 − the gut's 2 px start offset.
export const SCROLL_END = 2166;
export const SCROLL_SPEED = 145;
export const GRAVITY = 1600;
export const JUMP_VELOCITY = -420;
export const MAX_FALL_SPEED = 650;
const MAX_FRAME_SECONDS = 1 / 30;
const JUMP_KEYS = new Set(['Space', 'ArrowUp']);

function easeInOutCubic(progress) {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

// Starts one run on the start screen. `obstacles` are sorted by x; `onStateChange`
// receives every new state; `onFrame` (debug mode only) receives the frame's view.
// The returned `destroy()` removes everything the run registered.
export function startGame({ root, track, player, playerMask, obstacles, onStateChange, onFrame }) {
  const playerWidth = playerMask.width / 2;
  const listeners = new AbortController();
  const run = {
    state: 'start',
    scroll: 0,
    top: PLAYER_START_TOP,
    velocity: 0,
    readyElapsed: 0,
    passedCount: 0,
    failCause: null,
    frameRequest: 0,
    lastTime: 0,
  };

  function setState(state) {
    run.state = state;
    root.dataset.state = state;
    onStateChange(state);
  }

  function isRunning() {
    return run.state === 'ready' || run.state === 'playing';
  }

  function hasEnded() {
    return run.state === 'fail' || run.state === 'win';
  }

  function updateReady(seconds) {
    run.readyElapsed = Math.min(run.readyElapsed + seconds, READY_SECONDS);
    const progress = easeInOutCubic(run.readyElapsed / READY_SECONDS);
    run.top = PLAYER_START_TOP + (READY_TOP - PLAYER_START_TOP) * progress;

    if (run.readyElapsed === READY_SECONDS) {
      setState('playing');
    }
  }

  function obstacleLeft(obstacle) {
    return obstacle.x + TRACK_LEFT - run.scroll;
  }

  // Counts obstacles behind the player and returns the one it touches, if any.
  // Obstacles are sorted by x, so the scan stops at the first one still ahead.
  function hitObstacle() {
    while (run.passedCount < obstacles.length) {
      const next = obstacles[run.passedCount];
      if (obstacleLeft(next) + next.width >= PLAYER_LEFT) break;
      run.passedCount++;
    }
    for (let index = run.passedCount; index < obstacles.length; index++) {
      const obstacle = obstacles[index];
      const left = obstacleLeft(obstacle);
      if (left >= PLAYER_LEFT + playerWidth) break;
      if (masksOverlap(playerMask, PLAYER_LEFT, run.top, obstacle.mask, left, obstacle.y)) return obstacle;
    }
    return null;
  }

  function fail(cause) {
    run.failCause = cause;
    setState('fail');
  }

  function updatePlaying(seconds) {
    run.velocity = Math.min(run.velocity + GRAVITY * seconds, MAX_FALL_SPEED);
    run.top += run.velocity * seconds;

    if (run.top < PLAYER_TOP_MIN || run.top > PLAYER_TOP_MAX) {
      // Stop exactly at the touching point instead of a frame's travel inside the clouds.
      run.top = Math.min(Math.max(run.top, PLAYER_TOP_MIN), PLAYER_TOP_MAX);
      fail('clouds');
      return;
    }

    const obstacle = hitObstacle();
    if (obstacle) {
      fail(obstacle.id);
    } else if (run.scroll === SCROLL_END && run.passedCount === obstacles.length) {
      setState('win');
    }
  }

  function update(seconds) {
    run.scroll = Math.min(run.scroll + SCROLL_SPEED * seconds, SCROLL_END);

    if (run.state === 'ready') {
      updateReady(seconds);
    } else {
      updatePlaying(seconds);
    }
  }

  function notifyFrame() {
    onFrame?.({ scroll: run.scroll, top: run.top, failCause: run.failCause });
  }

  function render() {
    track.style.transform = `translateX(${-run.scroll}px)`;
    player.style.transform = `translateY(${run.top - PLAYER_START_TOP}px)`;
    notifyFrame();
  }

  function frame(time) {
    const seconds = Math.min(Math.max((time - run.lastTime) / 1000, 0), MAX_FRAME_SECONDS);
    run.lastTime = time;
    update(seconds);
    render();

    if (isRunning()) {
      run.frameRequest = requestAnimationFrame(frame);
    }
  }

  function startLoop() {
    cancelAnimationFrame(run.frameRequest);
    run.lastTime = performance.now();
    run.frameRequest = requestAnimationFrame(frame);
  }

  function handleInput() {
    if (run.state === 'start') {
      setState('ready');
      startLoop();
    } else if (run.state === 'playing') {
      run.velocity = JUMP_VELOCITY;
    }
  }

  const { signal } = listeners;

  root.addEventListener('pointerdown', handleInput, { signal });

  // After the run ends the keys are left alone, so Space and Enter keep
  // activating the endcard buttons.
  document.addEventListener('keydown', (event) => {
    if (hasEnded() || !JUMP_KEYS.has(event.code) || event.repeat) {
      return;
    }
    event.preventDefault();
    handleInput();
  }, { signal });

  document.addEventListener('visibilitychange', () => {
    if (!isRunning()) {
      return;
    }
    if (document.hidden) {
      cancelAnimationFrame(run.frameRequest);
    } else {
      startLoop();
    }
  }, { signal });

  // A new run resets the state and the transforms a previous run left behind.
  setState('start');
  render();

  return {
    destroy() {
      listeners.abort();
      cancelAnimationFrame(run.frameRequest);
    },
  };
}
