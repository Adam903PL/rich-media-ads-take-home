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

## F3 Docs
- **Status:** ✅ done
- **Commits:** `docs: sync the task brief with upstream 2e8cc9a`, `docs: add an at-a-glance summary to the decision log`, `docs: complete the README for submission`
- **Time:** ~0.75 h
- **What was done:**
  - **[README.md](../../README.md)**, assembled from `docs/`:
    - status line;
    - run instructions (one command) and dev flags;
    - a compression table per variant with before / after bytes;
    - how the build was checked, including what real devices still have to show (F2);
    - known issues and shortcuts: the open client questions, every deviation from the [checklist](../brief-checklist.md#deviations), and the limitations;
    - next steps with more time;
    - the AI note, with ai-log #16 as its example.

    It also says that Variant B is fixed-size by design.
  - **[DECISIONS.md](../../DECISIONS.md#at-a-glance):** an at-a-glance summary on top that answers the brief's example questions (scaling, canvas vs DOM, collision, background, audio, compression) in one bullet each and points to the entries.
  - **[task-brief.md](../task-brief.md):** follows `2e8cc9a`. Below its header it matches the upstream file byte for byte (`diff` against the raw file from GitHub); only the two known sentences changed.
  - **[brief-checklist.md](../brief-checklist.md):** G6, D2, D3 and D4 are met, and the F3 gaps are closed.
- **Result:** 40 rows: 30 met (5 of them with a follow-up in F2), 8 met with a deliberate deviation, 2 open (F4 recording, F6 public repository). Counted with a script.
- **Verification:**

  | Check | Result |
  |---|---|
  | Weights quoted in the README | ✅ re-measured: A 1 509 240 B (folder without `design/`); B 1 726 322 / 1 553 059 B (`weight.mjs`) |
  | Every fact in the README and the summary | ✅ checked against its source (DECISIONS, stage logs, questions, AI log) |
  | Links and anchors in the changed files | ✅ all resolve (script) |
  | Line endings | ✅ LF only |
- **AI:** ai-log #29.

## F5 Review
- **Status:** ✅ done
- **Commits:** `refactor: tidy variant A exports, lookups and debug flags`, `refactor: drop the unused part field from the fireplace ready message`
- **Time:** ~1 h
- **What was done:**
  - **Read-through** of the shipped code of both variants (HTML, CSS, `js/`, without `vendor/` and `design/`), checked for logic errors against D-005–D-029. None found: the run state machine, collision, audio unlock and loop, endcard hold and replay teardown, the shared start, the idle timing and the clickout do what their decisions describe.
  - **`/maister:reviews-pragmatic`:** complexity low for the scope (A 662, B 195 lines of code; one runtime dependency; no classes, factories or config). No over-engineering. 0 critical, 0 high, 1 medium, 14 low findings.
  - **Fixed:**
    - Variant A: `findLoop()` and `PLAYER_START_TOP` are no longer exported (nothing imported them). `main.js` uses `find()` from `dom.js` like the other modules. `debug.js` loads only for `?debug=1` / `?overlay=1`; before, any value such as `?debug=0` loaded it unused.
    - Variant B: the `ready` message no longer carries the part name, which nothing read and D-026 says it does not carry; `waitForStart()` lost its parameter. `settleBack` is `SETTLE_BACK` like the other constants, and a comment says why the idle phase starts at the same moment in every part.
  - **Not changed, with reasons:**
    - The medium finding (Space on the focused mute toggle flipping mute in Firefox) was reasoned, not tested; a Playwright script in Firefox 150 and Chromium 148 showed it does not happen (ai-log #30).
    - The `stopping` flag in `audio.js` stays: no current flow reaches it, but it is three lines that keep a sound from being faded and stopped twice, and removing it would mean re-checking the replay audio on real phones for no gain.
    - The endcard `addBeats` callback, the declaration order in `intro.js`, the repeated stage constants in `debug.js`, the two `setupIntro` shapes and the 13-line `clickout.js` are style points; changing them now would only churn reviewed code.
    - Variant B's design-overlay CSS ships in `style.css` (19 lines); moving it into `debug.js` and a `serve.json` with `cleanUrls: false` (so `?overlay=1` survives on `*.html` URLs) are next steps.
- **Findings:** Firefox logs "Layout was forced before the page was fully loaded" once per part inside the preview. It is the same on the code before F5, the parts' stylesheet is loaded before their module runs, so no unstyled frame shows; left as is.
- **Verification** (Playwright, Chromium 148 and Firefox 150, against `npx serve` of the changed tree):

  | Check | Result |
  |---|---|
  | `level-check.mjs`, `cloud-limits.mjs --tolerance=2` | ✅ all D-010 rules pass; limits 230..535.5 as in `game.js` |
  | A: start, 15 unique obstacles, mute before the first run, first tap → `playing` | ✅ both browsers |
  | A: hidden page while playing | ✅ the track's transform holds |
  | A: fail endcard, CTA with `window.open` stubbed | ✅ `https://example.com/landing`, `_blank` |
  | A: replay ×2 | ✅ back to `start` with the endcard hidden; tap → fail 1 052 / 1 040 ms (Chromium), 1 060 / 1 060 ms (Firefox) |
  | A: `?debug=1`, `?overlay=1`, `?debug=0` | ✅ `debug.js` loaded, loaded, not loaded |
  | B preview: shared start | ✅ three timelines of 25.5 s, start moments within 2.4 ms (Chromium) and 3.0 ms (Firefox) |
  | B: clickout in each part, standalone `left` starts at once, reduced motion at the end state, part `?overlay=1` | ✅ both browsers |
  | Console and network | ✅ no messages except the Firefox warning above; only local requests |
  | Weight | ✅ A 1 509 115 B (−125 B); B 1 726 568 B as three packages (+82 B in each package, mostly the new comment), 1 553 141 B once; still 1.44 / 1.65 / 1.48 MB. README and checklist updated; D-019 and D-029 keep the numbers measured when they were decided |
- **AI:** ai-log #30.
