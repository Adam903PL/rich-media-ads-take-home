// Highest and lowest player top at which the player does not touch the static cloud
// bands (border.png), using the game's own collision rule from variant-a-game/js/collision.js.
// Usage: node cloud-limits.mjs [--tolerance=<css px>] [assets dir]
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { erodeMask, masksOverlap } from '../../variant-a-game/js/collision.js';

const args = process.argv.slice(2);
const toleranceArg = args.find((arg) => arg.startsWith('--tolerance='));
const tolerance = toleranceArg ? Number(toleranceArg.split('=')[1]) : 0;
const assetsDir = args.find((arg) => !arg.startsWith('--')) ?? 'variant-a-game/assets';
// CSS px, docs/asset-audit.md section 2.1.
const PLAYER_LEFT = 55.5;
const PLAYER_START_TOP = 258.5;
const ALPHA_THRESHOLD = 128;
const STEP = 0.5; // one pixel of the 2x mask grid

function alphaMask(file) {
  const size = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file]);
  const [width, height] = size.toString().trim().split(',').map(Number);
  const alpha = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', 'format=rgba,alphaextract', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 26 });
  const data = new Uint8Array(width * height);
  for (let index = 0; index < data.length; index++) data[index] = alpha[index] >= ALPHA_THRESHOLD ? 1 : 0;
  return { width, height, data };
}

const border = alphaMask(path.join(assetsDir, 'border.png'));
const player = erodeMask(alphaMask(path.join(assetsDir, '01_game', 'player.png')), tolerance);
const touchesClouds = (top) => masksOverlap(player, PLAYER_LEFT, top, border, 0, 0);

if (touchesClouds(PLAYER_START_TOP)) {
  throw new Error('The player already touches the clouds at its start position');
}

let highest = PLAYER_START_TOP;
while (highest > 0 && !touchesClouds(highest - STEP)) highest -= STEP;
let lowest = PLAYER_START_TOP;
while (lowest < border.height / 2 && !touchesClouds(lowest + STEP)) lowest += STEP;

console.log(`tolerance ${tolerance} px: player top range ${highest}..${lowest} (CSS px)`);
