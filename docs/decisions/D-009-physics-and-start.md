# D-009 Game physics and start sequence (Variant A)

**Date / stage:** 2026-11-05 · A3 · **Status:** accepted (values are a starting point for tuning on a phone)

## Context
- A full run should take about 15 s (user's choice): long enough for 15 obstacles, short enough for an ad.
- The playfield gives the player 301 px of travel (D-008).
- The design places the player only 26 px below the ceiling, so a normal first jump would hit the clouds immediately.

## Options
1. **First tap glides the player to the middle of the playfield, then control starts**
   - Pros: no unfair early death, and it doubles as the brief's "get ready" moment.
   - Cons: the first 0.6 s are not interactive.
2. **First tap starts the run without a jump**
   - Pros: simple.
   - Cons: quick tapping right after the start still hits the ceiling.
3. **Small jumps (~22 px) everywhere**
   - Pros: always safe.
   - Cons: jittery control that needs many taps.

## Decision
**Option 1**, with these values in `js/game.js` (logical px, seconds):

| Constant | Value | Effect |
|---|---|---|
| `SCROLL_SPEED` | 145 px/s | 2166 px of gut ≈ 14.9 s run |
| `GRAVITY` | 1600 px/s² | |
| `JUMP_VELOCITY` | −420 px/s | jump height ≈ 55 px (about 1/5 of the playfield), apex after 0.26 s |
| `MAX_FALL_SPEED` | 650 px/s | caps the fall so the player stays readable |
| `READY_TOP`, `READY_SECONDS` | 383 (playfield centre), 0.6 s | ease-in-out glide from the design position |
| `MAX_FRAME_SECONDS` | 1/30 s | clamps a frame after a stall instead of teleporting |

- A tap sets the velocity to `JUMP_VELOCITY`, Flappy-style, rather than adding to it.
- Space and ArrowUp work like a tap. Key repeat is ignored, so holding a key does not spam jumps.

## Consequences
- Physics is frame-rate independent.
- When a browser renders slower than 30 fps, the game slows down rather than skipping. The headless test browser shows this: a little more wall time than game time.
- The "get ready" nice-to-have is partly done. A7 still adds the intro and the difficulty ramp.
- The values are deliberately in one place, to be tuned by feel on a real phone.
