# Stage F — Final

**Goal:** both ads checked against every line of the brief, tested on real devices, documented for the reviewer, recorded and submitted by 2026-11-08 ~17:50 CET.

## F1 Brief checklist
- **Status:** ✅ done
- **Commit:** `docs: add the brief checklist`
- **Time:** ~0.5 h
- **What was done:**
  - [brief-checklist.md](../brief-checklist.md) has one row per requirement of the brief (ground rules, both variants with format, required behaviour and nice-to-haves, deliverables). Each row gives its status, the files and its evidence (decision, stage verification or today's smoke test).
  - The deviations are collected with their reasons, and the open items are assigned to F2–F6.
  - The upstream brief (`2e8cc9a`, 2026-11-05) only reworded two sentences, so no requirement changed.
- **Result:** 40 rows: 27 met (6 of them with a follow-up in F2 or F3), 8 met with a deliberate deviation, 5 open, all assigned to F2–F6. No code change was needed.
- **Smoke test** (Playwright MCP against `npx serve`):

  | Check | Result |
  |---|---|
  | A unchanged since its verification | ✅ `git diff bb376cc -- variant-a-game` is empty |
  | A at 390×844: start screen | ✅ `start`, 15 obstacles with 15 unique sources |
  | A: mute before the first run | ✅ `aria-pressed` true, the game stays on `start` |
  | A: first tap | ✅ `ready`, then `playing` |
  | A: hidden page while playing | ✅ the track's transform does not change |
  | A: no taps | ✅ `fail` and the fail endcard |
  | A: CTA with `window.open` stubbed | ✅ `https://example.com/landing` with `_blank`; a `clickTag` set later is used on the next click |
  | A: replay ×2 | ✅ back to `start` with the endcards hidden; 1 active tween, the tutorial hand loop (A7); tap → fail 1 044 / 1 046 ms, so no doubled speed |
  | B preview | ✅ the three timelines at 409–410 ms, 25.5 s long; a click on each part opens the fallback URL, the empty middle opens nothing |
  | B reduced motion | ✅ all three at the end state at once |
  | Console and network, A and B | ✅ no messages; only local files |
  | Weight | ✅ A 1 509 240 B (1.44 MB); B 1 726 322 B (1.65 MB) as three packages, 1 553 059 B counted once |

- **Open, by step:**
  - **F2:** real iOS Safari and Android Chrome for A (toolbars, audio unlock, collision feel); a real laptop for B (intro and idle feel, the bottom-edge row seen headless in B3, the moss after the scale animation in B4).
  - **F3:**
    - README: next steps, known issues from the deviations, AI note, compression summary, final run instructions and status;
    - a short summary on top of `DECISIONS.md`;
    - `docs/task-brief.md` following `2e8cc9a`;
    - a sentence that Variant B is fixed-size by design.
  - **F4:** recording under 1 minute.
  - **F5:** read-through and pragmatic review.
  - **F6:** public repository and the reply with the link.
- **AI:** ai-log #28.
