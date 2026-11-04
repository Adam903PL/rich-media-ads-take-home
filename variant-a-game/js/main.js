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

const root = document.getElementById('ad');
const stage = document.getElementById('stage');

if (!root || !stage) {
  throw new Error('Gut Run: #ad or #stage is missing from index.html');
}

fitStageToViewport(root, stage);
