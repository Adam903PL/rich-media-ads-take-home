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

### Animation: GSAP 3.15.0 — present in Variant A
- Vendored as a minified file inside each variant folder, so every ad is self-contained and the library counts towards its weight.
- Variant A: `variant-a-game/vendor/gsap.min.js` (72.9 KB), `dist/gsap.min.js` from the npm tarball, which was checked against the registry's sha512 integrity before copying. It is kept byte-identical to the release, licence header included.
- Pinned to an exact version. 3.15.1 was skipped because it was released on the day the project started.

### Game rendering: DOM + `transform` — present (D-006)
- Static layers and the moving scene (gut, obstacles, player) are DOM `<img>` elements on the scaled stage. Moving elements change only `transform`.
- Canvas 2D and Phaser were considered and rejected; the reasons are in D-006.

### Audio: Web Audio API — present in Variant A (D-014)
- Buffers decoded once during the preload, on an `OfflineAudioContext`.
- Gapless loop via `loopStart`/`loopEnd`, found in the decoded buffer, which works around the silence in the provided loop.
- A gain node per sound and a master gain for mute.
- `suspend()`/`resume()` on `visibilitychange`.

### Testing: Playwright — browser tools in use, npm package deferred
- `tools/audit/level-check.mjs` (Node) validates the obstacle layout offline. A planning bot in the browser proves the run can be won (D-010).
- Viewport screenshots at 320×568, 375×667, 390×844 and 430×932, plus geometry checks, run with the Playwright MCP browser tools of the development environment (from A1). No npm dependency yet (D-002).
- Real-device checks on iOS Safari and Android Chrome are done by hand.

## Database
Not applicable. Static ads, no backend or persistence.

## Build Tools & Package Management
- No bundler. Files are served as they are with `npx serve .`.
- `package.json` appears only when Playwright is added, for dev tooling. Nothing in the shipped ads depends on it.

## Asset pipeline
- `ffmpeg` / `ffprobe` (present): audio analysis, and the A8 re-encode of the Variant A sound effects with `libmp3lame` (D-018).
- A scripted, lossless `tRNS` fix for the four Variant B palette PNGs that lost transparency (planned, B1).
- PNG optimiser: `ffmpeg`'s own PNG encoder, lossless. For each file it tries three predictors at zlib level 9 and keeps the result only if it is smaller and its decoded RGBA frames hash the same (`framemd5`). It was chosen in A8 because no dedicated optimiser (oxipng, optipng, pngquant) was installed, and `ffmpeg` adds no new dependency (D-019). Originals stay in history and optimised files replace them in separate commits.

## Infrastructure
- **Hosting:** public GitHub repository (the deliverable). The ads are opened through a local static server.
- **CI/CD:** none.

## Development Tools
- **Formatting:** EditorConfig — UTF-8, LF, 2-space indent. `.gitattributes` enforces LF and marks media as binary.
- **Linting / type checking:** none configured.

## Key Dependencies
| Dependency | Version | Where | Status |
|---|---|---|---|
| GSAP | 3.15.0 | vendored per variant | present (Variant A) |
| Playwright | pinned when added | dev only | planned |
| Node.js | 18+ | tooling only | present |
| ffmpeg / ffprobe | 8.x | tooling only | present |

## Version Management
- Git with conventional commits, one commit per logical unit.
- Dependencies pinned to exact versions.

---
*Last Updated*: 2026-11-04
*Auto-detected*: repository conventions, Node tooling and ffmpeg usage. *User-provided*: planned stack, constraints and the reduced Maister setup.
