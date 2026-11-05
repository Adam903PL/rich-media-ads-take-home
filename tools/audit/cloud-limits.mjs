// Highest and lowest player top at which no opaque player pixel touches an opaque pixel
// of the static cloud bands (border.png). Usage: node cloud-limits.mjs [variant-a-game/assets]
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const assetsDir = process.argv[2] ?? 'variant-a-game/assets';
// @2x pixels; CSS 55.5 / 258.5 from docs/asset-audit.md, section 2.1.
const PLAYER_X = 111;
const PLAYER_START_Y = 517;
const ALPHA_THRESHOLD = 128;

function alphaMask(file) {
  const size = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file]);
  const [width, height] = size.toString().trim().split(',').map(Number);
  const data = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', 'format=rgba,alphaextract', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 26 });
  return { width, height, data };
}

const border = alphaMask(path.join(assetsDir, 'border.png'));
const player = alphaMask(path.join(assetsDir, '01_game', 'player.png'));

function touchesClouds(playerY) {
  for (let y = 0; y < player.height; y++) {
    const borderY = playerY + y;
    if (borderY < 0 || borderY >= border.height) continue;
    for (let x = 0; x < player.width; x++) {
      const playerOpaque = player.data[y * player.width + x] >= ALPHA_THRESHOLD;
      if (playerOpaque && border.data[borderY * border.width + PLAYER_X + x] >= ALPHA_THRESHOLD) return true;
    }
  }
  return false;
}

if (touchesClouds(PLAYER_START_Y)) {
  throw new Error('The player already touches the clouds at its start position');
}

let highest = PLAYER_START_Y;
while (highest > 0 && !touchesClouds(highest - 1)) highest--;
let lowest = PLAYER_START_Y;
while (lowest < border.height && !touchesClouds(lowest + 1)) lowest++;

console.log(`player top range @2x: ${highest}..${lowest}  (CSS ${highest / 2}..${lowest / 2})`);
