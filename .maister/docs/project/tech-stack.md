# Technology Stack

## Overview
This document describes the technology choices and rationale for Rich media ads take-home (SF-FE-01-BAM). The brief fixes most of them:
- plain HTML, CSS and modern JavaScript
- GSAP as the only allowed animation library
- canvas, DOM or Phaser for the game

Status markers: **present** (in the repo now) and **planned** (added in the first step that needs it, per D-002).

## Languages

### HTML5 / CSS3 — present
- **Usage:** document structure and layout of every ad. Fixed-size stages, positioned with values from the asset audit.
- **Rationale:** required by the brief. No preprocessor is needed at this size.

### JavaScript (ES2020+, native ES modules) — present
- **Usage:** game logic, animation timelines, audio, cross-frame messaging.
- **Rationale:** required by the brief. Native modules need no bundler. TypeScript is not used because it would add a build step.

### JavaScript (Node.js 18+, ESM) — present
- **Usage:** read-only tooling in `tools/audit/` (asset measurements).

## Frameworks and libraries

### Frontend
None, by rule — no React, Vue, Angular or Svelte.

### Animation: GSAP 3.15.0 — planned
- Vendored as a minified file inside each variant folder, so every ad is self-contained and the library counts towards its weight.
- Pinned to an exact version. 3.15.1 was skipped because it was released on the day the project started.

### Game rendering — static layers present, moving scene decided at A3
- Static layers are DOM `<img>` elements on the scaled stage (A1).
- The moving scene (gut, obstacles, player) will be canvas 2D or DOM transforms. The choice is made at A3 and recorded in DECISIONS.md.
- Phaser is avoided for weight.

### Audio: Web Audio API — planned
- Buffers decoded once.
- Gapless loop via `loopStart`/`loopEnd`, which works around the silence in the provided loop.
- A gain node per sound and a master gain for mute.
- `suspend()`/`resume()` on `visibilitychange`.

### Testing: Playwright — browser tools in use, npm package deferred
- Viewport screenshots at 320×568, 375×667, 390×844 and 430×932, plus geometry checks, run with the Playwright MCP browser tools of the development environment (from A1). No npm dependency yet (D-002).
- Real-device checks on iOS Safari and Android Chrome are done by hand.

## Database
Not applicable. Static ads, no backend or persistence.

## Build Tools & Package Management
- No bundler. Files are served as they are with `npx serve .`.
- `package.json` appears only when Playwright is added, for dev tooling. Nothing in the shipped ads depends on it.

## Asset pipeline
- `ffmpeg` / `ffprobe` (present): audio analysis now, audio re-encoding at A8.
- A scripted, lossless `tRNS` fix for the four Variant B palette PNGs that lost transparency (planned, B1).
- The PNG/JPEG optimiser is chosen at A8/B7. Originals stay in history and optimised files replace them in separate commits.

## Infrastructure
- **Hosting:** public GitHub repository (the deliverable). The ads are opened through a local static server.
- **CI/CD:** none.

## Development Tools
- **Formatting:** EditorConfig — UTF-8, LF, 2-space indent. `.gitattributes` enforces LF and marks media as binary.
- **Linting / type checking:** none configured.

## Key Dependencies
| Dependency | Version | Where | Status |
|---|---|---|---|
| GSAP | 3.15.0 | vendored per variant | planned |
| Playwright | pinned when added | dev only | planned |
| Node.js | 18+ | tooling only | present |
| ffmpeg / ffprobe | 8.x | tooling only | present |

## Version Management
- Git with conventional commits, one commit per logical unit.
- Dependencies pinned to exact versions.

---
*Last Updated*: 2026-11-04
*Auto-detected*: repository conventions, Node tooling and ffmpeg usage. *User-provided*: planned stack, constraints and the reduced Maister setup.
