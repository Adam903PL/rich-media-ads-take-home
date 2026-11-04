// Template matching: finds where an RGBA sprite sits inside a flat RGB design image.
// Usage: node match.mjs <design.png> <sprite.png> [<sprite.png> ...]
// Decodes via ffmpeg to raw RGBA, scores sampled opaque sprite pixels by mean abs diff.
import { execFileSync } from 'node:child_process';

function probe(p) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p]).toString().trim();
  const [w, h] = out.split(',').map(Number);
  return { w, h };
}
function raw(p) {
  const { w, h } = probe(p);
  const buf = execFileSync('ffmpeg', ['-v', 'error', '-i', p, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], { maxBuffer: 1 << 30 });
  return { w, h, d: buf };
}

const [designPath, ...sprites] = process.argv.slice(2);
const D = raw(designPath);

for (const sp of sprites) {
  const S = raw(sp);
  // opaque pixels only
  const opaque = [];
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
    const i = (y * S.w + x) * 4;
    if (S.d[i + 3] >= 250) opaque.push([x, y, S.d[i], S.d[i + 1], S.d[i + 2]]);
  }
  if (!opaque.length) { console.log(sp, 'no opaque pixels'); continue; }
  // deterministic subsample of ~400 pixels for coarse pass
  const step = Math.max(1, Math.floor(opaque.length / 400));
  const sample = opaque.filter((_, k) => k % step === 0);
  const score = (ox, oy, px) => {
    let s = 0;
    for (const [x, y, r, g, b] of px) {
      const i = ((oy + y) * D.w + (ox + x)) * 4;
      s += Math.abs(D.d[i] - r) + Math.abs(D.d[i + 1] - g) + Math.abs(D.d[i + 2] - b);
    }
    return s / (px.length * 3);
  };
  let best = { s: Infinity, x: 0, y: 0 };
  for (let oy = 0; oy <= D.h - S.h; oy += 2) for (let ox = 0; ox <= D.w - S.w; ox += 2) {
    const s = score(ox, oy, sample);
    if (s < best.s) best = { s, x: ox, y: oy };
  }
  // refine ±3 px with full opaque set
  let fine = { s: Infinity, x: best.x, y: best.y };
  for (let oy = Math.max(0, best.y - 3); oy <= Math.min(D.h - S.h, best.y + 3); oy++)
    for (let ox = Math.max(0, best.x - 3); ox <= Math.min(D.w - S.w, best.x + 3); ox++) {
      const s = score(ox, oy, opaque);
      if (s < fine.s) fine = { s, x: ox, y: oy };
    }
  const name = sp.split(/[\\/]/).slice(-2).join('/');
  console.log(`${name.padEnd(22)} ${S.w}x${S.h}  @2x x=${fine.x} y=${fine.y}  (CSS ${fine.x / 2}, ${fine.y / 2})  meanAbsDiff=${fine.s.toFixed(2)}`);
}
