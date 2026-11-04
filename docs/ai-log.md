# AI log

How AI tools were used, and every case where their output was wrong and had to be corrected. The README's AI note is picked from this list at the end.

**Tools:**
- Claude Code (Opus) for asset analysis, planning, code and docs.
- The Maister plugin, in a reduced setup: project docs and standards, `quick-plan` / `quick-dev`.

| # | Date | Stage | What the AI did | What was wrong | How it was caught / fixed |
|---|---|---|---|---|---|
| 1 | 2026-11-04 | Asset audit | Took the brief's statement that the per-part `bg.jpg` files are "pre-cut versions" of `bg-big.jpg` at face value and planned to crop at fixed offsets. | They are different composites: different packshot placement, different crop of the top and different brightness. The first automated match also returned meaningless offsets. | Side-by-side crops and comparisons against `layout.png` → documented as P3 in the asset audit; the background choice became an explicit decision and question Q3. |
| 2 | 2026-11-04 | Asset audit | Composited the left skyscraper with the CTA at a guessed position (y 1592 @2x). | The CTA overlapped the copy. | Template-matched `cta.png` against the layout rescaled to 2x → measured y 1677 @2x (838.5 CSS). Positions are now only taken from measurements. |
| 3 | 2026-11-04 | Recruiter questions | Concluded from whole-image matching that all per-part backgrounds are "different composites" from `bg-big.jpg`. | Overstated: the left part is the same image cropped 2 × 6 px off. Whole-image matching could not find it because both files are 1950 px tall, which left no room for a vertical offset. | Re-measured with small moss and packshot crops at several scales → exact relation per part in asset-audit P3. The email states measured numbers instead of the general claim. |
| 4 | 2026-11-04 | Recruiter questions | Checked for CRLF line endings with `grep -rl $'\r'` and reported "no CRLF". | The check was unreliable in this shell in both directions: it missed real CRs in a working copy, then flagged clean files. | Replaced with a byte count (`tr -cd '\r' < file \| wc -c`); all committed files are LF. |
