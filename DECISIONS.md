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
