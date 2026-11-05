// Development aids, loaded only through URL parameters. design/ is not shipped with the ad.
import { PLAYER_LEFT, PLAYER_TOP_MAX, PLAYER_TOP_MIN, TRACK_LEFT } from './game.js';

const STAGE_WIDTH = 360;
const STAGE_HEIGHT = 640;
const MASK_SCALE = 2;
const COLORS = {
  player: [255, 214, 0],
  obstacle: [0, 220, 255],
  hit: [255, 40, 40],
};

export function showDesignOverlay(stage) {
  const overlay = new Image();
  overlay.className = 'layer design-overlay';
  overlay.src = 'design/01-start.png';
  overlay.alt = '';
  stage.append(overlay);
}

function maskToCanvas(mask, [red, green, blue]) {
  const canvas = document.createElement('canvas');
  canvas.width = mask.width;
  canvas.height = mask.height;
  const context = canvas.getContext('2d');
  const pixels = context.createImageData(mask.width, mask.height);
  for (let index = 0; index < mask.data.length; index++) {
    if (mask.data[index] === 1) pixels.data.set([red, green, blue, 150], index * 4);
  }
  context.putImageData(pixels, 0, 0);
  return canvas;
}

// Draws the collision masks (the player's after erosion), their boxes and the player's
// cloud limits; the obstacle or limit that ended the run turns red.
export function showHitboxes(stage, { obstacles, playerMask }) {
  const layer = document.createElement('canvas');
  layer.className = 'debug-layer';
  layer.width = STAGE_WIDTH * MASK_SCALE;
  layer.height = STAGE_HEIGHT * MASK_SCALE;
  stage.append(layer);

  const context = layer.getContext('2d');
  context.scale(MASK_SCALE, MASK_SCALE);
  context.imageSmoothingEnabled = false;
  context.lineWidth = 1;

  const playerWidth = playerMask.width / MASK_SCALE;
  const playerHeight = playerMask.height / MASK_SCALE;
  const playerSprite = maskToCanvas(playerMask, COLORS.player);
  const obstacleSprites = obstacles.map(({ mask }) => ({
    normal: maskToCanvas(mask, COLORS.obstacle),
    hit: maskToCanvas(mask, COLORS.hit),
  }));

  return ({ scroll, top, failCause }) => {
    context.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    obstacles.forEach((obstacle, index) => {
      const left = obstacle.x + TRACK_LEFT - scroll;
      if (left > STAGE_WIDTH || left + obstacle.width < 0) return;
      const isHit = obstacle.id === failCause;
      context.drawImage(isHit ? obstacleSprites[index].hit : obstacleSprites[index].normal, left, obstacle.y, obstacle.width, obstacle.height);
      context.strokeStyle = isHit ? 'red' : 'cyan';
      context.strokeRect(left, obstacle.y, obstacle.width, obstacle.height);
    });

    context.strokeStyle = failCause === 'clouds' ? 'red' : 'yellow';
    context.setLineDash([4, 3]);
    context.strokeRect(PLAYER_LEFT, PLAYER_TOP_MIN, playerWidth, PLAYER_TOP_MAX + playerHeight - PLAYER_TOP_MIN);
    context.setLineDash([]);
    context.drawImage(playerSprite, PLAYER_LEFT, top, playerWidth, playerHeight);
    context.strokeRect(PLAYER_LEFT, top, playerWidth, playerHeight);
  };
}
