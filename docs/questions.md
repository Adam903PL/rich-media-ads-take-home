# Questions for the recruiter

Every question has a **default**: what gets built if no answer arrives. That way no question blocks the work. Evidence for each point is in [asset-audit.md](asset-audit.md).

| # | Topic | Default if unanswered | Blocks | Status |
|---|---|---|---|---|
| Q1 | Top banner headline: asset copy ≠ layout copy | use `top/hl.png` as delivered | B2, B4 | open |
| Q2 | Four PNGs exported without transparency | restore transparency of palette index 0 (lossless `tRNS` fix), clip CTA corners | B1 | open |
| Q3 | `bg-big.jpg` vs per-part `bg.jpg`; separate packshots? | cut our own three crops from `bg-big.jpg` with zoom bleed; animate background, panel, copy, logo and CTA instead of the product | B1, B4 | open |
| Q4 | Do the cloud bands count as walls? | only leaving the screen top/bottom ends the run; clouds are decoration | A3 | open |
| Q5 | Obstacles shown on the start-screen mockup | start screen shows player + tutorial only; obstacles enter after "get ready" | A2, A4 | open |
| Q6 | "tab to run" typo in `gesture.png` | keep the asset as delivered | A2 | open |

## Answers log

_No answers yet._ Record date, answer and resulting change here. Mark the row above `answered` and link the decision it affected.

## Email draft (reply to the task email)

> **Subject:** Re: Take-home task SF-FE-01-BAM — a few questions
>
> Hi,
>
> thanks for the task — I've started and have a few questions about the assets. For each one I've noted what I'll do if I don't hear back, so nothing is blocked.
>
> **Variant B (Fireplace)**
> 1. **Top banner headline.** `top/hl.png` reads "STARK BEI / HUSTENREIZ & / HALSSCHMERZEN.", but `layout.png` shows "NATÜRLICH STARK / BEI HUSTENREIZ & / HALSSCHMERZEN." with a different line hierarchy. Which copy is current? *Default: the asset as delivered.*
> 2. **Missing transparency.** `box.png`, `cta.png`, `left/hl.png` and `right/hl.png` are palette PNGs without a transparency chunk, so they render with a solid black background and the text has lost its anti-aliasing. Could you re-export them with alpha? *Default: I restore transparency for the background colour losslessly and clip the CTA corners; text edges stay slightly harder than intended.*
> 3. **Backgrounds.** The per-part `bg.jpg` files match the layout but don't line up at the seams. `bg-big.jpg` lines up perfectly (with 4 px gaps between the parts), but the packshots in it are placed and sized differently from the layout (right pack ~12% larger). Which one is the reference for the product position? Are the packshots available as separate layers? *Default: three crops cut from `bg-big.jpg`, so the moss is continuous; the product stays in the background and I animate the other layers.*
>
> **Variant A (Game)**
> 4. **Playfield.** Should touching the cloud bands at the top and bottom end the run, or only leaving the screen? *Default: only leaving the screen.*
> 5. **Start screen.** The mockup shows obstacles on the start screen. Are they meant to be visible before the first tap? *Default: start screen without obstacles; they arrive after a short "get ready".*
> 6. **Copy.** `gesture.png` says "tab to run" — keep it, or is there a corrected export? *Default: keep it.*
>
> Best regards,
> Adam
