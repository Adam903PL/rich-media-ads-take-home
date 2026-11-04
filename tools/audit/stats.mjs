// Per-channel mean/std of a region: node stats.mjs <img> <x> <y> <w> <h>
import { execFileSync } from 'node:child_process';
const [p, x, y, w, h] = process.argv.slice(2);
const d = execFileSync('ffmpeg', ['-v', 'error', '-i', p, '-vf', `crop=${w}:${h}:${x}:${y}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });
const n = d.length / 3, m = [0, 0, 0], s = [0, 0, 0];
for (let i = 0; i < d.length; i += 3) for (let c = 0; c < 3; c++) m[c] += d[i + c];
for (let c = 0; c < 3; c++) m[c] /= n;
for (let i = 0; i < d.length; i += 3) for (let c = 0; c < 3; c++) s[c] += (d[i + c] - m[c]) ** 2;
console.log(`mean ${m.map((v) => v.toFixed(1)).join(' ')}  std ${s.map((v) => Math.sqrt(v / n).toFixed(1)).join(' ')}`);
