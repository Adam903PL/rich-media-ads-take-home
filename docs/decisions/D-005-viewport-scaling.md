# D-005 Viewport scaling for Variant A

**Date / stage:** 2026-11-04 · A1 · **Status:** accepted

## Context
- The design is 360×640 CSS px (9:16). The brief targets phones from 320×568 up to 430×932, and current phones are ~9:19.5.
- The ad must fill the visible viewport without distortion, must not cut off anything important, and has to cope with mobile browser toolbars that change the visible height.

## Options
1. **Contain, centred, strips filled with the stage's edge colours**
   - Pros: the whole design is always visible and gameplay is identical on every device; simple.
   - Cons: tall phones get flat strips, ~75–84 px of white above the logo bar and the same height of floor pink below the clouds.
2. **Contain, anchored to the top**
   - Pros: the logo bar sits flush with the top.
   - Cons: all spare height collects at the bottom, a 151–168 px flat pink "floor".
3. **Width-fit with a taller playfield**
   - Pros: the extra height is filled with real content.
   - Cons: difficulty changes per device, and the gut and texture layers (fixed 640 px tall) would need repositioning, so the screen no longer matches the design 1:1.
4. **Cover**
   - Pros: no strips.
   - Cons: crops ~42–47 px off each side on 390–430 px wide phones, cutting into the headline and the CTAs.

## Decision
**Option 1.**
- `scale = min(W / 360, H / 640)`, where W×H is the real size of a `100dvh` root. A `ResizeObserver` rescales whenever toolbars change the visible height.
- Two caps (`::before` and `::after` on the stage) continue the measured edge colours into the strips: white `#FFFFFF` above (logo bar) and `#D89C95` below (border).
- The caps overlap the stage by 1 px, so the anti-aliased stage edge never shows the navy background as a hairline.
- When a strip would be under 1 px (e.g. 0.5 px total at 320×568), the stage covers instead. That crops less than 1 px per edge and avoids a hairline beside the white logo bar.

## Consequences
- Gameplay always runs in 360×640 logical px, so difficulty does not depend on the device.
- Endcards will need a navy bottom cap, switched in A5.
- Landscape is out of scope (the brief says portrait). It shows the portrait stage centred, with navy sides.
- At up to ×1.19 (430×932), the 2x assets are slightly below native resolution on 3x screens. This cannot be avoided with the provided exports.
