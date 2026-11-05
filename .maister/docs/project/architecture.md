# System Architecture

## Overview
The repository holds two independent deliverables. Each variant folder (minus its `design/` reference files) is a self-contained, shippable ad with its own assets and vendored libraries. Everything outside the variant folders is documentation or tooling.

> Status: Variant A stage and scaling are **present** (A1). Everything else is **planned**. Update this document as each stage lands.

## Architecture Pattern
**Pattern:** static documents plus a few small native ES modules. No shared runtime between the variants.
- **Variant A:** a game loop driven by an explicit state machine, with DOM overlays animated by GSAP.
- **Variant B:** three standalone documents, each with its own GSAP timeline, started in sync by a message from the preview page.

## System Structure

### Variant A — Game Ad (`variant-a-game/`)
- **Stage (present, D-005):**
  - `#ad` is a fixed `100dvh` root; `#stage` is a 360×640 CSS px logical stage, centred.
  - `main.js` scales the stage with `min(W / 360, H / 640)` from a `ResizeObserver` on the root, so toolbar changes rescale it live. Strips under 1 px are closed by covering.
  - `::before` / `::after` caps continue the stage's edge colours into the spare strips (white above, `#D89C95` below; navy for endcards from A5). They overlap the stage by 1 px to hide anti-aliased edges.
  - Landscape shows the portrait stage centred, with navy sides.
- **Layers, bottom → top (present, A2):** all DOM `<img>`; renderer decision D-006.
  1. `bg.jpg`, full frame. Above the scene clip it also forms the navy headline band.
  2. `.scene`, clipped with `clip-path: inset(172px 0 0 0)` inside `border.png`'s opaque strip:
     - `bg_texture.png`, full frame, static
     - `.track` at x −2 (present, A4), moved as one with `translateX(-scroll)`. It holds:
       - `.gut` (`gameplay.png`, 2528×640)
       - the 15 `.obstacle` images, created from `level.js` before the preload and placed on the gut's tubes (D-010)
  3. `border.png`, `tut.png` (headline), `logo.png`, full frame.
  4. `.player` at (55.5, 258.5), above the clouds so it is always visible. Moves with `translateY` from A3.
  5. `.gesture` at (147.5, 452).
  6. Later overlays: endcards (A5), mute button (A6). `?overlay=1` adds the design overlay on top.
- **Startup (present):**
  1. `main.js` fits the stage and adds the obstacle images.
  2. It awaits `preloadImages()`: every `<img>` must decode, otherwise it throws with the file names.
  3. It sizes the obstacles from their images and builds the collision masks: the player's eroded by 2 px (D-011).
  4. It adds `.is-ready`, which reveals the stage.
  5. It loads `debug.js` only for `?overlay=1` / `?debug=1`.
  6. It calls `startGame()`.
- **Planned modules:**

  | Module | Responsibility |
  |---|---|
  | `main.js` | bootstrap, scaling, image preload (present) |
  | `game.js` | state machine `start → ready → playing → fail \| win` mirrored to `data-state` on `#ad`, physics, input, pause (present) |
  | `level.js` | obstacle layout `{ id, x, y }`, every obstacle exactly once; checked by `tools/audit/level-check.mjs` (present) |
  | `collision.js` | `createMask`, `erodeMask`, `masksOverlap` on the 2x pixel grid; also used by `tools/audit/cloud-limits.mjs` (present) |
  | `audio.js` | Web Audio: gains, mute, suspend / resume |
  | `endcards.js` | GSAP timelines |
  | `debug.js` | dev aids loaded on demand: `?overlay=1` design overlay, `?debug=1` collision masks, boxes and cloud limits drawn through `startGame({ onFrame })` (present) |

- **Loop (present, A3):**
  - `requestAnimationFrame` with delta time clamped to 1/30 s; physics in logical px and seconds (D-009).
  - States:
    - `ready`: 0.6 s eased glide to the playfield centre.
    - `playing`: gravity and jump.
    - `fail`: either the player crossed the cloud limits 230 / 535.5 (D-008, with the D-011 tolerance), or its eroded mask touched an obstacle's mask. The cause (`clouds` or the obstacle id) is kept in the run.
    - `win`: scroll reached 2166 px and all 15 obstacles were passed.
  - Collision per frame: obstacles behind the player are counted as passed. Only those within the player's width are tested: boxes first, then pixels.
  - Input: `pointerdown` on `#ad` (`touch-action: none`), Space and ArrowUp without key repeat.
  - Paused on `visibilitychange` and resumed with a reset frame clock.
  - On replay (A5), all timers, listeners and audio sources are torn down and rebuilt. `startGame()` keeps every handle in one run object for that.

### Variant B — Fireplace Ad (`variant-b-fireplace/`)
- **Documents:**

  | File | Size (CSS px) | Role |
  |---|---|---|
  | `top.html` | 1032×250 | standalone ad |
  | `left.html` | 320×975 | standalone ad |
  | `right.html` | 320×975 | standalone ad |
  | `preview.html` | 1680×975 | places the three parts in iframes |

  Each part has its own layers, its own GSAP timeline and a clickout on its whole area.
- **Shared coordinate system:**
  - The full fireplace is 1680×975. The parts sit at x 0, 324 and 1360, with 4 px gaps.
  - Background crops and zoom `transform-origin` are expressed in these global coordinates, so the moss stays continuous across parts during the zoom.

## Data Flow
- **Variant A:**
  1. `pointerdown` changes the game state.
  2. Physics updates the player and the scroll.
  3. The canvas is rendered.
  4. State transitions fire audio cues and endcard timelines.
- **Variant B:**
  1. Each iframe posts `ready`.
  2. `preview.html` posts `start` with a shared start time to all three.
  3. Each part plays its timeline.
  4. A part opened on its own starts by itself after a short timeout.

## External Integrations
- `window.clickTag`, provided by the ad server. Fallback: `https://example.com/landing`, opened in a new window.
- No network APIs.

## Configuration
- `?debug=1`:
  - Variant A: draws hitboxes.
  - Variant B: overlays the design at 50%.
- `window.clickTag`.

## Deployment Architecture
- Static files. The shippable unit is a variant folder without `design/`.
- Every ad stays under 3 MB:
  - Variant A: one ad.
  - Variant B: all three parts together (D-004).
- Originals are committed unmodified; optimised assets replace them in separate commits.
- All positions come from [docs/asset-audit.md](../../../docs/asset-audit.md).

---
*Based on project analysis performed 2026-11-04 (no application code yet).*
