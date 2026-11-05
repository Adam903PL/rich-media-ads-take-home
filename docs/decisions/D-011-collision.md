# D-011 Collision (Variant A)

**Date / stage:** 2026-11-05 · A4 · **Status:** accepted

## Context
- The brief: "The player should never die when it visibly did not touch anything. Hitboxes based on the full rectangular image are usually too big."
- The obstacles are irregular: round viruses, diagonal bacteria, words with gaps between letters. The player is a rounded blob.
- The user chose a slightly forgiving collision of about 2 px.

## Options
1. **Image rectangles**
   - Pros: trivial.
   - Cons: empty corners kill. In the test, the player's and the virus's boxes overlapped by 6×6 px while the shapes did not touch.
2. **Hand-drawn simplified shapes** (circles, capsules)
   - Pros: cheap to test.
   - Cons: one approximation per asset, and still wrong at the edges of words.
3. **Alpha masks from the images**
   - Pros: exact to the visible pixels, no per-asset work.
   - Cons: a one-time pixel read at start-up.

## Decision
**Option 3** (`variant-a-game/js/collision.js`).
- **Masks:** after the preload, each image is drawn once to an offscreen canvas. Alpha ≥ 128 becomes a `Uint8Array` mask on the assets' native 2x grid, so there is no resampling.
  - If the pixels cannot be read (e.g. a cross-origin image), start-up throws with the file name. It never silently falls back to rectangles.
- **Tolerance:** the **player's** mask is eroded by 2 CSS px (4 mask px, disc-shaped). A contact therefore has to go about 2 px deep before it counts.
  - Obstacle masks stay complete, because erosion would erase thin strokes such as "Fertiggerichte".
- **Per frame:**
  1. Obstacles behind the player are counted as passed, and the scan stops at the first one still ahead.
  2. For the few at the player, the boxes are tested first.
  3. If the boxes overlap, the player's mask pixels in the shared area are sampled against the obstacle mask.
- **Clouds** use the same rule: `tools/audit/cloud-limits.mjs` imports `erodeMask` and `masksOverlap`, so the limits (D-008) are 230 / 535.5 with the tolerance. There is one fairness rule in the whole game.

## Consequences
Measured in the browser with the real images:
- Overlapping boxes with non-touching shapes give no collision.
- For "Stress", "Fertiggerichte" and the `bac2` worm, the game registers a hit exactly **2 px** after the first visible contact.
- At a real hit on "Blut", the full visible shapes overlapped (4 px deep: 2 px tolerance plus one frame of movement).
- Worst case (boxes overlapping as much as possible, shapes not touching): 5.5–9 µs per check, negligible per frame.
- `?debug=1` draws the masks (the player's eroded), the boxes and the cloud limits; the obstacle or limit that ended the run turns red.
