// Obstacle layout (D-010): top-left corners in track coordinates, CSS px. Each
// obstacle appears exactly once; sizes come from the images. Checked by
// tools/audit/level-check.mjs (on a gut tube, reachable, passed before the gut ends).
export const OBSTACLES = [
  { id: 'txt3', x: 410, y: 430 },
  { id: 'bac5', x: 524, y: 348 },
  { id: 'txt7', x: 720, y: 490 },
  { id: 'bac1', x: 850, y: 240 },
  { id: 'txt4', x: 1000, y: 428 },
  { id: 'bac3', x: 1110, y: 300 },
  { id: 'txt1', x: 1230, y: 480 },
  { id: 'bac6', x: 1320, y: 248 },
  { id: 'txt2', x: 1420, y: 418 },
  { id: 'bac2', x: 1530, y: 230 },
  { id: 'txt6', x: 1640, y: 428 },
  { id: 'bac4', x: 1750, y: 345.5 },
  { id: 'txt8', x: 1850, y: 250 },
  { id: 'txt9', x: 1939.5, y: 247.5 },
  { id: 'txt5', x: 2125, y: 236 },
];

export function obstacleSource(id) {
  return `assets/01_game/${id}.png`;
}
