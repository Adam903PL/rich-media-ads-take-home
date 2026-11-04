// Finds horizontal text-line bands in an image: rows where any pixel's "ink" passes a threshold.
// ink = alpha (RGBA) or luminance (for opaque white-on-black palette files with mode=luma).
// Usage: node bands.mjs <img> [alpha|luma] [threshold]
import { execFileSync } from 'node:child_process';
const [p, mode = 'alpha', thr = '200'] = process.argv.slice(2);
const T = Number(thr);
const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p]).toString().trim().split(',').map(Number);
const d = execFileSync('ffmpeg', ['-v', 'error', '-i', p, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], { maxBuffer: 1 << 30 });
const bands = [];
let start = -1, x1 = w, x2 = -1;
for (let y = 0; y <= h; y++) {
  let hit = false;
  if (y < h) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const v = mode === 'luma' ? (d[i] + d[i + 1] + d[i + 2]) / 3 : d[i + 3];
    if (v >= T) { hit = true; x1 = Math.min(x1, x); x2 = Math.max(x2, x); }
  }
  if (hit && start < 0) start = y;
  if (!hit && start >= 0) { bands.push({ y1: start, y2: y - 1, x1, x2 }); start = -1; x1 = w; x2 = -1; }
}
// merge bands separated by < 6px (descenders, umlaut dots)
const merged = [];
for (const b of bands) {
  const last = merged.at(-1);
  if (last && b.y1 - last.y2 < 6) { last.y2 = b.y2; last.x1 = Math.min(last.x1, b.x1); last.x2 = Math.max(last.x2, b.x2); }
  else merged.push({ ...b });
}
console.log(p.split(/[\\/]/).slice(-3).join('/'));
for (const b of merged) console.log(`  @2x y${b.y1}-${b.y2} x${b.x1}-${b.x2}  | CSS top=${b.y1 / 2} h=${(b.y2 - b.y1 + 1) / 2} left=${b.x1 / 2} w=${(b.x2 - b.x1 + 1) / 2}`);
