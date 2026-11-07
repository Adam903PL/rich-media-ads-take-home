# Brief checklist

Every requirement of the [task brief](task-brief.md), checked against the build on 2026-11-06 (roadmap step F1). The README, DECISIONS and AI note rows were updated when F3 completed them (2026-11-07).
- The brief was updated upstream on 2026-11-05 (`2e8cc9a`). Only two sentences changed: the time estimate per variant was removed, and README item 2 now reads "what you would do next with more time". No requirement changed. [task-brief.md](task-brief.md) follows it since F3.
- Variant A has not changed since A8 (`git diff bb376cc -- variant-a-game` is empty), so its stage verifications still hold. Both variants were also smoke-tested live for this list ([F1 log](stages/F-final.md#f1-brief-checklist)).

**Status:** ✅ met · ⚠️ met with a deliberate deviation (see [Deviations](#deviations)) · ⏳ open, assigned to a Stage F step.

## Ground rules

| # | Requirement | Status | Where | Evidence |
|---|---|---|---|---|
| G1 | Plain HTML, CSS and modern JavaScript, no UI frameworks | ✅ | both variant folders | HTML, CSS and native ES modules, no bundler and no `package.json` (D-001) |
| G2 | GSAP only; Variant A on Phaser, canvas or DOM; a local server is enough | ✅ | `*/vendor/gsap.min.js` | GSAP 3.15.0 vendored per variant (D-012); Variant A renders with DOM + `transform` (D-006); `npx serve .` |
| G3 | Use the provided 2x assets at 50%, don't redraw or replace them; positions measured, not by eye | ⚠️ | `docs/asset-audit.md`, `tools/audit/` | Every image at 50% ([A2](stages/A-game.md#a2-static-start-screen), [B2](stages/B-fireplace.md#b2-static-parts)); positions from measurements. Assets processed only by lossless repair, crops and re-encodes (D-018, D-019, D-020, D-021, D-028). Deviations: D-016, Q1, Q3 |
| G4 | Every CTA opens the landing page in a new window through `clickTag` | ✅ | `variant-a-game/js/endcards.js`, `variant-b-fireplace/js/clickout.js` | `window.clickTag` read at click time, fallback `https://example.com/landing`, `_blank` ([A5](stages/A-game.md#a5-endcards), [B6](stages/B-fireplace.md#b6-idle--a11y), F1 smoke test) |
| G5 | Total ad under 3 MB; compress if needed and say what was done | ✅ | — | A 1 509 240 B (1.44 MB); B 1 726 322 B (1.65 MB) as three packages (D-029). Compression: D-018, D-019, D-020, D-028, summarised in the [README](../README.md#compression) |
| G6 | AI note: tools, use, one example of a wrong output that was fixed | ✅ | `README.md` | [AI note](../README.md#ai-note): Claude Code with Maister, Playwright through MCP; the example is ai-log #16 (the hidden party cone); the full [ai-log.md](ai-log.md) is linked |
| G7 | Assets used only for this task | ✅ | — | Used only here. The repository stays private until F6, then public as the deliverables require |

## Variant A — Game Ad "Gut Run"

| # | Requirement | Status | Where | Evidence |
|---|---|---|---|---|
| A-F | 360×640 design fills the visible viewport of phones 320×568–430×932, no distortion, nothing important cut, mind the toolbars | ✅ (⏳ F2) | `variant-a-game/js/main.js`, `css/style.css` | D-005, viewport table and live toolbar resize in [A1](stages/A-game.md#a1-scaffold--scaling); real iOS / Android toolbars in F2 |
| A1 | Start screen: logo bar, headline, tutorial overlay (`tut.png`, `gesture.png`, "tap to run"); the game starts on the first tap | ⚠️ | `index.html`, `js/game.js` | [A2](stages/A-game.md#a2-static-start-screen), [A3](stages/A-game.md#a3-game-loop); F1 smoke test: first tap → `ready`. `tut.png` is the headline (audit §2.1); "tab to run" typo is baked into the asset (N1); start screen without the mockup's obstacles (D-007) |
| A2.1 | Player on a fixed x; tap jumps, gravity without taps | ✅ | `js/game.js` | D-009, [A3](stages/A-game.md#a3-game-loop) |
| A2.2 | Gut and obstacles move from right to left | ✅ | `js/game.js` (`.track`) | [A3](stages/A-game.md#a3-game-loop), [A4](stages/A-game.md#a4-obstacles--collision) |
| A2.3 | Obstacles `bac1`–`bac6`, `txt1`–`txt9`, each exactly once per run | ✅ | `js/level.js` | D-010, `tools/audit/level-check.mjs`; F1 smoke test: 15 obstacles, 15 unique |
| A2.4 | Touching an obstacle, or leaving the playfield at the top or bottom, ends the run with the fail endcard | ⚠️ | `js/game.js`, `js/collision.js` | D-008: the cloud bands are the playfield's limits ([A3](stages/A-game.md#a3-game-loop), [A4](stages/A-game.md#a4-obstacles--collision)) |
| A2.5 | Reaching the end of the gut after all obstacles shows the win endcard | ✅ | `js/game.js` | Bot wins in [A3](stages/A-game.md#a3-game-loop) and [A4](stages/A-game.md#a4-obstacles--collision); win endcard in [A5](stages/A-game.md#a5-endcards) |
| A3 | Fair collision, not full-rectangle hitboxes | ✅ (⏳ F2) | `js/collision.js` | D-011: alpha masks with 2 px tolerance, checks in [A4](stages/A-game.md#a4-obstacles--collision); the feel on a phone in F2 |
| A4 | Fail endcard: sad poo, bacteria, headline, CTA, replay that restarts cleanly | ✅ | `js/endcards.js`, `js/main.js` | D-013, [A5](stages/A-game.md#a5-endcards) (replay ×3, listeners unchanged); F1 smoke test: replay ×2 back to `start`, tap → fail 1 044 / 1 046 ms |
| A5 | Win endcard: happy poo, confetti, headline, CTA; applause / cheer | ⚠️ | `js/endcards.js`, `js/audio.js` | [A5](stages/A-game.md#a5-endcards), [A6](stages/A-game.md#a6-audio); party cone in front (D-015); poo lifted into the bubble (D-016) |
| A6 | Music loop, crash, fail and win sounds; audio only after the first interaction; mute toggle | ✅ (⏳ F2) | `js/audio.js` | D-014, [A6](stages/A-game.md#a6-audio); F1 smoke test: mute toggles without starting the game; the iOS unlock in F2 |
| A7 | Intro animation on the start screen; animated endcard entrances; easing | ✅ | `js/intro.js`, `js/endcards.js` | D-017, D-013, [A7](stages/A-game.md#a7-polish), [A5](stages/A-game.md#a5-endcards) |
| A8 | Pause game and sound when the tab or ad is not visible (`visibilitychange`), resume cleanly | ⚠️ | `js/game.js`, `js/main.js`, `js/audio.js` | Hidden-tab checks in [A3](stages/A-game.md#a3-game-loop)–[A7](stages/A-game.md#a7-polish); F1 smoke test: the track stands still while hidden. Only `visibilitychange`: the ad is fullscreen, so it is hidden only with its tab |
| A-N1 | Nice to have: a "get ready" moment | ✅ | `js/game.js` | 0.6 s glide to the playfield centre (D-009) |
| A-N2 | Nice to have: gentle difficulty ramp | ⚠️ | `js/level.js` | Speed ramp cut; the obstacle layout ramps instead (D-017) |
| A-N3 | Nice to have: `prefers-reduced-motion` for decorative animations | ✅ | `js/intro.js`, `js/endcards.js` | [A7](stages/A-game.md#a7-polish), [A5](stages/A-game.md#a5-endcards); gameplay stays |
| A-N4 | Nice to have: `?debug=1` hitboxes | ✅ | `js/debug.js` | [A4](stages/A-game.md#a4-obstacles--collision) |

## Variant B — Fireplace Ad

| # | Requirement | Status | Where | Evidence |
|---|---|---|---|---|
| B-F | Top 1032×250 and left / right 320×975; each part its own HTML; `preview.html` places them like `layout.png`, empty middle | ✅ | `top.html`, `left.html`, `right.html`, `preview.html` | D-022, D-024, [B2](stages/B-fireplace.md#b2-static-parts), [B3](stages/B-fireplace.md#b3-preview-page). Fixed slot sizes, so no responsive layout; the [README](../README.md) says so |
| B1 | Pixel-accurate layout: logo, product, text panel, copy, CTA; three-line top headline | ⚠️ | `css/style.css` | DOM geometry and 1 px offset search in [B2](stages/B-fireplace.md#b2-static-parts), overlay [b2-overlay.jpg](img/b2-overlay.jpg). Headline copy as delivered (Q1); packshots as in `bg-big.jpg` (Q3); asset colours, panel opacity 0.9 and CTA corners (Q2, D-023) |
| B2 | One continuous moss surface, seams line up; choose `bg-big.jpg` or the per-part files and explain | ✅ | `assets/*/bg-crop.jpg` | D-020, seams in [B1](stages/B-fireplace.md#b1-background--asset-prep), shared zoom in [B4](stages/B-fireplace.md#b4-intro-timelines) |
| B3 | Intro of 3–6 s, coordinated across the parts (zoom, logos, product, panel and copy, headline line by line, CTA last) | ⚠️ | `js/intro.js` | D-025, 3.5 s, filmstrip [b4-intro.jpg](img/b4-intro.jpg). The product cannot slide in (P4); the background settles in the intro and zooms in during the idle phase |
| B4 | After the intro: alive but calm, not distracting; looping stops after about 30 s | ✅ (⏳ F2) | `js/idle.js` | D-027: moss breath and five CTA pulses, at rest at 25.5 s ([B6](stages/B-fireplace.md#b6-idle--a11y)); whether it is calm enough next to a real site in F2 |
| B5 | Clicking anywhere on a part (or at least on the CTA) opens the click tag | ✅ | `js/clickout.js` | D-027, [B6](stages/B-fireplace.md#b6-idle--a11y); F1 smoke test: each part opens it, the empty middle does not |
| B6 | Smooth on an average laptop; `transform` and `opacity` only; `prefers-reduced-motion` shows the end state | ✅ (⏳ F2) | `js/intro.js`, `js/idle.js`, `js/main.js` | Trace at normal and 4× slower CPU in [B7](stages/B-fireplace.md#b7-compression--performance); reduced motion in [B4](stages/B-fireplace.md#b4-intro-timelines)–[B6](stages/B-fireplace.md#b6-idle--a11y) and the F1 smoke test; a real laptop in F2 |
| B-N1 | Nice to have: the parts start in sync (e.g. `postMessage` from the preview) | ✅ | `js/sync.js`, `js/preview.js` | D-026, 0–4 ms apart ([B5](stages/B-fireplace.md#b5-sync)); F1 smoke test: 409–410 ms |
| B-N2 | Nice to have: debug overlay of the design at 50% | ✅ | `js/debug.js` | `?overlay=1` per part and on the preview ([B2](stages/B-fireplace.md#b2-static-parts), [B3](stages/B-fireplace.md#b3-preview-page)) |

## Deliverables

| # | Requirement | Status | Where | Evidence |
|---|---|---|---|---|
| D1 | A new public GitHub repository, not a fork; commit as you go; the link in a reply to the task email | ⏳ F6 | GitHub | Created from scratch, private until F6; 31 commits before F1, one per step |
| D2 | README: run locally in one or two commands; what next with more time; known issues and shortcuts | ✅ | `README.md` | [Run locally](../README.md#run-locally) in one command, [next steps](../README.md#what-i-would-do-next-with-more-time), [known issues and shortcuts](../README.md#known-issues-and-shortcuts) |
| D3 | DECISIONS.md: a short decision log | ✅ | `DECISIONS.md` | D-001–D-029 cover every example the brief gives: scaling (D-005), collision (D-011), background (D-020), audio (D-014), canvas vs DOM (D-006), compression (D-018, D-019, D-020, D-028). It has grown long for "short", so an [at-a-glance summary](../DECISIONS.md#at-a-glance) on top answers the brief's examples in one bullet each |
| D4 | AI note | ✅ | `README.md` | See G6 |
| D5 | Optional: a screen recording under 1 minute, stored in the repository | ⏳ F4 | — | — |
| — | Everything submitted is stored in the repository | ✅ | — | Assets, code, docs, measurements and screenshots are committed |
| — | Questions go to the task email | ✅ | [questions.md](questions.md) | Sent 2026-11-04; no answer as of 2026-11-06 |

## Deviations

Places where the build knowingly differs from the brief's wording or the design. Each was decided with the evidence at hand and is listed in the [README's known issues](../README.md#known-issues-and-shortcuts).

| What | Why | Where |
|---|---|---|
| Win endcard poo 31.5 px higher than the mockup | In the mockup it hangs over the bubble; lifted to sit inside with an 8 px margin, after review | D-016 |
| No obstacles on the start screen | The brief lists the start screen's content without them; they would also break "each once" | D-007 |
| The clouds are the playfield's top and bottom | The playfield edge is not defined; the clouds are what the player sees as walls | D-008 |
| No speed ramp | The obstacle layout already ramps; a speed change would break the layout's proof | D-017 |
| "tab to run" on the tutorial hand | The typo is baked into `gesture.png`; assets are not edited | N1 |
| Pause only on `visibilitychange` | Variant A is fullscreen; Variant B's parts usually stay in view. An `IntersectionObserver` is listed as a next step in the README | A8, B lifecycle |
| Top headline "STARK BEI …" instead of the layout's "NATÜRLICH STARK …" | Copy is the client's call; the asset is built as delivered | Q1 (open) |
| Copy edges harder than in the layout; panel at 0.9 opacity; CTA corners clipped | The PNGs lost their transparency in export; only index 0 could be restored losslessly | Q2 (open), D-021, D-023 |
| Packshots as in `bg-big.jpg`, not as in the layout | `bg-big.jpg` is the only background whose seams line up | Q3 (open), D-020 |
| The product does not slide in | It is part of the background image (P4) | D-025 |
| The background settles in the intro instead of zooming in | Zooming in would end away from the layout; the slow zoom in happens in the idle phase and returns to it | D-025, D-027 |
| Variant B is not responsive | Its formats are fixed ad slots; the preview page alone fits the fireplace to the window | D-022, D-024 |

## Gaps to close

| Gap | Brief item | Step |
|---|---|---|
| README: next steps with more time, known issues and shortcuts (from the deviations above), AI note, compression summary, final run instructions, status line | D2, D4, G5, G6 | F3 ✅ |
| A short summary on top of `DECISIONS.md` | D3 | F3 ✅ |
| `docs/task-brief.md` follows the updated upstream brief (`2e8cc9a`) | — | F3 ✅ |
| A sentence that Variant B is fixed-size by design | B-F | F3 ✅ |
| Real devices: iOS Safari and Android Chrome (toolbars, audio unlock, collision feel); a real laptop for Variant B (intro and idle feel, the bottom-edge row seen in headless B3, the moss after the scale animation in B4) | A-F, A3, A6, B4, B6 | F2 |
| Recording under 1 minute, in the repository | D5 | F4 |
| Full read-through and pragmatic review | — | F5 |
| Repository public, then the reply with the link | D1 | F6 |
