# Questions for the recruiter

Only questions that the client alone can answer go to the recruiter. Each one has a **default**: what gets built if no answer arrives, so no question blocks the work. Points the brief already settles are decided by us and listed separately. Evidence is in [asset-audit.md](asset-audit.md).

**Email status:** draft ready, not sent yet.

## Asked

| # | Topic | Why only the client can answer | Default if unanswered | Blocks | Status |
|---|---|---|---|---|---|
| Q1 | Top banner headline: `top/hl.png` copy ≠ `layout.png` copy | Ad copy is the client's call; in health advertising wording such as "natürlich" can be changed on purpose. The asset cannot be edited. | use `top/hl.png` as delivered | B2, B4 | open |
| Q2 | Four palette PNGs without transparency (`tRNS`) | The black background can be removed losslessly, but the lost anti-aliasing can only come from the original exports. | lossless `tRNS` fix for index 0, CTA corners clipped; copy edges slightly harder than in the layout | B1 | open |
| Q3 | Background: we choose `bg-big.jpg`. Is the packshot deviation from the layout acceptable? Are packshots available as layers? | The brief asks us to decide (done), but accepting a product shown differently from the approved layout is the client's decision. | `bg-big.jpg` cut into three parts; product stays in the background, other layers are animated | B1, B4 | open |

## Notes sent (no reply needed)

| # | Note | What we do |
|---|---|---|
| N1 | `gesture.png` says "tab to run", the brief says "tap to run" | keep the asset as delivered |
| N2 | No mute icon among the assets, but the brief requires a mute toggle | add a small SVG icon in the campaign colours |

## Decided without asking

These were dropped from the email because the brief already answers them, or because they are our own design decisions.

| Former # | Topic | Why we don't ask | Decision | Where |
|---|---|---|---|---|
| Q4 | Are the cloud bands walls? | Game rules are our design | decided and recorded at A3 | A3 |
| Q5 | Obstacles on the start screen | The brief lists the start screen contents (logo bar, headline, tutorial); obstacles are not on that list | start screen without obstacles; they arrive after "get ready" | A2, A7 |
| Q7 | Landscape orientation | The brief says "portrait mobile" and lists only portrait viewports | portrait layout, letterboxed with navy sides in landscape | A1 |
| — | "Get ready" moment without an asset | Nice-to-have; no new copy needed | short pause with the animated tutorial hand | A7 |

## Answers log

_No answers yet._ When an answer arrives, record the date, the answer and the resulting change here, then mark the row above `answered` and link the decision it affected.

## Email (reply in the task email thread)

> Hi,
>
> Thanks for the task, I've started on it. Before building anything I measured all the assets against the design files, and in a few places they don't agree. Most of that I can resolve myself, but three points depend on decisions on your side, so I'd rather ask than guess. For each one I've noted what I'll do if I don't hear back, so nothing is on hold.
>
> **1. Top banner headline**
> `top/hl.png` says "STARK BEI / HUSTENREIZ & / HALSSCHMERZEN.", while `layout.png` says "NATÜRLICH STARK / BEI HUSTENREIZ & / HALSSCHMERZEN." with a different line hierarchy. Ad copy isn't mine to choose, and in health advertising a word like "natürlich" is sometimes removed on purpose, so I don't want to guess. Which version is current?
> If I don't hear back, I'll use the asset as delivered.
>
> **2. Four PNGs without transparency**
> `box.png`, `cta.png`, `left/hl.png` and `right/hl.png` were saved without their transparency data. In the browser they sit on a solid black background, and the copy has lost its smooth edges. I can remove the black background without any loss, but I can't restore the smooth edges from these files. Do you have the original exports?
> If I don't hear back, I'll fix the background myself and clip the CTA corners. The copy will look slightly harder-edged than in the layout.
>
> **3. Fireplace background**
> The brief leaves this choice to me, and I'm going with `bg-big.jpg`, because it's the only version where the moss continues across all three parts. The per-part `bg.jpg` files match the layout, but their seams don't line up. The catch is that `bg-big.jpg` differs from the layout: the right packshot is about 12% larger, the left one sits 2 px further right and 6 px lower, and the top banner shows a different section of the moss. Is that acceptable?
> The packshots are also baked into the background. If you have them as separate layers, I could animate the product sliding in, as the brief suggests.
>
> Two small notes, no reply needed:
> - `gesture.png` says "tab to run" rather than "tap to run". I'll keep the asset as it is.
> - There's no mute icon among the assets, so I'll add a small SVG one in the campaign colours.
>
> Thanks,
> Adam
