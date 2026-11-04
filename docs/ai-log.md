# AI log

How AI tools were used, and every case where their output was wrong and had to be corrected. The README's AI note is picked from this list at the end.

**Tools:**
- Claude Code (Opus) for asset analysis, planning, code and docs.
- The Maister plugin, in a reduced setup: project docs and standards, `quick-plan` / `quick-dev`.

| # | Date | Stage | What the AI did | What was wrong | How it was caught / fixed |
|---|---|---|---|---|---|
| 1 | 2026-11-04 | Asset audit | Took the brief's statement that the per-part `bg.jpg` files are "pre-cut versions" of `bg-big.jpg` at face value and planned to crop at fixed offsets. | They are different composites: different packshot placement, different crop of the top and different brightness. The first automated match also returned meaningless offsets. | Side-by-side crops and comparisons against `layout.png` → documented as P3 in the asset audit; the background choice became an explicit decision and question Q3. |
| 2 | 2026-11-04 | Asset audit | Composited the left skyscraper with the CTA at a guessed position (y 1592 @2x). | The CTA overlapped the copy. | Template-matched `cta.png` against the layout rescaled to 2x → measured y 1677 @2x (838.5 CSS). Positions are now only taken from measurements. |
