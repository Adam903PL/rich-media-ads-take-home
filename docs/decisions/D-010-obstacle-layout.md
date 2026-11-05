# D-010 Obstacle layout (Variant A)

**Date / stage:** 2026-11-05 · A4 · **Status:** accepted

## Context
- The brief asks for 15 obstacles (`bac1–6`, `txt1–9`), each exactly once per run.
- The run is ~15 s long, so the obstacles share about 1820 px of track, leaving roughly 0.4 s per height change.
- One jump is 55 px in 0.26 s; falling is fast (up to 650 px/s).
- An early hand-drawn draft turned out impassable in places. One example: after passing *under* "Couch-Potato" the player would have had to climb ~100 px *over* "Bauchweh" within 0.27 s.

## Options
1. **Fixed, designed layout**
   - Pros: tested once, identical every run, easy to document.
   - Cons: no variety.
2. **Shuffled every run**
   - Pros: variety.
   - Cons: every shuffle would have to be proven passable.

## Decision
**Option 1, a fixed layout in `variant-a-game/js/level.js`, on the gut's tubes** (the user's choices). It is validated by `tools/audit/level-check.mjs` against these rules:
- **Identity:** the 15 ids, each exactly once.
- **On a tube:** every obstacle box plus 2 px lies fully on an opaque tube pixel of `gameplay.png` (2x grid). White words then sit on pink, as in the mockup.
- **Placement:**
  - inside the flight band (y 226–582),
  - nothing visible on the start screen (D-007),
  - the last obstacle passes the player before the gut ends.
- **Room beside each obstacle:** a corridor must fit one jump arc plus 10 px (≈ 65 px), because the player bobs by an arc while tapping to hold its height.
- **Reachability:** from the start glide on, the range of reachable heights is propagated obstacle by obstacle. Climbing is limited to ~200 px/s (about five taps a second); falling uses the game's gravity and fall cap. A backward pass marks which sides still lead to the finish.

Final layout (CSS px, track coordinates; *window* = free time since the previous obstacle):

| # | Obstacle | x | y | Size | Window | Side on the winning path |
|---|---|---|---|---|---|---|
| 1 | txt3 Blut | 410 | 430 | 23.5×60.5 | 1.54 s | above |
| 2 | bac5 | 524 | 348 | 53.5×43.5 | 0.33 s | above or below |
| 3 | txt7 Fett | 720 | 490 | 29.5×81.5 | 0.69 s | above |
| 4 | bac1 | 850 | 240 | 62.5×59.5 | 0.40 s | below |
| 5 | txt4 Chips | 1000 | 428 | 29×84.5 | 0.31 s | above |
| 6 | bac3 | 1110 | 300 | 79×28 | 0.27 s | below |
| 7 | txt1 Stress | 1230 | 480 | 23×94 | −0.01 s | above |
| 8 | bac6 | 1320 | 248 | 50×47.5 | 0.17 s | below |
| 9 | txt2 Tabu | 1420 | 418 | 34×113 | 0.06 s | above — with bac6, a gate (y 295–418) |
| 10 | bac2 | 1530 | 230 | 21.5×77 | 0.23 s | below |
| 11 | txt6 Fertiggerichte | 1640 | 428 | 20.5×144.5 | 0.32 s | above |
| 12 | bac4 | 1750 | 345.5 | 69×34 | 0.33 s | **below** (above is a dead end because of #13) |
| 13 | txt8 Couch-Potato | 1850 | 250 | 18.5×153 | −0.08 s | below |
| 14 | txt9 Bauchweh | 1939.5 | 247.5 | 25.5×156.5 | 0.20 s | below |
| 15 | txt5 Süßigkeiten | 2125 | 236 | 30×181 | 0.81 s | below |

- **Rhythm:**
  - The run opens with small obstacles and long windows.
  - In the middle the player weaves above and below.
  - Two gates (#8/#9 and #12/#13) ask the player to read two obstacles at once.
  - The finale is three tall words hanging from the ceiling.
- **Difficulty:** it rises through obstacle size and density, not speed. A speed ramp, if any, comes in A7 and must keep the checker green.

## Consequences
- Passability is proven twice:
  - by the checker, with conservative human limits,
  - by a planning bot in the browser that taps at most every 150 ms. It won two runs out of two, passing all 15 obstacles, with 31 taps in ~15 s.
- A layout change means rerunning `node tools/audit/level-check.mjs` and the bot.
