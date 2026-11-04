# Stage A — Variant A, Game Ad

**Goal:** a complete, polished "Gut Run" mobile game ad that meets every requirement of the brief and stays under 3 MB.

## A1 Scaffold & scaling
- **Status:** ✅ done
- **Commit:** `feat: scale variant A stage to the visible viewport`
- **Time:** 1 h planned / ~1 h actual
- **What was done:**
  - `variant-a-game/index.html`, `css/style.css`, `js/main.js`.
  - 360×640 logical stage with the static frame layers (`bg.jpg`, `border.png`, `logo.png`) as full-frame DOM images at 50% of their 2x size.
  - `main.js` contain-fits the stage to a `100dvh` root through a `ResizeObserver`. Strips under 1 px are closed by covering.
  - Stage caps fill the spare strips with the measured edge colours.
  - The script fails fast if `#ad` or `#stage` is missing.
- **Decisions:** D-005 (viewport scaling).
- **Deviation from plan:** the plan filled the strips with a background gradient on the root. The first screenshots showed hairlines at the stage edges, so the gradient was replaced by caps that overlap the stage by 1 px ([ai-log #5](../ai-log.md)).
- **Verification:** Playwright MCP browser tools against `npx serve`.

  | Viewport | Scale | Stage (CSS px) | Strips |
  |---|---|---|---|
  | 320×568 | 0.8889 (cover, strip < 1 px) | 320 × 568.9 | −0.44 px top/bottom (crop) |
  | 375×667 | 1.0425 (cover, strip < 1 px) | 375.3 × 667.2 | ~0 |
  | 390×844 | 1.0844 | 390.4 × 694.0 | 75 px top/bottom |
  | 430×932 | 1.1955 | 430.4 × 765.1 | 83.4 px top/bottom |
  | 390×750 (toolbar shown) | 1.0844 | 390.4 × 694.0 | 28.2 px, rescaled live |
  | 844×390 (landscape) | 0.61 | 219.6 × 390.4 | navy sides |

  - Aspect ratio is 0.5625 in every case.
  - The headless browser reports a fractional viewport (DPR 1.0000000149, e.g. 375.2×667.2); the scale follows the measured box.
  - Pixel rows at the stage seams are uniform (white, and `#D89C95`, ±1/255).
  - No console errors and no external requests. The favicon 404 is suppressed with `<link rel="icon" href="data:,">`.
  - Screenshots: [a1-viewports.png](../img/a1-viewports.png).
- **Standards checklist:** all items passed; preload is not applicable yet (see the A1 plan).
- **AI:** ai-log #5.
