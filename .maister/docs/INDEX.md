# Documentation Index

**IMPORTANT**: Read this file at the beginning of any development task to understand available documentation and standards.

## Quick Reference

### Project Documentation
Project-level documentation covering vision, goals, architecture, and technology choices.

### Technical Standards
Coding standards, conventions, and best practices organized by domain: `global` (language-agnostic) and `ads` (rich media ad specifics).

---

## Project Documentation

Located in `.maister/docs/project/`

### Vision (`project/vision.md`)
Pitch and problem statement for the two HTML5 rich media ads (Variant A "Gut Run" mobile tap-to-jump game, Variant B desktop fireplace skin) built for the We The Folks take-home, including the hard constraints: unknown ad slots, under 3 MB per ad, no UI frameworks, blocked audio autoplay and pixel accuracy. Also covers target users (phones 320×568 to 430×932, desktop publisher visitors, reviewing engineers), key features per variant, success criteria with delivery by ~2026-11-08, and differentiators (measurement-first positioning from `tools/audit/`, documented asset conflicts, an honest AI-mistake log).

### Roadmap (`project/roadmap.md`)
Four-day plan (2026-11-04 to ~2026-11-08, ~14–16 h budget) split into Stage 0 Setup, Stage A (A1–A8 game ad), Stage B (B1–B7 fireplace) and Stage F (F1–F6 brief checklist, real-device tests, docs, recording, review, submission); each step is one commit with planned hours and a log in `docs/stages/`. Includes a day-by-day schedule and an ordered cut list (difficulty ramp, `postMessage` sync, debug overlays, recording), noting that required brief behaviours are never cut.

### Tech Stack (`project/tech-stack.md`)
Plain HTML5/CSS3 and native ES2020+ modules with no UI framework, bundler or TypeScript; GSAP 3.15.0 vendored per variant as the only animation library; Canvas 2D gameplay with DOM overlays for Variant A; Web Audio API (gapless `loopStart`/`loopEnd`, per-sound and master gain, suspend/resume on `visibilitychange`); Playwright screenshots at four phone viewports. Also lists Node.js 18+ audit tooling, ffmpeg/ffprobe and the planned asset pipeline (`tRNS` fix, optimiser at A8/B7), EditorConfig/`.gitattributes` (UTF-8, LF, 2-space), exact version pinning, and a present/planned status for each item.

### Architecture (`project/architecture.md`)
Planned structure of two self-contained variant folders with no shared runtime. Variant A: a 360×640 logical stage scaled to the viewport, a canvas layer under DOM overlays, a module split around the `start → ready → playing → fail | win` state machine, alpha-mask collision and a `requestAnimationFrame` loop with full teardown on replay. Variant B: standalone `top`/`left`/`right.html` parts plus a 1680×975 `preview.html` in iframes, a shared global coordinate system for a continuous moss zoom, and `postMessage` ready/start sync with standalone autostart; also covers the `clickTag` fallback, `?debug=1` and the per-ad 3 MB deployment rule.

---

## Technical Standards

### Global Standards

Located in `.maister/docs/standards/global/`

#### Coding Style (`standards/global/coding-style.md`)
Consistent naming patterns, automated formatting, descriptive names (no cryptic abbreviations or single letters outside tight loops), small single-purpose functions, EditorConfig formatting (UTF-8, LF, 2-space indentation, final newline, no trailing whitespace except Markdown hard breaks) with `.gitattributes` keeping LF and never CRLF, no dead code (unused imports, commented-out blocks, orphaned functions), no backward-compatibility code paths unless required, and DRY extraction of repeated logic.

#### Commenting (`standards/global/commenting.md`)
Self-explanatory code through structure and naming, brief comments only where logic is not self-evident, and no change/changelog comments (comments are timeless explanations).

#### Minimal Implementation (`standards/global/minimal-implementation.md`)
Build only what is called, every function has a caller or a clear readability purpose, delete exploration artifacts, no future stubs or placeholder functions, no speculative abstractions (factories, strategies, adapters) without an immediate need, review new functions for callers before completing a task, and remove unused code promptly.

#### Error Handling (`standards/global/error-handling.md`)
Clear user-facing messages without internal details, fail fast on invalid input and preconditions, specific error types instead of generic ones, handling at appropriate boundaries rather than scattered try-catch, graceful degradation when non-critical parts fail, retry with exponential backoff for transient external failures, and guaranteed resource cleanup.

#### Git Workflow (`standards/global/git-workflow.md`)
One commit per roadmap step and logical unit, conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`) with specific subjects, and provided assets committed as delivered with optimised or repaired versions replacing them in separate later commits. Also covers marking binary media formats in `.gitattributes` (adding new formats in the same commit) and never committing `node_modules/`, logs, OS metadata, Playwright output, `tools/out/` or `.env` files (only `.env.example`).

#### Documentation (`standards/global/documentation.md`)
One-line `DECISIONS.md` entries (`**D-XXX Topic:** decision — why`, sequential, grouped by stage) with detailed records in `docs/decisions/D-XXX-topic.md` following `_template.md`, and open questions logged in `docs/questions.md` with a built default, blocked steps and status. Also covers ticking roadmap steps with planned/actual hours and updating `docs/stages/` in the same commit as the code, logging every corrected AI mistake in `docs/ai-log.md`, and keeping `architecture.md` and `tech-stack.md` in sync so the final README and DECISIONS are assembled from `docs/`.

#### Project Structure (`standards/global/project-structure.md`)
Self-contained variant folders (`variant-a-game/`, `variant-b-fireplace/`) with no shared runtime, shipped without `design/`; no build step (plain HTML, CSS and native ES modules served with `npx serve .`). Dependencies added only when first needed, pinned to exact versions and not younger than about two weeks, with runtime libraries like GSAP vendored per variant; `tools/` scripts are read-only Node 18+ `.mjs` files with a purpose comment, a README entry and scratch output only in the git-ignored `tools/out/`.

### Ads Standards

Located in `.maister/docs/standards/ads/`

*No standard files yet. Rich media ad standards will be added via `/maister:standards-update`.*

---

## How to Use This Documentation

1. **Start Here**: Always read this INDEX.md first to understand what documentation exists
2. **Project Context**: Read relevant project documentation before starting work
3. **Standards**: This index only points to the standards — open and follow the specific standard files relevant to your task; don't rely on the index alone
4. **Keep Updated**: Update documentation when making significant changes
5. **Customize**: Adapt all documentation to your project's specific needs

## Updating Documentation

- Project documentation should be updated when goals, tech stack, or architecture changes
- Technical standards should be updated when team conventions evolve
- Always update INDEX.md when adding, removing, or significantly changing documentation
