# D-006 Renderer for the moving scene (Variant A)

**Date / stage:** 2026-11-05 · A2 (brought forward from A3) · **Status:** accepted

## Context
- The gut, the obstacles and the player move every frame; everything else on the stage is static DOM (A1).
- The brief allows canvas, DOM or Phaser and asks us to explain "why you picked canvas vs DOM".
- The choice affects A2–A5, so it was made when the gut and the player first appeared on the start screen (A2) rather than at A3.

## Options
1. **DOM elements moved with `transform`**
   - Pros:
     - The same model as the static layers: one scaled stage, crisp at every scale and pixel ratio without managing a backing store.
     - GSAP animates the scene and the overlays the same way.
     - The scene is small: one 2528 px gut image, 15 obstacles, the player.
     - Compositor-friendly, since only `transform` changes.
   - Cons:
     - Hitboxes need a separate debug overlay.
     - Draw order is DOM order.
2. **Canvas 2D for the moving scene**
   - Pros:
     - A classic game loop with explicit draw order.
     - Debug hitboxes are drawn in the same context.
   - Cons:
     - The backing store has to be sized to stage scale × device pixel ratio and rebuilt on every resize.
     - The canvas sits between DOM layers, so there are two rendering models.
     - GSAP tweens have to be mirrored into draw calls.
3. **Phaser**
   - Pros: physics and scene management out of the box.
   - Cons: roughly 1 MB of library for a one-screen game, against the 3 MB budget and the brief's "ads have to load fast".

## Decision
**Option 1, DOM + `transform`.**
- Collision does not depend on the renderer. Alpha masks are computed once from the images at start (A4), so the main advantage of canvas does not apply here.
- The scene (`.scene`) is clipped below the headline band. The gut scrolls with `translateX`, and the player moves with `translateY` relative to its measured start position.

## Consequences
- The A4 debug mode (`?debug=1`) draws hitboxes in a separate overlay layer.
- Everything moving must use `transform`, never `left`/`top`. This was already required by `standards/ads/animation.md`.
- If profiling on a low-end phone ever shows jank, canvas remains the fallback, because the game logic is renderer-independent.
