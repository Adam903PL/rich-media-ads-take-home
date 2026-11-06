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

## A4 Obstacles & collision
- **Status:** ✅ done
- **Commit:** `feat: add variant A obstacles and collision`
- **Time:** 1.5 h planned / ~2.5 h actual. Most of it went into a passable layout and a bot able to prove it.
- **What was done:**
  - **Track:** `.track` (x −2) holds the gut and 15 obstacle images built from `js/level.js`, moved by one `translateX`.
  - **Collision:** `js/collision.js` builds alpha masks on the 2x grid; the player's mask is eroded by 2 px. Each frame tests boxes, then pixels.
  - **Passing and win:** passed obstacles are counted; `win` needs all 15 passed plus the end of the gut. The fail cause is kept.
  - **Debug:** `?debug=1` draws masks, boxes and cloud limits through `startGame({ onFrame })`.
  - **Tools:**
    - `tools/audit/level-check.mjs` validates the layout.
    - `cloud-limits.mjs` now uses the game's collision code; the limits are recomputed with the tolerance (230 / 535.5).
- **Decisions:**
  - D-010: fixed layout on the tubes, rules and final table.
  - D-011: mask collision with 2 px tolerance.
  - D-008 updated.
- **Findings that changed the plan:**
  - The first layout draft was partly off the tubes and impassable in one stretch.
  - A 30 px corridor is not enough, because the player bobs 55 px while holding its height.
  - Two pairs of obstacles act as gates and need reading ahead.
  - bac4 "above" is a dead end ([ai-log #10–#11](../ai-log.md)).
- **Verification:** `node tools/audit/level-check.mjs`, then Playwright MCP against `npx serve`.

  | Check | Result |
  |---|---|
  | Layout rules (ids, tubes, band, start screen, gut end, corridor room, reachability) | ✅ all pass; winning sides in D-010 |
  | Start screen unchanged (no obstacle visible) | ✅ identical to A2 (77.5 dB), 15 obstacles in DOM, 15 unique ids, 0 visible at start |
  | Boxes overlap 6×6 px but shapes do not (virus vs player) | ✅ no collision |
  | Penetration before a hit ("Stress", thin "Fertiggerichte", `bac2`) | ✅ exactly 2 px after the first visible contact |
  | Hit on "Blut" | ✅ `fail`; the full visible shapes overlapped (4 px deep); debug shows it red ([screenshot](../img/a4-debug-hit.png)) |
  | Planning bot, ≤ 1 tap per 150 ms | ✅ 2/2 wins, all 15 passed, track at −2166 px, 31 taps in ~15 s |
  | Cloud limits with tolerance | ✅ floor 535.5, ceiling 230 |
  | Collision cost, worst case | ✅ 5.5–9 µs per check |
  | Without flags | ✅ no request for `debug.js` or `design/`; only local files; console clean |

  Mid-run screenshot with words on the tubes: [a4-midrun.png](../img/a4-midrun.png).
- **Manual check left for the user:** whether the two gates and the finale feel fair on a real phone.
- **Standards checklist:** all items passed.
- **AI:** ai-log #10–#12.

## A5 Endcards
- **Status:** ✅ done
- **Commits:** `chore: vendor GSAP 3.15.0 for variant A`, `feat: add variant A endcards and clean replay`
- **Time:** 1 h planned / ~1.5 h actual
- **What was done:**
  - **GSAP:** `vendor/gsap.min.js` 3.15.0, copied unchanged from the npm tarball after checking its sha512 against the registry. Loaded by a `defer` script before the modules (D-012).
  - **Markup:** `#endcard-fail` and `#endcard-win` in `index.html`, with the layers in the audit's order and the buttons at their measured positions (audit §2.3). Their images go through the existing preload.
  - **Covering the game:** each endcard sits above the stage and its caps (z-index 2). It has its own `logo.png` and a navy bottom cap (`--bleed-bottom`), reusing the stage's cap rule.
  - **`js/endcards.js`:**
    - one paused entrance timeline per endcard, built at startup, so a missing element stops the start;
    - `show()` holds the crash or finish for 0.6 s / 0.4 s, then plays the entrance, or jumps to its end with `prefers-reduced-motion: reduce`;
    - `hide()` kills the hold and rewinds both timelines;
    - CTAs open `window.clickTag`, read at click time; replay calls back into `main.js`.
  - **`game.js`:**
    - `startGame()` returns `destroy()`: one `AbortController` for its three listeners, plus `cancelAnimationFrame`;
    - every run starts by setting `start` and rendering its zero transforms;
    - the end of a run goes through `finish()` → `onEnd`;
    - after the end, keys are left alone, so Space and Enter activate the buttons.
  - **`main.js`:** `replay()` = `destroy()`, `hide()`, then a new run on the start screen (user's choice). A single `visibilitychange` listener pauses and resumes `gsap.globalTimeline`.
  - **Entrances:**
    - fail: backdrop, bubble pop, sad poo dropping with `bounce.out`, bacteria popping in with a stagger, headline, then CTA and replay (1.9 s);
    - win: the same frame with the confetti layer bursting and the happy poo dropping (1.75 s);
    - only `autoAlpha`, `y`, `scale` and `rotation` are animated, every tween eased, all with `gsap.from` towards the static layout;
    - full-frame layers scale around the centre of their bounding box from the audit.
- **Decisions:** D-012 (loading GSAP), D-013 (endcards and replay).
- **Deviation from plan:** the plan built each entrance in a per-run `gsap.context()` and reverted it on replay. The timelines are now built once at startup and rewound on replay. Missing markup fails at load instead of at the first fail, and the replay still leaves no active tween.
- **Findings:**
  - **The audit's "pixel-identical rebuild" only holds for the graphic layers.**
    - Composited at 2x, the graphics match the mockups (fail 53.5 dB, win 40.3 dB).
    - The headline bands score 10.4 / 10.3 dB and the button bands 21.6 / 19.8 dB.
    - The button PNGs match the mockup only with mean abs diff ≈ 9 at the best position: text spacing and emoji placement differ, and the edges are 1–2 px @2x apart.
    - As with the headlines, the assets are kept. Added to audit §2.3 and `questions.md` ([ai-log #13](../ai-log.md)).
  - With `?debug=1`, the stage is revealed before `debug.js` has loaded, so a tap in that moment does not start the game. This existed before A5, affects the debug mode only, and is listed for A7 ([ai-log #14](../ai-log.md)).
- **Verification:** Playwright MCP against `npx serve`.

  | Check | Result |
  |---|---|
  | Start screen unchanged | ✅ 96.1 dB vs the A2 screenshot; 26.26 dB vs `01-start.png` (A2: 26.3) |
  | Fail endcard, final state vs own layer composite | ✅ 40.2 dB whole; bubble band 53.1, headline 51.1, buttons 32.8 (half-pixel button positions) |
  | Fail endcard vs `02-fail-endcard.png` | 18.6 dB whole: graphics match, headline and button typesetting differ (see Findings) |
  | Win via the real game (Playwright-routed `level.js` with obstacles moved off the playfield, hover bot) | ✅ `win` after 14.99 s, track at −2166 px; 41.7 dB vs own composite, graphics 53.3 |
  | Entrance frames | ✅ [filmstrip](../img/a5-entrance.png): fail top, win bottom, at 0.15, 0.4, 0.7, 1.0, 1.3 and 1.9 s; end states in [a5-endcards.png](../img/a5-endcards.png) |
  | Replay ×3 (real clicks) | ✅ each time `start`, gesture visible, endcards hidden, transforms 0, 0 active tweens |
  | Listeners after 3 replays (CDP `getEventListeners`) | ✅ unchanged: `#ad` pointerdown 1, document keydown 1, visibilitychange 2 (run + GSAP) |
  | No doubled loop | ✅ tap → fail in 1034, 1040, 1037, 1041 ms over 4 runs; jump height 48–51 px in every run |
  | clickTag | ✅ fallback `https://example.com/landing` with `_blank`; a `window.clickTag` set after load is used on the next click; replay and taps elsewhere open nothing |
  | Keyboard | ✅ Tab focuses CTA then replay with a visible ring; Enter on CTA clicks out; Space on replay replays; the next Space starts the run |
  | Reduced motion | ✅ hidden until the 0.6 s hold ends, then the final state at once (72.2 dB vs the animated end) |
  | Hidden tab | ✅ during the hold: nothing starts while hidden, the remaining hold continues after; mid-entrance: frozen at 0.404 s, +0.104 s 100 ms after resuming |
  | 320×568, 390×844, 430×932 | ✅ whole endcard visible; bottom strip `#0A1E49` with uniform seam rows; top strip white (one row at 253–254/255) |
  | Console and network | ✅ no messages; only files under `variant-a-game/`; `gsap.min.js` local; no request for `design/`; `?debug=1` keeps drawing after a replay |
  | Weight | ✅ 2.019 MB shipped (67% of 3 MB), of which GSAP 72.9 KB |
  | `node tools/audit/level-check.mjs` | ✅ all D-010 rules pass with the changed `game.js` |
- **Manual check left for the user:** the hold and entrance timing on a real phone, and tapping the buttons with a thumb.
- **Standards checklist:** all items passed. The vendored `gsap.min.js` has trailing whitespace in its licence header and is deliberately kept byte-identical to the release.
- **AI:** ai-log #13 and #14.

## A6 Audio
- **Status:** ✅ done
- **Commit:** `feat: add variant A audio`
- **Time:** 1 h planned / ~1 h actual
- **What was done:**
  - **`js/audio.js`:**
    - `loadSounds()` decodes all five files during the preload on an `OfflineAudioContext`.
    - `findLoop()` finds the music loop in the decoded buffer.
    - `setupAudio()` handles:
      - the context unlock on the first `pointerup` / `touchend` / `click` / `keydown`;
      - one looping music source;
      - one-shot sounds with per-sound gain;
      - mute on a master gain;
      - `suspend` / `resume`;
      - `stopAll()`.
  - **`game.js`:** a single `onStateChange(state)` hook replaces `onEnd`.
  - **`main.js`:**
    - `ready` starts the music; `fail` / `win` fade it out, `fail` plays the crash;
    - replay calls `audio.stopAll()`;
    - the visibility listener also suspends and resumes the audio.
  - **`endcards.js`:** a cue in each timeline plays the endcard's sound: fail when the sad poo starts to drop (0.45 s), cheer and applause when the confetti bursts (0.35 s).
  - **Mute:** an inline SVG toggle (speaker with waves or a cross, campaign navy) on the logo bar at (314, 9.75). It is centred on the measured logo height and stays above the endcards. `pointerdown` on it does not reach the game.
- **Decisions:** D-014 (audio, with a detailed record).
- **Findings that changed the plan:**
  - On touch screens `pointerdown` does not grant user activation, so unlocking audio in the game's tap handler would have failed on phones. The unlock listens to `pointerup`, `touchend`, `click` and `keydown` instead.
  - **The loop length is musical.** The file is 36 bars at 150 BPM (57.6 s) plus silence. A hard cut at 57.6 s would click, so the seam goes to the quietest frame within ±2 ms (audit §2.5).
- **Verification:** Playwright MCP against `npx serve`. An init script wrapped `AudioContext`, `AudioBufferSourceNode.start/stop` and `suspend/resume` to log every audio event.

  | Check | Result |
  |---|---|
  | No audio before a gesture | ✅ no `AudioContext` after load; created on the first `pointerup` with user activation, `running`; no console warning |
  | Music loop | ✅ one source, `loop`, `loopStart` 0.06934 s, `loopEnd` 57.66871 s (0.63 ms before 57.6 s, at a zero crossing) |
  | Loop seam (`OfflineAudioContext` render of 1 s across it) | ✅ longest quiet run 0.5 ms; step at the seam 0.0136 vs median 0.008 / p99 0.074. A hard cut at 57.6 s steps 0.147; the whole file loops with a 208 ms gap |
  | Fail | ✅ music fades in 0.3 s and the crash starts at the hit; fail starts 1055 ms later |
  | Win (routed `level.js` with obstacles off the playfield, hover bot) | ✅ the music fades at `win`; cheer and applause start 756 ms later |
  | Replay ×8 | ✅ during each run 1 music source; on the endcard crash + fail; after replay 0 playing sources; 1 `AudioContext` in total |
  | Mute | ✅ tapping it before the first run sets `aria-pressed` and keeps `start` (no game start); the context is created muted. Tapping it while playing does not jump (the player kept falling, 165 → 235 px); it toggles back |
  | Hidden tab | ✅ `suspend` from `running`, then `resume` back to `running` |
  | Reduced motion | ✅ the cue still plays fail (0.6 s after the crash, when the entrance jumps to its end); nothing fires again on replay |
  | Preload failure (routed 404 on `Fail.mp3`) | ✅ `Gut Run: failed to load assets/music/endcard_fail/Fail.mp3`; stage stays hidden |
  | Regression | ✅ fail endcard, CTA clickout, replay to `start`; `level-check.mjs` passes; console clean; only local requests (5 MP3s); weight 2.027 MB |
- **Manual check:** the user played runs to the end with sound on (2026-11-06). Still left: the loop seam and levels on real phones, and the unlock on iOS Safari and Android Chrome (F2).
- **Observation for F5:**
  - One test run ended in `win` without taps. It ran in a page where the browser served a cached `level.js` with the obstacles moved off the playfield (ai-log #15).
  - Input was not logged in that run, so its cause is unknown.
  - It did not recur in 16 later runs with the same steps and input logging (12 on the routed layout, 4 on the real one). Each showed exactly the test's own taps and failed on the floor as expected.
- **Standards checklist:** all items passed.
- **AI:** ai-log #15.

### Fix after A6: party cone on the win endcard
- **Commit:** `fix: put the party cone in front of the win endcard poo`
- **Reported by the user:** the happy poo on the win endcard looked wrong.
- **Cause:**
  - In the mockup the small green party cone sits on the poo's head, in front of it, while the rest of the confetti layer (the white streamer) stays behind the poo.
  - A5 stacked the whole `konfetti.png` behind the poo, so the poo hid its own cone.
  - Putting the whole layer on top instead would pull the streamer in front too (36.9 dB, worse than 40.3).
- **Fix (D-015):** a second copy of `konfetti.png` above the poo, clipped with `clip-path` to the cone's measured box plus 2 px (no other confetti within 3 px). The burst tween targets both copies, so the cone moves with the layer; the transforms of both copies were identical at 0.5, 0.7 and 1.75 s.
- **Verification:** a real win (routed `level.js`, hover bot), final state vs `03-win-endcard.png`:

  | Band | Before | After |
  |---|---|---|
  | Graphics | 40.8 dB | **53.4 dB** |
  | Around the poo | 29.3 dB | **42.1 dB** |

- **A5's finding corrected:** the win graphics did not match the mockup at 40.3 dB; with the cone in front they do (50.5 dB as a 2x composite, audit §2.3).
- **AI:** ai-log #16.
