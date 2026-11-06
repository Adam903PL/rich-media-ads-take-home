# Decision log

Short entries, newest at the bottom. Bigger decisions link to a detailed record in [`docs/decisions/`](docs/decisions/).

Format: **D-XXX Topic:** decision — why ([details](docs/decisions/D-XXX-topic.md))

## Setup

- **D-001 Tooling:** no bundler, plain HTML/CSS/ES modules served by `npx serve` — the brief allows it and it keeps the shipped ad free of build artefacts.
- **D-002 Dependencies on demand:** GSAP and Playwright are added in the first step that needs them, not up front.
- **D-003 Workflow:** reduced Maister setup — project docs, a trimmed `global` set plus custom `ads` standards, and `quick-plan`/`quick-dev` per roadmap step instead of the full development orchestrator. This keeps the process overhead proportional to a 4-day task while the brief's rules are still checked at every step.
- **D-004 Weight budget:** the fireplace counts as one ad, so `top`, `left` and `right` together stay under 3 MB. This is the stricter reading of "total ad (all files you ship)", and it is achievable.

## Variant A

- **D-005 Viewport scaling:** contain-fit the 360×640 stage to the visible `100dvh` area and fill the spare strips with the stage's measured edge colours. The whole design is always visible and gameplay is identical on every phone ([details](docs/decisions/D-005-viewport-scaling.md)).
- **D-006 Renderer:** the moving scene (gut, obstacles, player) is DOM `<img>` elements moved with `transform`, not canvas or Phaser. It shares one scaling model with the static layers and stays crisp at every pixel ratio, and collision uses alpha masks that do not depend on the renderer ([details](docs/decisions/D-006-moving-scene-renderer.md)).
- **D-007 Start screen without obstacles:** the brief lists the start screen as logo bar, headline and tutorial, so the obstacles shown in the mockup are treated as illustration. They first appear during the run.
- **D-008 Playfield bounds:** the clouds are walls. Since they are static and the player's x is fixed, the exact alpha-mask collision reduces to two limits for the player's top edge, 232.5 and 533.5, computed by `tools/audit/cloud-limits.mjs` ([details](docs/decisions/D-008-playfield-bounds.md)).
- **D-009 Physics and start:** ~15 s run (145 px/s), gravity 1600 px/s², jump −420 px/s (≈ 55 px). The first tap glides the player from its design position, only 26 px below the ceiling, to the playfield centre in 0.6 s before control starts. Space and ArrowUp work like a tap ([details](docs/decisions/D-009-physics-and-start.md)).
- **D-010 Obstacle layout:** a fixed, designed layout of the 15 obstacles on the gut's tubes. `tools/audit/level-check.mjs` checks it against tube, band and room rules, propagates reachable heights at human tapping speed and marks dead ends. A planning bot won every run ([details](docs/decisions/D-010-obstacle-layout.md)).
- **D-011 Collision:** alpha masks from the images on the 2x grid; a box test first, then pixels. The player's mask is eroded by 2 px for a slightly forgiving hit, and the same rule recomputes the cloud limits (now 230 / 535.5). Rectangles were rejected because empty corners would kill ([details](docs/decisions/D-011-collision.md)).
- **D-012 Loading GSAP:** `vendor/gsap.min.js` is loaded by a classic `defer` script before the module scripts, and the modules use the global `gsap`. It is one 72.9 KB file, byte-identical to the npm release. The package's ES module entry would mean three unminified files (237.5 KB) without a bundler.
- **D-013 Endcards and replay:** each endcard is a full-screen layer above the stage and its caps, with its own logo bar and a navy bottom cap. After a 0.6 s (fail) / 0.4 s (win) hold on the crash or finish, a ~1.9 s GSAP entrance plays with the buttons last. Replay returns to the start screen: `destroy()` removes the run's loop and listeners, and the entrance timelines are rewound. The endcard covers the frozen game on every phone, the player chooses when the next run starts, and a replay leaves nothing running.
