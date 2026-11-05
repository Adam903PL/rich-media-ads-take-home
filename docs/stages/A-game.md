# Stage A — Variant A, Game Ad

**Goal:** a complete, polished "Gut Run" mobile game ad that meets every requirement of the brief and stays under 3 MB.

## A1 Scaffold & scaling
- **Status:** ✅ done
- **Commit:** `feat: scale variant A stage to the visible viewport`
- **Time:** 1 h planned / ~1 h actual
- **What was done:**
  - `variant-a-game/index.html`, `css/style.css`, `js/main.js`.
  - 360×640 logical stage with the static frame layers (`bg.jpg`, `border.png`, `logo.png`) as full-frame DOM images at 50% of their 2x size.
  - `main.js` contain-fits the stage to a `100dvh` root through a `ResizeObserver`. Strips under 1 px are closed by covering.
  - Stage caps fill the spare strips with the measured edge colours.
  - The script fails fast if `#ad` or `#stage` is missing.
- **Decisions:** D-005 (viewport scaling).
- **Deviation from plan:** the plan filled the strips with a background gradient on the root. The first screenshots showed hairlines at the stage edges, so the gradient was replaced by caps that overlap the stage by 1 px ([ai-log #5](../ai-log.md)).
- **Verification:** Playwright MCP browser tools against `npx serve`.

  | Viewport | Scale | Stage (CSS px) | Strips |
  |---|---|---|---|
  | 320×568 | 0.8889 (cover, strip < 1 px) | 320 × 568.9 | −0.44 px top/bottom (crop) |
  | 375×667 | 1.0425 (cover, strip < 1 px) | 375.3 × 667.2 | ~0 |
  | 390×844 | 1.0844 | 390.4 × 694.0 | 75 px top/bottom |
  | 430×932 | 1.1955 | 430.4 × 765.1 | 83.4 px top/bottom |
  | 390×750 (toolbar shown) | 1.0844 | 390.4 × 694.0 | 28.2 px, rescaled live |
  | 844×390 (landscape) | 0.61 | 219.6 × 390.4 | navy sides |

  - Aspect ratio is 0.5625 in every case.
  - The headless browser reports a fractional viewport (DPR 1.0000000149, e.g. 375.2×667.2); the scale follows the measured box.
  - Pixel rows at the stage seams are uniform (white, and `#D89C95`, ±1/255).
  - No console errors and no external requests. The favicon 404 is suppressed with `<link rel="icon" href="data:,">`.
  - Screenshots: [a1-viewports.png](../img/a1-viewports.png).
- **Standards checklist:** all items passed; preload is not applicable yet (see the A1 plan).
- **AI:** ai-log #5.

## A2 Static start screen
- **Status:** ✅ done
- **Commit:** `feat: compose variant A start screen`
- **Time:** 0.5 h planned / ~1.5 h actual (most of it went into measuring the gut offset)
- **What was done:**
  - All start-screen layers placed at measured positions. The texture and the gut sit in a `.scene` clipped below the headline band. The player and the hand sit above the clouds.
  - Preload: the stage stays hidden until every `<img>` is decoded. A failed file throws `Gut Run: failed to load <src>` and the stage stays hidden.
  - `?overlay=1` lazily loads `js/debug.js`, which lays `design/01-start.png` over the stage at 50%.
- **Decisions:**
  - D-006: DOM + `transform` renderer, chosen with the user and brought forward from A3.
  - D-007: start screen without obstacles.
- **Findings that changed the build:**
  - **The design's gut sits 2 px left of the frame origin** (`.gut { left: -2px }`), not at 0,0 as assumed for full-frame layers.
  - **The scene clip moved from 168.5 to 172 px.** At 168.5 the clip edge fell on `border.png`'s anti-aliased row, and the middle tube showed through as a line; 172 lies inside the fully opaque strip (169–204.5).
  - The "tab to run" text in the mockup is rendered differently from the asset; the asset is kept (audit §2.4).
- **Verification:** Playwright MCP against `npx serve`.
  - Every image renders at exactly 50% of its pixel size, e.g. the gut 5056×1280 → 2528×640 and the hand 173×192 → 86.5×96.
  - Pixel diff of the stage at scale 1 against `01-start.png` scaled to 360×640:

    | Band | Before the fixes | After |
    |---|---|---|
    | whole frame | 21.8 dB | **26.3 dB** |
    | logo | 47.7 | 47.7 |
    | headline band | 41.1 | 41.1 |
    | headline + clouds | 35.7 | **41.5** |
    | top clouds | 30.3 | **38.7** |
    | playfield | 19.0 | **23.4** |
    | bottom clouds | 29.2 | **37.5** |

    The remaining playfield difference is the mockup's obstacles (D-007), the differently rendered "tab to run" text and resampling at the tube edges ([diff](../img/a2-diff.png)).
  - Overlay at 50% shows no double edges except the intentional ones ([overlay](../img/a2-overlay.png)).
  - 320×568, 375×667, 390×844 and 430×932 all render the full screen ([viewports](../img/a2-viewports.png)).
  - Preload failure: a routed 404 on `tut.png` produced `Gut Run: failed to load assets/01_game/tut.png`, and the stage stayed `visibility: hidden`.
  - Without `?overlay=1` there is no request for `debug.js` or `design/`; there are no external requests and no console messages.
- **Standards checklist:** all items passed.
- **AI:** ai-log #6 and #7.

## A3 Game loop
- **Status:** ✅ done
- **Commit:** `feat: add variant A game loop`
- **Time:** 1 h planned / ~1 h actual
- **What was done:**
  - `js/game.js`: state machine `start → ready → playing → fail | win`, mirrored to `data-state` on `#ad`.
  - `requestAnimationFrame` loop with the frame clamped to 1/30 s. Gravity, jump and maximum fall speed.
  - The gut scrolls with `translateX` to 2166 px; the player moves with `translateY` from its measured start.
  - Input: `pointerdown` anywhere on the ad (`touch-action: none`), Space and ArrowUp; key repeat ignored.
  - The tutorial hand hides through CSS on `data-state`.
  - The loop pauses on `visibilitychange` and resumes with a reset clock.
  - `tools/audit/cloud-limits.mjs` computes the cloud limits.
- **Decisions:**
  - D-008: clouds as walls, exact limits 232.5 / 533.5 from alpha masks.
  - D-009: physics values, a ~15 s run, and the glide to the playfield centre on the first tap.
- **Findings that changed the plan:** at the player's columns the top clouds reach down to y 234.5, so the design start is only 26 px below the ceiling. The originally proposed lines (204.5 / 598.5) and a 63 px jump would have killed the player on the first tap; this led to the start glide ([ai-log #8](../ai-log.md)).
- **Verification:** Playwright MCP against `npx serve`. Taps are dispatched `pointerdown` events; positions are read from `transform`.

  | Scenario | Expected | Result |
  |---|---|---|
  | Before the first tap | `start`, no transforms, A2 unchanged | ✅ stage identical to A2 (77.5 dB) |
  | Tap → glide | `playing` after 0.6 s game time at top 383 | ✅ top 383.0, scroll 87.2 px (= 0.6 s) |
  | No further taps | `fail` ~0.43 s later at the floor, frozen | ✅ top 533.5, scroll 150.6–150.9 px (≈ 1.04 s), frozen |
  | Same, 3 reloads | identical timing (no doubled loop) | ✅ scroll at fail within 0.3 px |
  | Rapid tapping | `fail` at the ceiling | ✅ top 232.5 |
  | Bot keeps the player alive | `win` at exactly 2166 px after ~14.9 s | ✅ `translateX(-2166px)` after 14.96 s |
  | Hidden tab for 0.6 s | no movement, no jump on resume | ✅ 0 px while hidden, +2.2 px (one frame) on resume |
  | Space / held Space | starts and jumps; repeats ignored | ✅ repeats did not stop the fall; a real press jumped |
  | Console and network | no errors, no requests outside the variant | ✅ |

  - Wall time is slightly longer than game time when the headless browser drops below 30 fps; the frame clamp slows the game rather than skipping (D-009).
  - Mid-run screenshot: [a3-midrun.png](../img/a3-midrun.png).
- **Manual check left for the user:** physics feel on a real phone. All values are in the constants at the top of `game.js`.
- **Standards checklist:** all items passed.
- **AI:** ai-log #8 and #9.
