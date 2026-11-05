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
| `cloud-limits.mjs` | `node cloud-limits.mjs [--tolerance=2] [variant-a-game/assets]` | highest and lowest player top that does not touch the cloud bands, using the game's `collision.js` on the alpha masks of `border.png` and `player.png` (D-008, D-011) |
| `level-check.mjs` | `node tools/audit/level-check.mjs` (from the repo root) | validates `variant-a-game/js/level.js`: ids, tubes, band, start screen, end of gut, corridor room; prints reachable and winning sides per obstacle (D-010). Exits non-zero on a problem |
