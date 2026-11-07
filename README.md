# Rich media ads — take-home (SF-FE-01-BAM)

Two animated rich media ads built from a designer's layout and exported assets ([task brief](docs/task-brief.md)):

- **Variant A — Game Ad "Gut Run"** (`variant-a-game/`): a mobile fullscreen tap-to-jump mini game. Fair pixel-mask collision, each of the 15 obstacles once per run, fail and win endcards with a clean replay, music and effects with a mute toggle.
- **Variant B — Fireplace Ad** (`variant-b-fireplace/`): a top banner and two skyscrapers on one continuous moss background. A 3.5 s intro started in sync across the three parts, a calm idle phase that comes to rest at 25.5 s, and a clickout on the whole of each part. The parts are fixed-size ad slots (1032×250 and 320×975) rendered 1:1, so they do not scale by design; only the preview page fits the whole fireplace to the window.

> **Status:** both variants are complete. Every requirement of the brief is checked row by row in the [brief checklist](docs/brief-checklist.md), and each ad is under 3 MB (A 1.44 MB, B 1.65 MB). Real-device checks on iOS Safari and Android Chrome are still to come (see [How it was checked](#how-it-was-checked)).

## Run locally

```bash
npx serve .
```

Then open:

- `http://localhost:3000/variant-a-game/`: tap or click to jump (Space and ArrowUp work too);
- `http://localhost:3000/variant-b-fireplace/preview.html`: the whole fireplace (1680×975), scaled down to fit smaller windows and never above 1:1. Reload to see the intro again. Each part also opens on its own (`top.html`, `left.html`, `right.html`).

Requires Node 18+; any static server works. There is no build step.

### Dev flags

| Flag | Effect |
|---|---|
| `?debug=1` | Variant A: draws the collision masks (the player's after the 2 px erosion), their boxes and the player's cloud limits; whatever ended the run turns red |
| `?overlay=1` | Variant A: lays the start-screen design over the stage at 50% opacity (needs the `design/` folder, which is not shipped) |
| `?overlay=1` | Variant B: lays `design/layout.png` at 50% opacity over a part, or over the whole fireplace on the preview page. Use the clean URL, e.g. `/variant-b-fireplace/preview?overlay=1`: `serve` redirects `preview.html` to `preview` and drops the query |

## Compression

| Variant | What was done | Before → after |
|---|---|---|
| A | Sound effects re-encoded with LAME: mono 96 kbps where the file is practically mono, stereo 128 kbps otherwise; gains corrected so the loudness targets still hold. The music stays as delivered (already 64 kbps) ([D-018](DECISIONS.md#variant-a)) | audio 1 369 577 → 814 881 B |
| A | PNGs recompressed losslessly with `ffmpeg`; a file is replaced only if it gets smaller and its decoded pixels hash the same ([D-019](DECISIONS.md#variant-a)) | 640 055 → 574 516 B |
| | **Variant A shipped** (the folder without `design/`) | **2 129 475 → 1 509 240 B (1.44 MB, 48% of 3 MB)** |
| B | One continuous background: each part ships its own crop of `bg-big.jpg`, re-encoded at high quality; the per-part `bg.jpg` files and `bg-big.jpg` are not shipped ([D-020](docs/decisions/D-020-background-source.md)) | backgrounds 3 406 018 → 1 235 592 B |
| B | PNGs recompressed losslessly with the same method ([D-028](DECISIONS.md#variant-b)) | 220 634 → 216 667 B |
| | **Variant B shipped** as three separate packages, each with its own copy of the shared code and GSAP ([D-029](DECISIONS.md#variant-b)) | **1 726 322 B (1.65 MB, 55% of 3 MB)**; 1 553 059 B with every file counted once |

Four of Variant B's PNGs had also lost their transparency in export; a lossless one-chunk repair makes their black background transparent again ([D-021](DECISIONS.md#variant-b)). To reproduce Variant B's numbers: `node tools/audit/weight.mjs variant-b-fireplace/top.html variant-b-fireplace/left.html variant-b-fireplace/right.html`.

## How it was checked

- **In the browser:** every step was verified with Playwright (Chromium) against `npx serve`. The checks covered phone viewports from 320×568 to 430×932, landscape and a live toolbar resize; replay three times with no leftover timers, listeners or doubled speed; a hidden tab; reduced motion; `clickTag` with `window.open` stubbed; a clean console and only local requests. The results are in the stage logs ([A](docs/stages/A-game.md), [B](docs/stages/B-fireplace.md), [F](docs/stages/F-final.md)).
- **Variant A's level** is checked by `tools/audit/level-check.mjs` (every obstacle reachable at a human tapping rate), and a planning bot won every run.
- **Variant B's performance** was traced in Chrome at normal and 4× slower CPU: no layout or paint while elements move, only `transform` and `opacity`.
- **Not yet checked on real devices:** iOS Safari and Android Chrome for Variant A (toolbars, the audio unlock, how the collision feels), and a real laptop screen for Variant B.

## Known issues and shortcuts

**Open questions to the client.** Sent on 2026-11-04 with a default for each, and unanswered so far, so the defaults are built ([questions](docs/questions.md)):

- The top banner headline is built as delivered ("STARK BEI …"), while `layout.png` says "NATÜRLICH STARK …" (Q1).
- Four PNGs lost their anti-aliasing in export, so the copy on the skyscrapers has slightly harder edges than in the layout. The text panel is set to the layout's 0.9 opacity and the CTA corners are clipped to their original radius (Q2, [D-021, D-023](DECISIONS.md#variant-b)).
- The packshots follow `bg-big.jpg`, the only background whose seams line up, not the layout: the right pack is ~12% larger (Q3, [D-020](docs/decisions/D-020-background-source.md)).

**Deliberate departures from the design or the brief:**

- The win endcard's poo sits 31.5 px higher than in the mockup, so it stays inside its bubble ([D-016](DECISIONS.md#variant-a)).
- The start screen has no obstacles: the brief lists its content without them, and they would break "each once" ([D-007](DECISIONS.md#variant-a)).
- The cloud bands are the playfield's top and bottom limits ([D-008](docs/decisions/D-008-playfield-bounds.md)).
- No speed ramp: the obstacle layout ramps instead, and a speed change would invalidate its reachability check ([D-017](DECISIONS.md#variant-a)).
- The tutorial hand says "tab to run": the typo is in `gesture.png`, and the assets are used as delivered.
- The fireplace product does not slide in, because it is part of the background image. The background settles from 1.08 to 1 during the intro and slowly zooms in during the idle phase, so it always ends exactly on the layout ([D-025, D-027](DECISIONS.md#variant-b)).

**Shortcuts and limitations:**

- Both ads pause only on `visibilitychange`. An ad scrolled out of view keeps running; Variant A is fullscreen, so this matters mostly for the fireplace.
- In landscape, Variant A is letterboxed with navy sides; the brief asks for portrait only.
- A fireplace part in an ad server's frame waits 300 ms for a partner before it starts on its own ([D-026](DECISIONS.md#variant-b)).
- There is no committed automated test suite. The browser checks above were run interactively and recorded in the stage logs; `level-check.mjs` and `weight.mjs` are the scripted checks.
- After the intro's scale animation, headless Chrome draws the moss from a different decoded size than a never-scaled background: 57–59 dB against the static build, only in the moss texture, with every element in place. Whether it shows on a real screen is part of the real-device check.

## What I would do next with more time

- Test on more real devices and in-app browsers (Instagram, Facebook, TikTok web views), where most mobile ads actually run.
- Pause on an `IntersectionObserver` as well, so a part scrolled out of view stops animating.
- Turn the interactive Playwright checks into a committed test suite: replay leaves nothing running, `clickTag`, reduced motion, the weight budget, and the level check, all run in CI.
- With the client's answers: rebuild the copy from the original exports with their anti-aliasing (Q2), and let the product slide in if packshot layers exist (Q3).
- Add a packaging script that zips each ad as an ad server expects (Variant A, and the three fireplace parts separately), with the weight check inside.
- Tune the difficulty from real play data, possibly with a gentle speed ramp and the layout re-checked for it.

## AI note

I built this with **Claude Code** (Opus) as a pair programmer, with the Maister plugin for a written roadmap, project standards and a plan per step ([D-003](DECISIONS.md#setup)), and **Playwright** through MCP for the browser checks. The AI did most of the measuring, planning, coding, testing and writing. I set the rules (measure, never place by eye; one step per commit; every decision and every AI mistake logged), reviewed each step and its screenshots, played the builds, and made the calls on trade-offs and on what to ask the client. Every corrected AI mistake is in [docs/ai-log.md](docs/ai-log.md).

**One example ([ai-log #16](docs/ai-log.md)).** On the win endcard, the AI stacked the layers in the order the asset audit gave (bubble, confetti, poo) and accepted a 40 dB match with the mockup, against 53 dB for the fail endcard, without asking why. I noticed in review that the party cone was hidden: in the mockup it sits in front of the poo, while the rest of the confetti stays behind it, so no single layer order can match. Moving the whole confetti layer forward would also have pulled the streamer in front. The fix is a second copy of the layer, clipped with CSS to the cone ([D-015](DECISIONS.md#variant-a)), which brought the match to 53.4 dB. Most of the other mistakes in the log share a pattern: a confident number that had not been measured, such as a hand-drawn obstacle layout with an impassable stretch (#10). That is why positions and checks come from the scripts in `tools/audit/` rather than from estimates.

## Repository layout

| Path | Contents |
|---|---|
| `variant-a-game/`, `variant-b-fireplace/` | the ads; only these folders are shipped, without their `design/` subfolders |
| `DECISIONS.md` | decision log, with a short summary on top |
| `docs/` | working documentation: brief, [brief checklist](docs/brief-checklist.md), [asset audit](docs/asset-audit.md), [questions](docs/questions.md), stage logs, detailed decisions, AI log |
| `tools/audit/` | read-only Node scripts that measured the assets, check the level and report the weight ([README](tools/audit/README.md)) |
| `.maister/docs/` | project docs, coding standards and the [roadmap](.maister/docs/project/roadmap.md) used while building |

Design files (`*/design/`) and everything outside the variant folders are reference material and do not count towards the ad weight.
