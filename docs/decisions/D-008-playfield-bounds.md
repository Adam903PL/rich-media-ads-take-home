# D-008 Playfield bounds (Variant A)

**Date / stage:** 2026-11-05 · A3 · **Status:** accepted

## Context
- The brief says that "leaving the playfield at the top or bottom" ends the run, but does not define the playfield.
- The cloud bands at the top and bottom of the screen read as the walls of the gut.
- The brief also requires that the player "never dies when it visibly did not touch anything".

## Options
1. **Screen edges** (below the headline band, bottom of the screen)
   - Pros: biggest playfield.
   - Cons: the poo could fly over the clouds or hide under them, which looks wrong.
2. **Clouds as walls, approximated by straight lines** at the edges of their opaque strips (y 204.5 / 598.5)
   - Pros: simple.
   - Cons: at the player's columns the clouds hang down to y 234.5, so the player would visibly sink into them before dying.
3. **Clouds as walls, exact shape**
   - Pros: dying always coincides with visible contact.
   - Cons: needs alpha masks.

## Decision
**Option 3, precomputed.**
- The clouds are a static layer and the player's x is fixed. The exact mask test (player alpha vs cloud alpha, threshold 128) therefore reduces to two constants for the player's top edge:
  - **232.5**: highest position before touching the top clouds.
  - **533.5**: lowest position before touching the bottom clouds.
- `tools/audit/cloud-limits.mjs` computes them from `border.png` and `player.png`, so they are reproducible.
- When the player crosses a limit, it is placed exactly at the touching point and the run fails.

**Updated in A4 (D-011):**
- With the game-wide 2 px collision tolerance, the same method gives **230 / 535.5**, and these are the values in `game.js`.
- `cloud-limits.mjs` now uses the game's own `erodeMask` and `masksOverlap`. Without tolerance it still reproduces 232.5 / 533.5.

## Consequences
- Cloud collision is pixel-exact without a runtime mask. A4 needs masks only for the moving obstacles.
- The player can travel 301 px vertically.
- The design's start position (258.5) is only 26 px below the top limit, which shaped the start sequence (D-009).
- If the player's x or `border.png` ever changes, rerun the script.
