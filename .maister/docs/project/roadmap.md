# Development Roadmap

**Window:** 2026-11-04 → ~2026-11-08 (4 days from the task email). **Budget:** ~14–16 h.

Each step ends in a commit. When a step is done, tick its box here and update its log in [`docs/stages/`](../../../docs/stages/).

Effort: planned hours / actual hours.

## Stage 0 — Setup (~1 h) · done · [log](../../../docs/stages/0-setup.md)

- [x] **0.1 Repository skeleton** — gitignore, gitattributes, editorconfig, README, DECISIONS `[0.1 h]`
- [x] **0.2 Import provided assets** — unmodified copy, verified identical `[0.1 h]`
- [x] **0.3 Asset audit + recruiter questions** — measurements and P1–P5; email draft ready `[done during analysis]`
- [x] **0.4 Maister docs + standards** — project docs, trimmed `global`, custom `ads` standards `[0.5 h / 0.7 h]`
- [x] **0.5 Publish** — GitHub repository created as private for now (made public at F6), pushed `[0.1 h / 0.1 h]`

## Stage A — Variant A, Game (~6–7 h) · done · [log](../../../docs/stages/A-game.md)

- [x] **A1 Scaffold & scaling** — 360×640 stage, `dvh` / `visualViewport`, Playwright screenshots at 4 sizes `[1 h / ~1 h]`
- [x] **A2 Static start screen** — layers in order, design overlay at 50%, preload, renderer decision D-006 `[0.5 h / ~1.5 h]`
- [x] **A3 Game loop** — state machine, gravity, tap, gut scroll (`translateX`), cloud walls from masks (D-008), start glide (D-009) `[1 h / ~1 h]`
- [x] **A4 Obstacles & collision** — 15 obstacles once each (D-010), alpha-mask collision with 2 px tolerance incl. clouds (D-011), `?debug=1` `[1.5 h / ~2.5 h]`
- [x] **A5 Endcards** — static layout, GSAP entrances, CTA clickTag, clean replay `[1 h / ~1.5 h]`
- [x] **A6 Audio** — Web Audio unlock, gapless loop, per-sound gain, mute, `visibilitychange` `[1 h / ~1 h]`
- [x] **A7 Polish** — intro animation with a tapping hand, `prefers-reduced-motion`; the "get ready" glide already exists (D-009); the stage is revealed only once the game listens (`?debug=1` gap, ai-log #14). Speed ramp cut (cut list #1): the D-010 layout already ramps (D-017) `[0.5–1 h / ~0.5 h]`
- [x] **A8 Compression & weight** — effects re-encoded (D-018), PNGs recompressed losslessly (D-019); 2.03 → 1.44 MB `[0.5 h / ~0.5 h]`

## Stage B — Variant B, Fireplace (~5–6 h) · in progress · [log](../../../docs/stages/B-fireplace.md)

- [x] **B1 Background & asset prep** — crops of `bg-big.jpg` with room for a zoom around one point (D-020), `tRNS` fix (D-021) `[1 h / ~1 h]`
- [x] **B2 Static parts** — `top`/`left`/`right.html` matching the measured layout (D-022, D-023), `?overlay=1` design overlay `[1.5 h / ~1 h]`
- [x] **B3 Preview page** — three iframes with 4 px gaps, fitted to the window up to 1:1, whole-fireplace overlay (D-024) `[0.5 h / ~0.75 h]`
- [x] **B4 Intro timelines** — 3.5 s on shared beats, moss settling from 1.08 around the fireplace centre, masked line-by-line headline, CTA last (D-025) `[1.5 h / ~1.25 h]`
- [ ] **B5 Sync** — `postMessage` start plus standalone autostart `[0.5 h]`
- [ ] **B6 Idle & a11y** — calm loop stopping at 30 s, reduced motion, clickout `[0.5 h]`
- [ ] **B7 Compression & performance** — weight per part, only `transform`/`opacity` animated `[0.5 h]`

## Stage F — Final (~2 h)

- [ ] **F1 Brief checklist** — every requirement of both variants checked
- [ ] **F2 Real-device test** — iOS Safari (autoplay, toolbars), Android Chrome
- [ ] **F3 Docs** — README (run, next steps, known issues, AI note) and DECISIONS assembled from `docs/`
- [ ] **F4 Recording** — under 1 minute, stored in the repo
- [ ] **F5 Review** — full code read-through, `/maister:reviews-pragmatic`, fixes
- [ ] **F6 Submit** — switch the repository to public, then reply to the task email with the repo link

## Day plan

| Day | Scope |
|---|---|
| 1 (2026-11-04) | Stage 0, A1–A4 |
| 2 | A5–A8 (Variant A complete) |
| 3 | Stage B |
| 4 | Stage F + half a day of buffer |

## Cut list (in this order, if time runs short)
1. Difficulty ramp
2. `postMessage` sync (standalone autostart stays)
3. Debug overlays
4. Recording

Required behaviours from the brief are never cut.
