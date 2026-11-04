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
