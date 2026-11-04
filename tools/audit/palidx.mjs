// Decodes palette-index PNGs (non-interlaced) and reports per-index pixel counts,
// bbox of each index, and whether "middle" indices sit on glyph edges (AA evidence).
import fs from 'node:fs';
import zlib from 'node:zlib';

function decode(p) {
  const d = fs.readFileSync(p);
  let i = 8, w, h, bd, ct, idat = [];
  while (i < d.length) {
    const len = d.readUInt32BE(i), type = d.toString('latin1', i + 4, i + 8);
    const body = d.subarray(i + 8, i + 8 + len);
    if (type === 'IHDR') { w = body.readUInt32BE(0); h = body.readUInt32BE(4); bd = body[8]; ct = body[9]; }
    if (type === 'IDAT') idat.push(body);
    i += 12 + len;
  }
  if (ct !== 3) throw new Error(`${p}: not palette (ct=${ct})`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = Math.ceil((w * bd) / 8);
  const bpp = 1;
  const out = Buffer.alloc(stride * h);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[x] = v & 255;
    }
    cur.copy(out, y * stride);
    prev = cur;
  }
  const idx = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const bit = x * bd, byte = out[y * stride + (bit >> 3)];
    idx[y * w + x] = (byte >> (8 - bd - (bit & 7))) & ((1 << bd) - 1);
  }
  return { w, h, idx };
}

for (const p of process.argv.slice(2)) {
  const { w, h, idx } = decode(p);
  const stats = {};
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = idx[y * w + x];
    const s = (stats[k] ??= { n: 0, x1: w, y1: h, x2: -1, y2: -1, edge: 0 });
    s.n++; s.x1 = Math.min(s.x1, x); s.y1 = Math.min(s.y1, y); s.x2 = Math.max(s.x2, x); s.y2 = Math.max(s.y2, y);
    // edge = touches index 0 (background) in 4-neighbourhood
    if (k !== 0) {
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
        const xx = x + dx, yy = y + dy;
        return xx >= 0 && yy >= 0 && xx < w && yy < h && idx[yy * w + xx] === 0;
      });
      if (nb) s.edge++;
    }
  }
  console.log(`== ${p} ${w}x${h}`);
  for (const [k, s] of Object.entries(stats).sort((a, b) => a[0] - b[0]))
    console.log(`  idx ${String(k).padStart(2)}: ${String(s.n).padStart(8)} px  bbox x${s.x1}-${s.x2} y${s.y1}-${s.y2}  touching-bg ${(100 * s.edge / s.n).toFixed(0)}%`);
  // corner sample for small images
  if (w < 400) console.log('  corners idx:', idx[0], idx[w - 1], idx[(h - 1) * w], idx[h * w - 1], ' centre idx:', idx[(h >> 1) * w + (w >> 1)]);
}
