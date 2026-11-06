# System Architecture

## Overview
The repository holds two independent deliverables. Each variant folder (minus its `design/` reference files) is a self-contained, shippable ad with its own assets and vendored libraries. Everything outside the variant folders is documentation or tooling.

> Status: Variant A is **complete** (A1–A8: stage, start screen with intro, game loop, obstacles, collision, endcards, replay, audio, compressed assets). Variant B has its background crops (B1) and its three part documents (B2), the preview page (B3) and the intro (B4); the shared start, the idle loop and the clickout are **planned**. Update this document as each stage lands.

## Architecture Pattern
**Pattern:** static documents plus a few small native ES modules. No shared runtime between the variants.
- **Variant A:** a game loop driven by an explicit state machine, with DOM overlays animated by GSAP.
- **Variant B:** three standalone documents, each with its own GSAP timeline, started in sync by a message from the preview page.

## System Structure

### Variant A — Game Ad (`variant-a-game/`)
- **Stage (present, D-005):**
  - `#ad` is a fixed `100dvh` root; `#stage` is a 360×640 CSS px logical stage, centred.
  - `main.js` scales the stage with `min(W / 360, H / 640)` from a `ResizeObserver` on the root, so toolbar changes rescale it live. Strips under 1 px are closed by covering.
  - `::before` / `::after` caps continue the stage's edge colours into the spare strips (white above, `#D89C95` below). They overlap the stage by 1 px to hide anti-aliased edges. Endcards reuse the same rule with a navy bottom cap (A5).
  - Landscape shows the portrait stage centred, with navy sides.
- **Layers, bottom → top (present, A2):** all DOM `<img>`; renderer decision D-006.
  1. `bg.jpg`, full frame. Above the scene clip it also forms the navy headline band.
  2. `.scene`, clipped with `clip-path: inset(172px 0 0 0)` inside `border.png`'s opaque strip:
     - `bg_texture.png`, full frame, static
     - `.track` at x −2 (present, A4), moved as one with `translateX(-scroll)`. It holds:
       - `.gut` (`gameplay.png`, 2528×640)
       - the 15 `.obstacle` images, created from `level.js` before the preload and placed on the gut's tubes (D-010)
  3. `border.png`, `tut.png` (headline), `logo.png`, full frame.
  4. `.player-wrap` at (55.5, 258.5), above the clouds so the player is always visible. It holds `.player` at 0,0. The intro scales the wrapper (A7); the game moves `.player` with `translateY` (A3). Each element has one owner of its transform.
  5. `.gesture` at (147.5, 452).
  6. `.endcard` sections `#endcard-fail` and `#endcard-win` (present, A5, D-013), hidden until shown:
     - z-index 2, so they cover the stage and its caps;
     - full-frame layers in the audit's order, plus their own `logo.png` and a navy bottom cap;
     - on the win endcard, a second `konfetti.png` above the poo clipped to the party cone, so the cone sits in front of the poo as in the mockup (D-015);
     - the win poo and its cone sit 31.5 px above their design position, inside the bubble (D-016);
     - CTA and replay are `<button>`s at the measured positions.
  7. `.mute` toggle (present, A6, D-014): an inline SVG button on the logo bar at (314, 9.75), 40×40, z-index 3, so it stays above the endcards. `?overlay=1` adds the design overlay on top.
- **Startup (present):**
  1. `main.js` fits the stage and adds the obstacle images.
  2. It awaits `preloadImages()` and `loadSounds()` together: every `<img>` must decode and every sound must load and decode, otherwise it throws with the file names.
  3. It sizes the obstacles from their images and builds the collision masks: the player's eroded by 2 px (D-011).
  4. It sets up the audio (`setupAudio()`, which finds the music loop and registers the gesture unlock) and builds the endcard timelines with `setupEndcards()`. Missing markup or a missing GSAP stops the start here.
  5. It builds the intro timeline with `setupIntro()`.
  6. It loads `debug.js` only for `?overlay=1` / `?debug=1`.
  7. It starts the first run with `startGame()`; the `start` state plays the intro from its first frame.
  8. Only then does it add `.is-ready`, which reveals the stage: the game already listens for taps (A7, the gap from ai-log #14).
- **Planned modules:**

  | Module | Responsibility |
  |---|---|
  | `main.js` | bootstrap, scaling, image preload, run ownership and replay, GSAP pause when hidden (present) |
  | `game.js` | one run per `startGame()`: state machine `start → ready → playing → fail \| win` mirrored to `data-state` on `#ad`, physics, input, pause, `onStateChange`, `destroy()` (present) |
  | `level.js` | obstacle layout `{ id, x, y }`, every obstacle exactly once; checked by `tools/audit/level-check.mjs` (present) |
  | `collision.js` | `createMask`, `erodeMask`, `masksOverlap` on the 2x pixel grid; also used by `tools/audit/cloud-limits.mjs` (present) |
  | `intro.js` | start-screen intro timeline (built once, played on every `start`, jumped to its end on the first tap) and the tapping-hand loop that ends before 30 s (present, A7, D-017) |
  | `motion.js` | the vendored global `gsap`, checked once, and the `prefers-reduced-motion` query, shared by `endcards.js`, `intro.js` and `main.js` (present) |
  | `dom.js` | `find` / `findAll` lookups that throw with the missing selector (present) |
  | `audio.js` | Web Audio (D-014): decoding during the preload, the context unlock on the first activating gesture, the music loop found in the buffer, per-sound gains, mute, suspend / resume, stopping every source on replay (present) |
  | `endcards.js` | fail and win entrance timelines (built once, rewound on replay), hold before the entrance, reduced motion, clickTag, replay button (present) |
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
- **Replay (present, A5, D-013):**
  1. `main.js` calls `game.destroy()`, which aborts the run's listeners through one `AbortController` and cancels its frame.
  2. `endcards.hide()` kills the pending hold and rewinds both entrance timelines.
  3. A new `startGame()` sets `start` and renders zero transforms, so the start screen returns.
  - The obstacle images and the collision masks are built once and reused.
  - `audio.stopAll()` fades out and stops every playing source in 20 ms (A6).

### Variant B — Fireplace Ad (`variant-b-fireplace/`)
- **Documents:**

  | File | Size (CSS px) | Role |
  |---|---|---|
  | `top.html` | 1032×250 | standalone ad (present, B2) |
  | `left.html` | 320×975 | standalone ad (present, B2) |
  | `right.html` | 320×975 | standalone ad (present, B2) |
  | `preview.html` | 1680×975 | places the three parts in iframes (present, B3, D-024) |

  Each part has its own layers, its own GSAP timeline and a clickout on its whole area.
- **Part documents (present, B2, D-022):**
  - One `#stage` per document with `data-part="top|left|right"`, rendered 1:1 at the slot size: the ad server's iframe has exactly that size, so there is no scaling. `overflow: hidden` clips the background crop's extra moss.
  - Layers, bottom → top, all `<img>` at 50% of their 2x size:
    - left / right: `bg` crop, `logo.png`, `box.png` as `.panel` at opacity 0.9, `hl.png` as `.copy`, `cta.png` at (73.75, 838.5) with 7 px corners (D-023);
    - top: `bg` crop, `hl.png` as `.headline`, and three more copies of `hl.png` as `.headline-line`, each with a static gradient mask for one line; they are hidden except while the headline builds (B4, D-025).
  - The three documents share `css/style.css` and `js/main.js`; per-part values are keyed on `data-part`.
  - The static markup is the end state of the intro, which animates towards it with `gsap.from`.
  - `transform-origin`: the background at the fireplace centre in the crop's own coordinates (D-020), the logo at the centre of its artwork (160.25, 125), the panel at its bottom edge (160, 913.5).
- **Startup (present, B2, B4):** `js/main.js` checks `#stage` and its part, decodes every `<img>` (a failed file throws `Fireplace <part>: failed to load <src>` and the stage stays hidden), loads `js/debug.js` only for `?overlay=1`, builds the paused intro (its first frame renders at once), adds `.is-ready`, which reveals the stage, and then plays the intro, or jumps to its end with `prefers-reduced-motion: reduce`. A `visibilitychange` listener pauses and resumes `gsap.globalTimeline`.
- **Intro (present, B4, D-025):** 3.5 s on beats shared by all parts — background fade and settle 1.08 → 1 (0–3.5 s), headline lines (0.35 / 0.70 / 1.05 s, then the copies give way to the full image at 1.65 s), logo (0.45 s), panel (1.2 s), copy (1.6 s), CTA (2.2 s). Each part starts on its own after its preload; a shared start is B5.
- **Modules:**

  | Module | Responsibility |
  |---|---|
  | `main.js` | shared entry of the three parts: part check, image preload, overlay flag, intro start, reveal, pause when hidden (present) |
  | `intro.js` | `setupIntro(stage, part)`: the paused intro timeline of one part on the shared beats (present, B4) |
  | `motion.js` | the vendored global `gsap`, checked once, and the `prefers-reduced-motion` query (present, B4) |
  | `dom.js` | `find` / `findAll` lookups that throw with the missing selector (present, B4) |
  | `debug.js` | `?overlay=1`: `design/layout.png` at 50% over the part, scaled by 1 / 0.973 and shifted by the part's position in the fireplace (present); also used by the preview for the whole fireplace |
  | `preview.js` | preview page only: fits the fireplace to the window and handles its `?overlay=1` (present, B3) |
- **Preview (present, B3, D-024):**
  - `#fireplace` (1680×975) holds three iframes at x 0, 324 and 1360 on the layout's background `#282828`; the website area in the middle stays empty.
  - `preview.js` scales `#fireplace` as a whole with `min(1, W / 1680, H / 975)` from a `ResizeObserver` on the root, with whole-pixel offsets, so at full size the parts render exactly as on their own.
  - `css/preview.css` is separate from `css/style.css`, which stays with the shipped parts.
  - The preview is a review tool; the ad is the three parts.
- **Shared coordinate system:**
  - The full fireplace is 1680×975. The parts sit at x 0, 324 and 1360, with 4 px gaps.
  - Background crops and zoom `transform-origin` are expressed in these global coordinates, so the moss stays continuous across parts during the zoom.
- **Background (present, B1, D-020):**
  - Each part's bottom layer is its own crop of `bg-big.jpg`: `left/bg-crop.jpg` (x 0–368), `top/bg-crop.jpg` (x 320–1360, y 0–272) and `right/bg-crop.jpg` (x 1312–1680), placed in the part at (0, 0), (−4, 0) and (−48, 0) and clipped to the part.
  - The crops carry extra moss on the side facing the fireplace centre, so every part can scale its background around **O = (840, 487.5)** with `transform-origin` left (840, 487.5), top (520, 487.5), right (−472, 487.5) in the crop's own coordinates.
  - Limits: scale 1–1.10, never below 1, no translation (the outer edges have no extra moss).
  - The packshots are part of these backgrounds (audit P4), so they zoom with the moss.

## Data Flow
- **Variant A:**
  1. `pointerdown` changes the game state.
  2. Physics updates the player and the scroll.
  3. The track and player `transform`s are written (D-006).
  4. Each state change calls `onStateChange`:
     - `ready` starts the music;
     - `fail` fades the music, plays the crash and shows the fail endcard;
     - `win` fades the music and shows the win endcard.
  5. A cue in each endcard timeline plays its sound: fail when the sad poo drops, cheer and applause when the confetti bursts.
- **Variant B:**
  1. Each iframe posts `ready`.
  2. `preview.html` posts `start` with a shared start time to all three.
  3. Each part plays its timeline.
  4. A part opened on its own starts by itself after a short timeout.

## External Integrations
- `window.clickTag`, provided by the ad server. Fallback: `https://example.com/landing`, opened in a new window.
- No network APIs.

## Configuration
- `?overlay=1`: lays the design over the ad at 50% (Variant A: the start screen; Variant B: `layout.png`, per part). `npx serve` redirects `*.html` URLs to their clean form and drops the query, so the flag goes on the clean URL, e.g. `/variant-b-fireplace/left?overlay=1`.
- `?debug=1`: Variant A draws hitboxes.
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
