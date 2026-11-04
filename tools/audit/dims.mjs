import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];

function dims(p) {
  const d = fs.readFileSync(p);
  if (d.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    const w = d.readUInt32BE(16), h = d.readUInt32BE(20), bd = d[24], ct = d[25];
    const ctName = { 0: 'gray', 2: 'RGB', 3: 'palette', 4: 'grayA', 6: 'RGBA' }[ct];
    return `PNG ${w}x${h} bitdepth=${bd} ${ctName}`;
  }
  if (d[0] === 0xff && d[1] === 0xd8) {
    let i = 2;
    while (i < d.length) {
      if (d[i] !== 0xff) { i++; continue; }
      const m = d[i + 1];
      if (m === 0xc0 || m === 0xc1 || m === 0xc2) {
        const h = d.readUInt16BE(i + 5), w = d.readUInt16BE(i + 7);
        return `JPEG ${w}x${h}${m === 0xc2 ? ' progressive' : ' baseline'}`;
      }
      const L = d.readUInt16BE(i + 2);
      i += 2 + L;
    }
  }
  return '';
}

let total = 0;
const byTop = {};
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    const s = fs.statSync(p).size;
    total += s;
    const rel = path.relative(root, p).replaceAll('\\', '/');
    const key = rel.split('/').slice(0, 2).join('/');
    byTop[key] = (byTop[key] || 0) + s;
    const info = /\.(png|jpe?g)$/i.test(e.name) ? dims(p) : '';
    console.log(`${String(s).padStart(9)}  ${rel}  ${info}`);
  }
}
walk(root);
console.log('---');
for (const [k, v] of Object.entries(byTop)) console.log(`${String(v).padStart(9)}  ${k}`);
console.log(`${String(total).padStart(9)}  TOTAL`);
