// Lists PNG chunks; for palette images prints PLTE + tRNS entries.
import fs from 'node:fs';
for (const p of process.argv.slice(2)) {
  const d = fs.readFileSync(p);
  let i = 8;
  const chunks = [];
  let plte = null, trns = null;
  while (i < d.length) {
    const len = d.readUInt32BE(i);
    const type = d.toString('latin1', i + 4, i + 8);
    const body = d.subarray(i + 8, i + 8 + len);
    chunks.push(`${type}(${len})`);
    if (type === 'PLTE') plte = body;
    if (type === 'tRNS') trns = body;
    if (type === 'tEXt' || type === 'iTXt') console.log('  text:', body.toString('latin1').replace(/\0/g, ' | ').slice(0, 200));
    i += 12 + len;
  }
  console.log(p, chunks.join(' '));
  if (plte) {
    const n = plte.length / 3;
    const entries = [];
    for (let k = 0; k < n; k++) {
      const a = trns && k < trns.length ? trns[k] : 255;
      entries.push(`#${plte.subarray(k * 3, k * 3 + 3).toString('hex')}/a${a}`);
    }
    console.log('  palette:', entries.join(' '));
  }
}
