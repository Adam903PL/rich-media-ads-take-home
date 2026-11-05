// All values are logical stage px (360×640) and seconds. Sources: docs/asset-audit.md, D-008, D-009.
const PLAYER_START_TOP = 258.5;
// Highest and lowest player top at which no opaque pixel touches the clouds
// (tools/audit/cloud-limits.mjs).
const PLAYER_TOP_MIN = 232.5;
const PLAYER_TOP_MAX = 533.5;
const READY_TOP = (PLAYER_TOP_MIN + PLAYER_TOP_MAX) / 2;
const READY_SECONDS = 0.6;
// Gut width 2528 − stage width 360 − the gut's 2 px start offset.
const SCROLL_END = 2166;
const SCROLL_SPEED = 145;
const GRAVITY = 1600;
const JUMP_VELOCITY = -420;
const MAX_FALL_SPEED = 650;
const MAX_FRAME_SECONDS = 1 / 30;
const JUMP_KEYS = new Set(['Space', 'ArrowUp']);

function easeInOutCubic(progress) {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

export function startGame({ root, gut, player }) {
  const run = {
    state: 'start',
    scroll: 0,
    top: PLAYER_START_TOP,
    velocity: 0,
    readyElapsed: 0,
    frameRequest: 0,
    lastTime: 0,
  };

  function setState(state) {
    run.state = state;
    root.dataset.state = state;
  }

  function isRunning() {
    return run.state === 'ready' || run.state === 'playing';
  }

  function updateReady(seconds) {
    run.readyElapsed = Math.min(run.readyElapsed + seconds, READY_SECONDS);
    const progress = easeInOutCubic(run.readyElapsed / READY_SECONDS);
    run.top = PLAYER_START_TOP + (READY_TOP - PLAYER_START_TOP) * progress;

    if (run.readyElapsed === READY_SECONDS) {
      setState('playing');
    }
  }

  function updatePlaying(seconds) {
    run.velocity = Math.min(run.velocity + GRAVITY * seconds, MAX_FALL_SPEED);
    run.top += run.velocity * seconds;

    if (run.top < PLAYER_TOP_MIN || run.top > PLAYER_TOP_MAX) {
      // Stop exactly at the touching point instead of a frame's travel inside the clouds.
      run.top = Math.min(Math.max(run.top, PLAYER_TOP_MIN), PLAYER_TOP_MAX);
      setState('fail');
    } else if (run.scroll === SCROLL_END) {
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

  function render() {
    gut.style.transform = `translateX(${-run.scroll}px)`;
    player.style.transform = `translateY(${run.top - PLAYER_START_TOP}px)`;
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

  root.addEventListener('pointerdown', handleInput);

  document.addEventListener('keydown', (event) => {
    if (!JUMP_KEYS.has(event.code) || event.repeat) {
      return;
    }
    event.preventDefault();
    handleInput();
  });

  document.addEventListener('visibilitychange', () => {
    if (!isRunning()) {
      return;
    }
    if (document.hidden) {
      cancelAnimationFrame(run.frameRequest);
    } else {
      startLoop();
    }
  });
}
