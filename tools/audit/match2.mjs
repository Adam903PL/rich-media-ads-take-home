// Coarse-to-fine matcher for opaque photos: tries several scale factors of the
// sprite relative to the big image, searching on 1/4-downscaled versions first.
// Usage: node match2.mjs <big.jpg> <part.jpg> [scales comma list, default 1]
import { execFileSync } from 'node:child_process';

const probe = (p) => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p]).toString().trim().split(',').map(Number);
function raw(p, w, h) {
  const d = execFileSync('ffmpeg', ['-v', 'error', '-i', p, '-vf', `scale=${w}:${h}:flags=area`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 30 });
  return { w, h, d };
}
function search(B, S, x0, x1, y0, y1, step, sampleStep) {
  let best = { s: Infinity };
  for (let oy = Math.max(0, y0); oy <= Math.min(B.h - S.h, y1); oy += step)
    for (let ox = Math.max(0, x0); ox <= Math.min(B.w - S.w, x1); ox += step) {
      let s = 0, n = 0;
      for (let y = 0; y < S.h; y += sampleStep) for (let x = 0; x < S.w; x += sampleStep) {
        s += Math.abs(B.d[(oy + y) * B.w + ox + x] - S.d[y * S.w + x]); n++;
      }
      s /= n;
      if (s < best.s) best = { s, x: ox, y: oy };
    }
  return best;
}
const [bigP, partP, scalesStr = '1'] = process.argv.slice(2);
const [BW, BH] = probe(bigP), [PW, PH] = probe(partP);
for (const sc of scalesStr.split(',').map(Number)) {
  const pw = Math.round(PW * sc), ph = Math.round(PH * sc);
  if (pw > BW || ph > BH) { console.log(`scale ${sc}: part larger than big`); continue; }
  const k = 4;
  const Bs = raw(bigP, Math.round(BW / k), Math.round(BH / k));
  const Ss = raw(partP, Math.round(pw / k), Math.round(ph / k));
  const c = search(Bs, Ss, 0, Bs.w, 0, Bs.h, 1, 3);
  const B = raw(bigP, BW, BH), S = raw(partP, pw, ph);
  const f = search(B, S, c.x * k - 8, c.x * k + 8, c.y * k - 8, c.y * k + 8, 1, 4);
  console.log(`${partP} scale=${sc} (${pw}x${ph}) -> x=${f.x} y=${f.y} meanAbsDiff(gray)=${f.s.toFixed(2)}`);
}
