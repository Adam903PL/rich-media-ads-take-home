# Questions for the recruiter

Only questions that the client alone can answer go to the recruiter. Each one has a **default**: what gets built if no answer arrives, so no question blocks the work. Points the brief already settles are decided by us and listed separately. Evidence is in [asset-audit.md](asset-audit.md).

**Email status:** final text approved (2026-11-04), to be sent by Adam as a reply in the task email thread.

## Asked

| # | Topic | Why only the client can answer | Default if unanswered | Blocks | Status |
|---|---|---|---|---|---|
| Q1 | Top banner headline: `top/hl.png` copy ≠ `layout.png` copy (audit P2) | Ad copy is the client's call; in health advertising wording such as "natürlich" can be changed on purpose. The asset cannot be edited. | use `top/hl.png` as delivered | B2, B4 | open |
| Q2 | Four palette PNGs without transparency data (`tRNS`), plus the text panel's opacity (audit P1, P5) | The black background can be removed losslessly, but the lost anti-aliasing can only come from the original exports. The layout shows the panel ~90% opaque, while `box.png` is flat — probably lost with the same `tRNS` chunk. | lossless `tRNS` fix for index 0, CTA corners clipped, panel at the layout's ~90% opacity (opacity only, the asset colour is kept); copy edges slightly harder than in the layout | B1, B2 | open |
| Q3 | Background: we choose `bg-big.jpg`. Is the packshot deviation from the layout acceptable? Are packshots available as layers? (audit P3, P4) | The brief asks us to decide (done), but accepting a product shown differently from the approved layout is the client's decision. | `bg-big.jpg` cut into three parts; background animated as a whole; intro focuses on logo, panel, copy and CTA | B1, B4 | open |

## Notes sent (no reply needed)

| # | Note | What we do |
|---|---|---|
| N1 | `gesture.png` says "tab to run", the brief says "tap to run" | keep the asset as delivered (the brief forbids editing assets) |
| N2 | No mute icon among the assets, but the brief requires a mute toggle | add a small SVG icon in the campaign colours — **done in A6**: inline SVG in the campaign navy on the logo bar (D-014) |

## Decided without asking

These were dropped from the email because the brief already answers them, or because they are our own design decisions.

| Former # | Topic | Why we don't ask | Decision | Where |
|---|---|---|---|---|
| Q4 | Are the cloud bands walls? | Game rules are our design | clouds are walls, exact limits from alpha masks — **decided, D-008** | A3 ✅ |
| Q5 | Obstacles on the start screen | The brief lists the start screen contents (logo bar, headline, tutorial); obstacles are not on that list | start screen without obstacles; they arrive after "get ready" — **decided, D-007** | A2 ✅, A7 |
| Q7 | Landscape orientation | The brief says "portrait mobile" and lists only portrait viewports | portrait layout, letterboxed with navy sides in landscape | A1 |
| — | "Get ready" moment without an asset | Nice-to-have; no new copy needed | short pause with the animated tutorial hand | A7 |
| — | Endcard headline and button PNGs are typeset differently from the mockups (same copy; audit §2.3) | The brief says to use the provided assets and not to redraw them, and the wording is identical | build with the assets as delivered, at the best-matching measured positions | A5 ✅ |

## Answers log

_No answers yet._ When an answer arrives, record the date, the answer and the resulting change here, then mark the row above `answered` and link the decision it affected.

## Email (final, reply in the task email thread)

```
Hi,

Thanks for the task, I've already started on it. Before building anything, I measured all the assets against the design files, and in a few places they don't match. Most of that I can resolve myself, but three points depend on decisions on your side, so I'd rather ask than guess. For each one I've noted what I'll do if I don't hear back, so I'm not blocked.

1. Top banner headline
top/hl.png says "STARK BEI / HUSTENREIZ & / HALSSCHMERZEN.", while layout.png says "NATÜRLICH STARK / BEI HUSTENREIZ & / HALSSCHMERZEN." with a different line hierarchy. Ad copy isn't mine to choose, and in health advertising a word like "natürlich" is sometimes removed on purpose, so I don't want to guess. Which version is current?
If I don't hear back, I'll use the asset as delivered.

2. Four PNGs without transparency
box.png, cta.png, left/hl.png and right/hl.png were saved without their transparency data. In the browser they sit on a solid black background, and the copy is pure white on black, with no anti-aliasing. I can remove the black background without any loss, but I can't restore the smooth edges from these files. Do you have the original exports? Also, the text panel in layout.png is slightly translucent (about 90% opaque), while box.png is a flat opaque colour, probably for the same reason. Is that opacity intended?
If I don't hear back, I'll remove the background myself, clip the CTA corners and set the panel to the layout's opacity. The copy will look slightly harder-edged than in the design.

3. Fireplace background
The brief leaves this choice to me, and I'm going with bg-big.jpg, because it's the only version where the moss continues across all three parts. The per-part bg.jpg files match the layout, but their seams don't line up. The catch is that bg-big.jpg differs from the layout: the right packshot is about 12% larger, the left one sits 2 CSS px further right and 6 CSS px lower, and the top banner shows a different section of the moss. Is that acceptable?
The packshots are also baked into the background. If you have them as separate layers, I could animate the product sliding in, as the brief suggests. Otherwise, I'll animate the background as a whole and focus the intro on the logo, panel, copy and CTA.

Two small notes, no reply needed:
- gesture.png says "tab to run" rather than "tap to run". I'll keep the asset as delivered, since the brief asks me not to edit the assets, but wanted to flag it.
- There's no mute icon among the assets, so I'll add a small SVG one in the campaign colours.

Thanks,
Adam
```
