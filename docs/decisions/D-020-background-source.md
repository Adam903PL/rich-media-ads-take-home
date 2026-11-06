# D-020 Background source for the fireplace (Variant B)

**Date / stage:** 2026-11-06 · B1 · **Status:** accepted (built as the default of Q3; the packshot deviation is still open with the client)

## Context
- The brief asks for one continuous moss surface across the three parts, so the seams line up when the parts sit side by side. It provides `bg-big.jpg` for this and calls the per-part `bg.jpg` files "pre-cut versions", and asks us to decide which approach to use and why.
- They are not cut from one image ([asset audit P3](../asset-audit.md#34-problems-found)):
  - the per-part files match `layout.png` (packshot position and size, the rock in the top banner), but their seams do not line up: the luma jumps from 63 to 87 between top and right, and the rock ends at the top banner's edge;
  - `bg-big.jpg` lines up at every seam (§3.1: 103.2 | 103.6 and 72.0 | 69.1), but its right packshot is ~12% larger, the left one sits 2 px right and 6 px lower, and the top banner shows a different section of the moss.
- The packshots are baked into the backgrounds (P4), so the background is the only layer that can carry a "background slowly zooms in" across the parts.
- In production the three parts are three separate ads, so a file used by every part is downloaded three times. The fireplace counts as one ad: all three parts together stay under 3 MB (D-004).
- The client was asked (Q3) whether the packshot deviation is acceptable; no answer as of 2026-11-06.

## Options
1. **Per-part `bg.jpg`, as delivered**
   - Pros: matches the layout's packshots; no processing; 1 410 947 B.
   - Cons: the seams do not line up, which is the brief's main requirement for the background. No room outside each crop, so a zoom around one shared point would show empty edges, and a zoom per part would move the moss differently on each side of a seam.
2. **The whole `bg-big.jpg` in every part, positioned with an offset**
   - Pros: continuous, no processing, all the room a zoom needs.
   - Cons: 1 995 071 B per part. Each part shows only 16–19% of it, and as three separate ads the fireplace would load 6 MB.
3. **Own crops of `bg-big.jpg`, each with the room a shared zoom needs**
   - Pros: continuous seams, room for a zoom around one point, 1 235 592 B for all three.
   - Cons: one lossy re-encode; the packshots differ from the layout as described above.

## Decision
**Option 3.** Seams that line up are a requirement of the brief, while the packshot difference is a question of approval that only the client can answer. The crops make the shared zoom possible and cost less than the delivered per-part files.

- **Zoom model:** every part scales its background around one point in fireplace coordinates, the centre of `bg-big.jpg`, **O = (840, 487.5)**, with the scale kept in **[1, 1.10]**. At a scale s ≥ 1 a part shows its own rectangle pulled towards O, so it only needs extra moss on the side facing O.
- **Crops** (fireplace = 1680×975 CSS px, parts at x 0 / 324 / 1360 with 4 px gaps), with their edges on the 16 px @2x grid of the source's 4:2:0 chroma blocks:

  | File | Source rectangle @2x | Fireplace (CSS) | Position in the part (CSS) |
  |---|---|---|---|
  | `assets/left/bg-crop.jpg` | x 0, y 0, 736×1950 | x 0–368, y 0–975 | (0, 0) |
  | `assets/top/bg-crop.jpg` | x 640, y 0, 2080×544 | x 320–1360, y 0–272 | (−4, 0) |
  | `assets/right/bg-crop.jpg` | x 2624, y 0, 736×1950 | x 1312–1680, y 0–975 | (−48, 0) |

- **Encoding:** `ffmpeg -nostdin -i bg-big.jpg -vf crop=W:H:X:0 -map_metadata -1 -fflags +bitexact -c:v mjpeg -q:v 2 -pix_fmt yuvj420p bg-crop.jpg`, with W, H and X from the source rectangles above.
  - The source is a 4:2:0 JPEG at quality ≈ 86, so `-q:v 2` keeps the second generation close to it: PSNR against the same rectangle of `bg-big.jpg` is 49.4 dB (left), 48.4 dB (top) and 49.7 dB (right).
  - On the 16 px grid the top crop scores 48.0 / 49.9 dB in the chroma planes and weighs 432 880 B; 8 px off the grid (x 648) it scores 41.5 / 43.4 dB and weighs 478 470 B.
  - WebP (`libwebp -quality 82`) gave about the same size (1 238 720 B) at only 38.8–40.5 dB. A lossless crop with `jpegtran` would need a new tool that is not installed, for a similar weight.

## Consequences
- **Weight:** the backgrounds go from 3 406 018 B (all four delivered files) to 1 235 592 B. The variant's assets go from 3 638 520 to 1 468 094 B before the `tRNS` repair.
- `bg-big.jpg` and the per-part `bg.jpg` files are removed from the shipped folder. The originals stay in git history (`085fb62`), e.g. `git show 085fb62:variant-b-fireplace/assets/bg-big.jpg`, and any re-crop starts from there.
- **The zoom has hard limits** (B4, B6):
  - never below scale 1: there is no moss outside `bg-big.jpg`'s edges;
  - never above 1.10 around O: at 1.10 the left part reaches x 367.3 (crop ends at 368), the right part x 1312.7 (crop starts at 1312) and the top part y 271.6 (crop ends at 272);
  - no translation drift: the outer edges of the fireplace have no extra moss;
  - `transform-origin` of the background layer in each part is O in that layer's own coordinates: left (840, 487.5), top (520, 487.5), right (−472, 487.5).
- With the same scale at the same moment in every part, the moss stays continuous across the seams during the zoom, so the parts need to start in sync (B5).
- The packshots differ from `layout.png` as listed in P3. If the client asks for the per-part files, the seams no longer line up and the shared zoom needs per-part crops with bleed that do not exist.
