# Asset audit scripts

Small Node scripts used to measure the provided assets for [docs/asset-audit.md](../../docs/asset-audit.md). They require Node 18+ and `ffmpeg`/`ffprobe` on `PATH`, and only read files.

| Script | Usage | Purpose |
|---|---|---|
| `dims.mjs` | `node dims.mjs <dir>` | file sizes and PNG/JPEG dimensions, colour type |
| `pngchunks.mjs` | `node pngchunks.mjs <png...>` | PNG chunk list and palette with alpha (detects a missing `tRNS`) |
| `palidx.mjs` | `node palidx.mjs <png...>` | per-index pixel counts of palette PNGs and whether an index sits on edges (anti-aliasing) |
| `match.mjs` | `node match.mjs <design.png> <sprite.png...>` | finds where an RGBA sprite sits in a design screen (opaque pixels only) |
| `match2.mjs` | `node match2.mjs <big.jpg> <part.jpg> [scales]` | coarse-to-fine match of a photo crop inside a larger photo |
| `bands.mjs` | `node bands.mjs <img> [alpha\|luma] [threshold]` | text-line bands (y ranges) for line-by-line reveals |
| `stats.mjs` | `node stats.mjs <img> x y w h` | mean and standard deviation of RGB in a region (colour and opacity estimates) |
