# Stage F — Final

**Goal:** both ads checked against every line of the brief, tested on real devices, documented for the reviewer, recorded and submitted by 2026-11-08 ~17:50 CET.

## F1 Brief checklist
- **Status:** ✅ done
- **Commit:** `docs: add the brief checklist`
- **Time:** ~0.5 h
- **What was done:**
  - [brief-checklist.md](../brief-checklist.md) has one row per requirement of the brief (ground rules, both variants with format, required behaviour and nice-to-haves, deliverables). Each row gives its status, the files and its evidence (decision, stage verification or today's smoke test).
  - The deviations are collected with their reasons, and the open items are assigned to F2–F6.
  - The upstream brief (`2e8cc9a`, 2026-11-05) only reworded two sentences, so no requirement changed.
- **Result:** 40 rows: 27 met (6 of them with a follow-up in F2 or F3), 8 met with a deliberate deviation, 5 open, all assigned to F2–F6. No code change was needed.
- **Smoke test** (Playwright MCP against `npx serve`):

  | Check | Result |
  |---|---|
  | A unchanged since its verification | ✅ `git diff bb376cc -- variant-a-game` is empty |
  | A at 390×844: start screen | ✅ `start`, 15 obstacles with 15 unique sources |
  | A: mute before the first run | ✅ `aria-pressed` true, the game stays on `start` |
  | A: first tap | ✅ `ready`, then `playing` |
  | A: hidden page while playing | ✅ the track's transform does not change |
  | A: no taps | ✅ `fail` and the fail endcard |
  | A: CTA with `window.open` stubbed | ✅ `https://example.com/landing` with `_blank`; a `clickTag` set later is used on the next click |
  | A: replay ×2 | ✅ back to `start` with the endcards hidden; 1 active tween, the tutorial hand loop (A7); tap → fail 1 044 / 1 046 ms, so no doubled speed |
  | B preview | ✅ the three timelines at 409–410 ms, 25.5 s long; a click on each part opens the fallback URL, the empty middle opens nothing |
  | B reduced motion | ✅ all three at the end state at once |
  | Console and network, A and B | ✅ no messages; only local files |
  | Weight | ✅ A 1 509 240 B (1.44 MB); B 1 726 322 B (1.65 MB) as three packages, 1 553 059 B counted once |

- **Open, by step:**
  - **F2:** real iOS Safari and Android Chrome for A (toolbars, audio unlock, collision feel); a real laptop for B (intro and idle feel, the bottom-edge row seen headless in B3, the moss after the scale animation in B4).
  - **F3:**
    - README: next steps, known issues from the deviations, AI note, compression summary, final run instructions and status;
    - a short summary on top of `DECISIONS.md`;
    - `docs/task-brief.md` following `2e8cc9a`;
    - a sentence that Variant B is fixed-size by design.
  - **F4:** recording under 1 minute.
  - **F5:** read-through and pragmatic review.
  - **F6:** public repository and the reply with the link.
- **AI:** ai-log #28.

## F2 Real-device test
- **Status:** ✅ done; iOS Safari not tested (no device)
- **Commit:** `docs: log the real-device checks`
- **Time:** ~0.75 h
- **Variant A on an Android phone** (Chrome, served over the local network, checked by the user on 2026-11-07):
  - Screenshots of the game and of both endcards with the toolbar shown: the stage fills the width, the strips above and below it take the edge colours with no hairline, and the win poo sits in its bubble with the party cone in front.
  - Reported by the user: sound starts on the first tap, mute silences it, the music loop returns without a gap, the effect levels are right, the collision feels fair, two or three replays keep the same speed without doubled sounds, and an app switch or a screen lock pauses the game and the sound, which then resume cleanly.
  - Variant B's preview on the same phone fits the 1680×975 fireplace to the width (scale ~0.25), undistorted. The fireplace is a desktop format, so this was only a sanity check.
- **Variant B on this laptop** (1536×864 at 125%, Intel UHD and RTX 3050):
  - By eye, by the user on 2026-11-08: the intro is smooth, and the idle phase is calm and not distracting.
  - Bottom edge of the top banner (`top` with reduced motion, rows around y 250): only page background below the banner in headless Chromium 148 at 1×, in Microsoft Edge at 1×, and in Edge at 1.25×, where the edge at 312.5 device px is drawn whole (row 312 moss, row 313 background). The partial row seen in B3 came from that headless browser's device pixel ratio of 1.0000000149, not from the ad.
  - Moss after the scale animation (each part at its end after 27 s, against reduced motion): identical (PSNR ∞) in all three parts at 1× and 1.25× in headless Chromium 148, so B4's 57–59 dB is not reproduced. The same comparison does detect the moss mid-zoom (41.7 dB).
  - Not measured: frame timing on the visible screen. Browser windows started from the automated session open minimized and are throttled, so those numbers were discarded (ai-log #31); B7's trace stands.
- **Result:** the F2 follow-ups of A-F, A3, A6, B4 and B6 in the [brief checklist](../brief-checklist.md) are closed. iOS Safari stays untested and is listed in the README's known issues.
- **AI:** ai-log #31.

## F3 Docs
- **Status:** ✅ done
- **Commits:** `docs: sync the task brief with upstream 2e8cc9a`, `docs: add an at-a-glance summary to the decision log`, `docs: complete the README for submission`
- **Time:** ~0.75 h
- **What was done:**
  - **[README.md](../../README.md)**, assembled from `docs/`:
    - status line;
    - run instructions (one command) and dev flags;
    - a compression table per variant with before / after bytes;
    - how the build was checked, including what real devices still have to show (F2);
    - known issues and shortcuts: the open client questions, every deviation from the [checklist](../brief-checklist.md#deviations), and the limitations;
    - next steps with more time;
    - the AI note, with ai-log #16 as its example.

    It also says that Variant B is fixed-size by design.
  - **[DECISIONS.md](../../DECISIONS.md#at-a-glance):** an at-a-glance summary on top that answers the brief's example questions (scaling, canvas vs DOM, collision, background, audio, compression) in one bullet each and points to the entries.
  - **[task-brief.md](../task-brief.md):** follows `2e8cc9a`. Below its header it matches the upstream file byte for byte (`diff` against the raw file from GitHub); only the two known sentences changed.
  - **[brief-checklist.md](../brief-checklist.md):** G6, D2, D3 and D4 are met, and the F3 gaps are closed.
- **Result:** 40 rows: 30 met (5 of them with a follow-up in F2), 8 met with a deliberate deviation, 2 open (F4 recording, F6 public repository). Counted with a script.
- **Verification:**

  | Check | Result |
  |---|---|
  | Weights quoted in the README | ✅ re-measured: A 1 509 240 B (folder without `design/`); B 1 726 322 / 1 553 059 B (`weight.mjs`) |
  | Every fact in the README and the summary | ✅ checked against its source (DECISIONS, stage logs, questions, AI log) |
  | Links and anchors in the changed files | ✅ all resolve (script) |
  | Line endings | ✅ LF only |
- **AI:** ai-log #29.

## F4 Recording
- **Status:** ✅ done
- **Commit:** `docs: add a screen recording`
- **Time:** ~1.5 h
- **What was done:**
  - **[docs/recording.mp4](../recording.mp4):** 36.9 s, 1920×1080, 30 fps, H.264 with AAC sound, 6 472 494 B. Variant A takes 28.0 s and Variant B 8.9 s, each with a short caption that says how it was made.
  - **Capture:** headless Chromium 148 rendering on the RTX 3050 (ANGLE, Direct3D 11), recorded through the CDP screencast as JPEG frames with timestamps, and assembled with `ffmpeg` at each frame's real duration. Variant A runs in a 780×1688 viewport, the picture of a 390×844 phone at 2×; Variant B is the preview at 1680×975.
  - **The winning run:** a script in the page reads only the DOM (the obstacles' positions, the player's and the track's transforms) and presses Space. It keeps the player between the obstacles on the winning sides of D-010 (above `bac5`), looking ahead because climbing is slower than falling. With GPU rendering it won 4 runs out of 4, with 31 presses each.
  - **Sound:** headless capture records no audio, so the track is the ad's own files at the gains in `audio.js`, placed at the logged game events: the music from its first audible frame at each `ready` until `fail` / `win` with the 0.3 s fade, the crash at `fail`, the fail sound 1.05 s later (0.6 s hold + the cue at 0.45 s), and the cheer and the applause 0.75 s after `win`. True peak −2.9 dBFS.
  - The recording scripts are not in the repository: they load Playwright from the local `npx` cache, and the project has no `package.json` (D-001).
- **Findings that changed the plan:**
  - The screencast delivers CSS pixels, so 390×844 at 2× came out at 390×844; the 780×1688 viewport gives the same picture with twice the pixels.
  - Software rendering at that size dropped to ~23 fps, and the game's frame clamp then slows it down: the bot lost, and the recording would have shown the game in slow motion. GPU rendering holds 59–60 fps, and the bot now measures game time from the scroll (ai-log #32).
  - `ffmpeg` 8 draws a line break in a caption file as a missing glyph, so each caption line is its own `drawtext`.
- **Verification:**

  | Check | Result |
  |---|---|
  | Frame clock vs game events | ✅ the first frame after `reveal` shows the stage; the frame after `fail` shows the poo on the floor clouds |
  | Real-time speed | ✅ the winning run reaches `win` 14.95 s after its tap, as the physics give (2166 px at 145 px/s) |
  | Content | ✅ checked frames: the intro, the fail endcard, the run through Stress and Tabu, the win endcard, the fireplace intro and its end state |
  | Length and format | ✅ 36.85 s (under 1 minute), 1920×1080, H.264 and AAC |
- **AI:** ai-log #32.

## F5 Review
- **Status:** ✅ done
- **Commits:** `refactor: tidy variant A exports, lookups and debug flags`, `refactor: drop the unused part field from the fireplace ready message`
- **Time:** ~1 h
- **What was done:**
  - **Read-through** of the shipped code of both variants (HTML, CSS, `js/`, without `vendor/` and `design/`), checked for logic errors against D-005–D-029. None found: the run state machine, collision, audio unlock and loop, endcard hold and replay teardown, the shared start, the idle timing and the clickout do what their decisions describe.
  - **`/maister:reviews-pragmatic`:** complexity low for the scope (A 662, B 195 lines of code; one runtime dependency; no classes, factories or config). No over-engineering. 0 critical, 0 high, 1 medium, 14 low findings.
  - **Fixed:**
    - Variant A: `findLoop()` and `PLAYER_START_TOP` are no longer exported (nothing imported them). `main.js` uses `find()` from `dom.js` like the other modules. `debug.js` loads only for `?debug=1` / `?overlay=1`; before, any value such as `?debug=0` loaded it unused.
    - Variant B: the `ready` message no longer carries the part name, which nothing read and D-026 says it does not carry; `waitForStart()` lost its parameter. `settleBack` is `SETTLE_BACK` like the other constants, and a comment says why the idle phase starts at the same moment in every part.
  - **Not changed, with reasons:**
    - The medium finding (Space on the focused mute toggle flipping mute in Firefox) was reasoned, not tested; a Playwright script in Firefox 150 and Chromium 148 showed it does not happen (ai-log #30).
    - The `stopping` flag in `audio.js` stays: no current flow reaches it, but it is three lines that keep a sound from being faded and stopped twice, and removing it would mean re-checking the replay audio on real phones for no gain.
    - The endcard `addBeats` callback, the declaration order in `intro.js`, the repeated stage constants in `debug.js`, the two `setupIntro` shapes and the 13-line `clickout.js` are style points; changing them now would only churn reviewed code.
    - Variant B's design-overlay CSS ships in `style.css` (19 lines); moving it into `debug.js` and a `serve.json` with `cleanUrls: false` (so `?overlay=1` survives on `*.html` URLs) are next steps.
- **Findings:** Firefox logs "Layout was forced before the page was fully loaded" once per part inside the preview. It is the same on the code before F5, the parts' stylesheet is loaded before their module runs, so no unstyled frame shows; left as is.
- **Verification** (Playwright, Chromium 148 and Firefox 150, against `npx serve` of the changed tree):

  | Check | Result |
  |---|---|
  | `level-check.mjs`, `cloud-limits.mjs --tolerance=2` | ✅ all D-010 rules pass; limits 230..535.5 as in `game.js` |
  | A: start, 15 unique obstacles, mute before the first run, first tap → `playing` | ✅ both browsers |
  | A: hidden page while playing | ✅ the track's transform holds |
  | A: fail endcard, CTA with `window.open` stubbed | ✅ `https://example.com/landing`, `_blank` |
  | A: replay ×2 | ✅ back to `start` with the endcard hidden; tap → fail 1 052 / 1 040 ms (Chromium), 1 060 / 1 060 ms (Firefox) |
  | A: `?debug=1`, `?overlay=1`, `?debug=0` | ✅ `debug.js` loaded, loaded, not loaded |
  | B preview: shared start | ✅ three timelines of 25.5 s, start moments within 2.4 ms (Chromium) and 3.0 ms (Firefox) |
  | B: clickout in each part, standalone `left` starts at once, reduced motion at the end state, part `?overlay=1` | ✅ both browsers |
  | Console and network | ✅ no messages except the Firefox warning above; only local requests |
  | Weight | ✅ A 1 509 115 B (−125 B); B 1 726 568 B as three packages (+82 B in each package, mostly the new comment), 1 553 141 B once; still 1.44 / 1.65 / 1.48 MB. README and checklist updated; D-019 and D-029 keep the numbers measured when they were decided |
- **AI:** ai-log #30.

## F6 Submit
- **Status:** ✅ done; the reply with the link is sent by the user from the task thread
- **Commit:** `docs: log the submission`
- **Time:** ~0.25 h
- **What was done:**
  - The repository was switched to public on 2026-11-08 at 12:14 CET (`gh repo edit --visibility public`).
  - What became visible was checked first: only `main`, with 39 commits before this one, a single author and no AI co-author trailers. No tags, and the local backup branch was never pushed.
  - Checked without login: the raw `README.md` on `main` answers 200, and `gh repo view` reports `PUBLIC`. The github.com pages were answering slowly at the time (503 and timeouts), so the link is to be opened once in a private window before the reply goes out.
- **Result:** every row of the [brief checklist](../brief-checklist.md) is met, 8 of them with a deliberate deviation; iOS Safari is the one device left untested.
