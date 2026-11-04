# System Architecture

## Overview
The repository holds two independent deliverables. Each variant folder (minus its `design/` reference files) is a self-contained, shippable ad with its own assets and vendored libraries. Everything outside the variant folders is documentation or tooling.

> Status: **planned**. No ad code exists yet. Update this document as each stage lands.

## Architecture Pattern
**Pattern:** static documents plus a few small native ES modules. No shared runtime between the variants.
- **Variant A:** a game loop driven by an explicit state machine, with DOM overlays animated by GSAP.
- **Variant B:** three standalone documents, each with its own GSAP timeline, started in sync by a message from the preview page.

## System Structure

### Variant A — Game Ad (`variant-a-game/`)
- **Stage:**
  - 360×640 CSS px logical stage, scaled uniformly to the visible viewport (`dvh` / `visualViewport`).
  - Extra height on tall phones is filled with the navy background.
- **Layers, bottom → top:**
  1. **Canvas:** background, texture, scrolling gut, obstacles, player, cloud borders. Clipped at y 168.5, below the headline band.
  2. **DOM:** headline band (`tut.png`), logo bar, tutorial (`gesture.png`), endcards, mute button.
- **Planned modules:**

  | Module | Responsibility |
  |---|---|
  | `main.js` | bootstrap, scaling |
  | `game.js` | state machine: `start → ready → playing → fail \| win` |
  | `level.js` | obstacle schedule — every obstacle exactly once |
  | `collision.js` | alpha masks |
  | `audio.js` | Web Audio: gains, mute, suspend / resume |
  | `endcards.js` | GSAP timelines |
  | `debug.js` | `?debug=1` hitbox drawing |

- **Loop:**
  - `requestAnimationFrame` with clamped delta time.
  - Paused on `visibilitychange`.
  - On replay all timers, listeners and audio sources are torn down and rebuilt.

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
