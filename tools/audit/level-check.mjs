// Checks the Variant A obstacle layout (variant-a-game/js/level.js) against the D-010 rules
// and prints a passability table. Read-only; needs ffmpeg on PATH.
// Usage: node tools/audit/level-check.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { OBSTACLES, obstacleSource } from '../../variant-a-game/js/level.js';
import {
  PLAYER_LEFT, TRACK_LEFT, PLAYER_TOP_MIN, PLAYER_TOP_MAX, COLLISION_TOLERANCE,
  READY_TOP, READY_SECONDS, SCROLL_END, SCROLL_SPEED, GRAVITY, MAX_FALL_SPEED, JUMP_VELOCITY,
} from '../../variant-a-game/js/game.js';

const VARIANT_DIR = 'variant-a-game';
const PLAYER_WIDTH = 42;
const PLAYER_HEIGHT = 41;
const STAGE_WIDTH = 360;
const BAND = [226, 582]; // vertical band the obstacles may occupy
const TUBE_MARGIN = 2; // obstacle box plus this margin must lie on an opaque tube
// Free vertical room beside an obstacle: one jump arc (the player bobs by that much
// while tapping to hold its height) plus a margin.
const JUMP_ARC = JUMP_VELOCITY ** 2 / (2 * GRAVITY);
const MIN_CORRIDOR = JUMP_ARC + 10;
const HUMAN_CLIMB_RATE = 200; // px/s a person reaches by tapping about five times a second
const EXPECTED_IDS = ['bac1', 'bac2', 'bac3', 'bac4', 'bac5', 'bac6', 'txt1', 'txt2', 'txt3', 'txt4', 'txt5', 'txt6', 'txt7', 'txt8', 'txt9'];

function pngSize(file) {
  const header = fs.readFileSync(file).subarray(16, 24);
  return { width: header.readUInt32BE(0) / 2, height: header.readUInt32BE(4) / 2 };
}

// Summed-area table of non-opaque gut pixels on the 2x grid, for O(1) "is this box fully on a tube".
function tubeHoles() {
  const file = path.join(VARIANT_DIR, 'assets/01_game/gameplay.png');
  const alpha = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', 'format=rgba,alphaextract', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 26 });
  const width = 5056;
  const height = 1280;
  const table = new Int32Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += alpha[y * width + x] < 250 ? 1 : 0;
      table[(y + 1) * (width + 1) + x + 1] = table[y * (width + 1) + x + 1] + row;
    }
  }
  return (x, y, w, h) => {
    const [x0, y0, x1, y1] = [Math.floor(x * 2), Math.floor(y * 2), Math.ceil((x + w) * 2), Math.ceil((y + h) * 2)];
    if (x0 < 0 || y0 < 0 || x1 > width || y1 > height) return Infinity;
    return table[y1 * (width + 1) + x1] - table[y0 * (width + 1) + x1] - table[y1 * (width + 1) + x0] + table[y0 * (width + 1) + x0];
  };
}

function dropCapacity(seconds) {
  const timeToMaxSpeed = MAX_FALL_SPEED / GRAVITY;
  if (seconds <= timeToMaxSpeed) return 0.5 * GRAVITY * seconds ** 2;
  return 0.5 * GRAVITY * timeToMaxSpeed ** 2 + MAX_FALL_SPEED * (seconds - timeToMaxSpeed);
}

function intersect([a1, a2], [b1, b2]) {
  const range = [Math.max(a1, b1), Math.min(a2, b2)];
  return range[0] <= range[1] ? range : null;
}

const holes = tubeHoles();
const errors = [];
const obstacles = OBSTACLES.map((obstacle) => {
  const { width, height } = pngSize(path.join(VARIANT_DIR, obstacleSource(obstacle.id)));
  const corridors = {
    above: [PLAYER_TOP_MIN, obstacle.y - PLAYER_HEIGHT + COLLISION_TOLERANCE],
    below: [obstacle.y + height - COLLISION_TOLERANCE, PLAYER_TOP_MAX],
  };
  for (const side of Object.keys(corridors)) {
    if (corridors[side][1] - corridors[side][0] < MIN_CORRIDOR) delete corridors[side];
  }
  return {
    ...obstacle, width, height, corridors,
    scrollIn: obstacle.x + TRACK_LEFT - (PLAYER_LEFT + PLAYER_WIDTH),
    scrollOut: obstacle.x + width + TRACK_LEFT - PLAYER_LEFT,
    onTube: holes(obstacle.x - TUBE_MARGIN, obstacle.y - TUBE_MARGIN, width + 2 * TUBE_MARGIN, height + 2 * TUBE_MARGIN) === 0,
  };
}).sort((a, b) => a.scrollIn - b.scrollIn);

const ids = obstacles.map((obstacle) => obstacle.id).sort();
if (ids.join() !== EXPECTED_IDS.join()) errors.push(`ids must be exactly ${EXPECTED_IDS.join(', ')}; got ${ids.join(', ')}`);
// Nearest on-tube top-left corner, searched on the 2x grid, to make fixing the layout quick.
function nearestOnTube({ x, y, width, height }) {
  for (let distance = 0.5; distance <= 80; distance += 0.5) {
    for (let dx = -distance; dx <= distance; dx += 0.5) {
      for (const dy of [distance - Math.abs(dx), Math.abs(dx) - distance]) {
        const [cx, cy] = [x + dx, y + dy];
        if (cy < BAND[0] || cy + height > BAND[1]) continue;
        if (holes(cx - TUBE_MARGIN, cy - TUBE_MARGIN, width + 2 * TUBE_MARGIN, height + 2 * TUBE_MARGIN) === 0) return `${cx},${cy}`;
      }
    }
  }
  return 'none within 80 px';
}

for (const obstacle of obstacles) {
  if (!obstacle.onTube) errors.push(`${obstacle.id}: not fully on a tube (nearest on-tube corner ${nearestOnTube(obstacle)})`);
  if (obstacle.y < BAND[0] || obstacle.y + obstacle.height > BAND[1]) errors.push(`${obstacle.id}: outside the band ${BAND.join('–')}`);
  if (obstacle.x + TRACK_LEFT < STAGE_WIDTH) errors.push(`${obstacle.id}: visible on the start screen`);
  if (obstacle.scrollOut > SCROLL_END) errors.push(`${obstacle.id}: not passed before the gut ends`);
  if (Object.keys(obstacle.corridors).length === 0) errors.push(`${obstacle.id}: no corridor of ${MIN_CORRIDOR.toFixed(1)} px for the player`);
}

// Propagate the reachable range of player tops from obstacle to obstacle, per side.
let reachable = { start: [READY_TOP, READY_TOP] };
let previousOut = SCROLL_SPEED * READY_SECONDS;
const rows = [];
for (const obstacle of obstacles) {
  const seconds = (obstacle.scrollIn - previousOut) / SCROLL_SPEED;
  const climb = HUMAN_CLIMB_RATE * Math.max(seconds, 0);
  const drop = dropCapacity(Math.max(seconds, 0));
  const next = {};
  for (const [side, corridor] of Object.entries(obstacle.corridors)) {
    const hits = Object.values(reachable)
      .map(([low, high]) => intersect([Math.max(low - climb, PLAYER_TOP_MIN), Math.min(high + drop, PLAYER_TOP_MAX)], corridor))
      .filter(Boolean);
    if (hits.length) next[side] = [Math.min(...hits.map((h) => h[0])), Math.max(...hits.map((h) => h[1]))];
  }
  rows.push({ obstacle, seconds, reachable: next });
  if (Object.keys(next).length === 0) errors.push(`${obstacle.id}: not reachable within ${seconds.toFixed(2)} s from the previous obstacle`);
  reachable = Object.keys(next).length ? next : reachable;
  previousOut = obstacle.scrollOut;
}

// Backward pass: a reachable side is "winning" if a winning side of the next obstacle can be
// reached from it in time. A reachable but non-winning side is a dead end for the player.
for (let index = rows.length - 1; index >= 0; index--) {
  const row = rows[index];
  const following = rows[index + 1];
  row.winning = Object.keys(row.reachable).filter((side) => {
    if (!following) return true;
    const [low, high] = row.reachable[side];
    const seconds = Math.max(following.seconds, 0);
    const range = [Math.max(low - HUMAN_CLIMB_RATE * seconds, PLAYER_TOP_MIN), Math.min(high + dropCapacity(seconds), PLAYER_TOP_MAX)];
    return following.winning.some((nextSide) => intersect(range, following.obstacle.corridors[nextSide]));
  });
}
if (rows.length && rows[0].winning.length === 0) errors.push('no complete path from the start to the end of the gut');

console.log('id    x     y     size         on tube  window   reachable      winning');
for (const { obstacle, seconds, reachable: sides, winning } of rows) {
  const size = `${obstacle.width}x${obstacle.height}`;
  const reachableSides = Object.keys(sides).join(' / ') || '-';
  console.log(`${obstacle.id.padEnd(5)} ${String(obstacle.x).padStart(5)} ${String(obstacle.y).padStart(5)}  ${size.padEnd(11)}  ${obstacle.onTube ? 'yes' : 'NO '}      ${seconds.toFixed(2).padStart(5)} s  ${reachableSides.padEnd(13)}  ${winning.join(' / ') || '-'}`);
}
console.log(errors.length ? `\n${errors.length} problem(s):\n- ${errors.join('\n- ')}` : '\nAll D-010 rules pass.');
process.exitCode = errors.length ? 1 : 0;
