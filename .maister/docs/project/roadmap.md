# Development Roadmap

**Window:** 2026-11-04 → ~2026-11-08 (4 days from the task email). **Budget:** ~14–16 h.

Each step ends in a commit. When a step is done, tick its box here and update its log in [`docs/stages/`](../../../docs/stages/).

Effort: planned hours / actual hours.

## Stage 0 — Setup (~1 h) · in progress · [log](../../../docs/stages/0-setup.md)

- [x] **0.1 Repository skeleton** — gitignore, gitattributes, editorconfig, README, DECISIONS `[0.1 h]`
- [x] **0.2 Import provided assets** — unmodified copy, verified identical `[0.1 h]`
- [x] **0.3 Asset audit + recruiter questions** — measurements and P1–P5; email draft ready `[done during analysis]`
- [x] **0.4 Maister docs + standards** — project docs, trimmed `global`, custom `ads` standards `[0.5 h / 0.7 h]`
- [ ] **0.5 Publish** — new public GitHub repository, push `[0.1 h]`

## Stage A — Variant A, Game (~6–7 h)

- [ ] **A1 Scaffold & scaling** — 360×640 stage, `dvh` / `visualViewport`, Playwright screenshots at 4 sizes `[1 h]`
- [ ] **A2 Static start screen** — layers in order, design overlay at 50% `[0.5 h]`
- [ ] **A3 Game loop** — state machine, gravity, tap, gut scroll, playfield bounds `[1 h]`
- [ ] **A4 Obstacles & collision** — 15 obstacles once each, alpha-mask collision, `?debug=1` `[1.5 h]`
- [ ] **A5 Endcards** — static layout, GSAP entrances, CTA clickTag, clean replay `[1 h]`
- [ ] **A6 Audio** — Web Audio unlock, gapless loop, per-sound gain, mute, `visibilitychange` `[1 h]`
- [ ] **A7 Polish** — intro animation, "get ready", difficulty ramp, `prefers-reduced-motion` `[0.5–1 h]`
- [ ] **A8 Compression & weight** — audio re-encode, image optimisation, weight check < 3 MB `[0.5 h]`

## Stage B — Variant B, Fireplace (~5–6 h)

- [ ] **B1 Background & asset prep** — decision D on background source, `tRNS` fix, own crops with zoom bleed `[1 h]`
- [ ] **B2 Static parts** — `top`/`left`/`right.html` matching the measured layout, debug overlay `[1.5 h]`
- [ ] **B3 Preview page** — three iframes with 4 px gaps `[0.5 h]`
- [ ] **B4 Intro timelines** — 3–6 s, shared-origin zoom, line-by-line headline, CTA last `[1.5 h]`
- [ ] **B5 Sync** — `postMessage` start plus standalone autostart `[0.5 h]`
- [ ] **B6 Idle & a11y** — calm loop stopping at 30 s, reduced motion, clickout `[0.5 h]`
- [ ] **B7 Compression & performance** — weight per part, only `transform`/`opacity` animated `[0.5 h]`

## Stage F — Final (~2 h)

- [ ] **F1 Brief checklist** — every requirement of both variants checked
- [ ] **F2 Real-device test** — iOS Safari (autoplay, toolbars), Android Chrome
- [ ] **F3 Docs** — README (run, next steps, known issues, AI note) and DECISIONS assembled from `docs/`
- [ ] **F4 Recording** — under 1 minute, stored in the repo
- [ ] **F5 Review** — full code read-through, `/maister:reviews-pragmatic`, fixes
- [ ] **F6 Submit** — reply to the task email with the repo link

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
