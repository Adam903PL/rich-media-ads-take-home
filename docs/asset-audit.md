# Asset audit

Measured on 2026-11-04, before writing any ad code. Tools: `ffprobe`/`ffmpeg` (dimensions, alpha bounding boxes, PSNR, colour sampling, silence detection) and small Node scripts (template matching of sprites against the design PNGs, decoding palette indices).

**Units:** CSS px (= asset px ÷ 2) unless marked **@2x**. Ranges are inclusive start–end.

---

## 1. Weight of the provided files

| Folder | Size | Notes |
|---|---|---|
| `variant-a-game/assets` | 2.02 MB | audio is 1.37 MB of it; 0.81 MB after the A8 re-encode (D-018). PNGs 640 055 → 574 516 B after the lossless A8 recompression (D-019) |
| `variant-a-game/design` | 0.59 MB | reference only, not shipped |
| `variant-b-fireplace/assets` | 3.64 MB | includes both background options; a build ships only one. 1 468 094 B after B1: the four delivered backgrounds (3 406 018 B) are replaced by three crops of `bg-big.jpg` (1 235 592 B, D-020, §3.5) |
| `variant-b-fireplace/design` | 1.77 MB | reference only, not shipped |

Largest single files: `bg-big.jpg` 1.995 MB, `applause.mp3` 602 KB, `top/bg.jpg` 556 KB, `Funny Game Loop.mp3` 463 KB, `right/bg.jpg` 455 KB, `left/bg.jpg` 400 KB, `gameplay.png` 268 KB, `top/hl.png` 195 KB.

---

## 2. Variant A — Game Ad (360×640)

### 2.1 Start screen layers (bottom → top)

| Asset | Content | Position / size |
|---|---|---|
| `bg.jpg` | flat navy `#0A1D49` (design: `#0A1E49`) | full frame |
| `01_game/bg_texture.png` | light bacteria pattern, static (one screen only) | content y 104.5–561 |
| `01_game/gameplay.png` | the gut tube on transparent background | **2528×640**, content y 112–640 |
| `border.png` | top and bottom "cloud" bands | top 168.5–235.5, bottom 566.5–640; rows opaque across the full width: **169–204.5** and **598.5–640** (row 168.5–169 is anti-aliased) |
| *(no asset)* | headline band, flat navy | y 58–168.5 — gut and texture extend under it, so the scrolling scene must be clipped at y 168.5 or covered |
| `01_game/tut.png` | **the headline** "Bringe Poo durch / den Darm ans Ziel." (not a tutorial overlay) | line 1 y 90.5–115 (x 67.5–293), line 2 y 121–141 (x 58.5–301) |
| `logo.png` | white logo bar | y 0–58, opaque; the logo box spans x 126–234.5, y 17–42.5, and the rest of the bar is plain white (the mute toggle sits at x 314–354, y 9.75–49.75) |
| `gesture.png` | hand **and the text "tab to run"** (typo baked in) | 86.5×96 at (147.5, 452) |
| `01_game/player.png` | poo emoji | 42×41 at (55.5, 258.5) — exact pixel match with `01-start.png` |

- **The start-screen design places the gut at x −2, y 0** (−4, 0 @2x), not at the frame origin.
  - Measured in A2 by compositing all layers at 2x with candidate gut offsets and comparing the playfield with `01-start.png`: (0, 0) gives 19.8 dB, (−4, 0) @2x gives 24.9 dB, and every neighbouring offset is lower.
  - Small crops are unreliable here, because flat tube interiors and vertical tube walls match at many positions.
- Gut scroll distance to the end, from that start: 2528 − 360 − 2 = **2166 px**. The image does not tile seamlessly, so a run is finite.

### 2.2 Obstacles (each must appear once per run)

| File | Content | Size |
|---|---|---|
| `bac1` | blue spiky virus | 62.5×59.5 |
| `bac2` | yellow worm, vertical | 21.5×77 |
| `bac3` | yellow worm, horizontal | 79×28 |
| `bac4` | pink segmented worm | 69×34 |
| `bac5` | blue bean bacterium | 53.5×43.5 |
| `bac6` | blue bacterium, diagonal | 50×47.5 |
| `txt1` | Stress | 23×94 |
| `txt2` | Tabu | 34×113 |
| `txt3` | Blut | 23.5×60.5 |
| `txt4` | Chips | 29×84.5 |
| `txt5` | Süßigkeiten | 30×181 |
| `txt6` | Fertiggerichte | 20.5×144.5 |
| `txt7` | Fett | 29.5×81.5 |
| `txt8` | Couch-Potato | 18.5×153 |
| `txt9` | Bauchweh | 25.5×156.5 |

All text obstacles are already rotated (vertical). The concept slide also lists "Bauchgrummeln", which has no asset.

### 2.3 Endcard layers

Most endcard layers are **full-frame 360×640 PNGs with the position baked in**. Animations that scale or rotate them need `transform-origin` at the centre of the bounding box below.

**Fail** (`02_endcard/fail/`)

| Layer | Content | Bounding box (x / y) |
|---|---|---|
| `bubble` | dark cloud | 35–324 / 74–396 |
| `bac1` | yellow worm, vertical | 133.5–155 / 94.5–172.5 |
| `bac2` | small yellow worm | 236.5–279.5 / 207.5–222.5 |
| `bac3` | pink worm | 54–119.5 / 215–246.5 |
| `bac4` | blue spiky bacterium | 69–119.5 / 127–168.5 |
| `bac5` | small blue bacterium | 207–235.5 / 141.5–168.5 |
| `sad` | sad poo | 120.5–239 / 183–299 |
| `hl` | 3 lines | 353–377.5, 386.5–413, 421.5–448 (x 40–344) |
| `cta.png` (cropped) | "Jetzt informieren!" | 186×38.5 at (37, 482.5) |
| `replay.png` (cropped) | "Nochmal spielen" | 185.5×40.5 at (37.5, 538.5) |

**Win** (`02_endcard/win/`)

| Layer | Content | Bounding box (x / y) |
|---|---|---|
| `bubble` | dark cloud | 35–324 / 84–406 |
| `konfetti` | party hat **and** confetti in one layer | 0–258 / 82–372; one piece, the small green party cone at 157–169.5 / 333–353, lies **in front of** the happy poo in the mockup, while the rest of the layer (e.g. the white streamer at the poo's right) lies behind it |
| `happy` | happy poo | 138–221 / 324–405.5; 8.8% of its opaque pixels lie outside `bubble`. Lifting it 12 / 21 / 31.5 px puts it fully inside the bubble with a 0 / 4 / 8 px margin (alpha ≥ 128). The build uses 31.5 px (D-016). |
| `hl` | 3 lines | 433–458.5, 467–492.5, 501.5–523 (x 28.5–323) |
| `cta.png` (cropped) | "Jetzt mehr erfahren" | 214×45.5 at (28, 560) |

**Rebuild check:**
- The graphic layers (bubble, bacteria, poo, confetti) composited back together match `02-fail-endcard.png` and `03-win-endcard.png`.
- The headline PNGs are typeset ~2% wider than the mockups (e.g. fail line 3 ends at x 344 vs ~337.5 in the mockup), so the asset — not the mockup — is the source of truth for copy.
- The button PNGs are typeset differently from the mockup's buttons too: the text spacing and the emoji placement differ, and the edges are 1–2 px @2x apart. At the positions above, `tools/audit/match.mjs` scores a mean abs diff of ≈ 9 (fail CTA 9.17, replay 8.81, win CTA 9.34). The positions are the best match; the assets are kept.
- Measured in A5: all endcard layers composited at 2x at the positions above, compared with the mockup band by band (PSNR):

  | Band | Fail | Win |
  |---|---|---|
  | Graphics (below the logo bar, above the headline) | 53.5 dB | 40.3 dB in the table's order; 50.5 dB with the party cone above the poo (D-015) |
  | Headline | 10.4 dB | 10.3 dB |
  | Buttons | 21.6 dB | 19.8 dB |

  A whole-frame comparison with the mockups is therefore capped at ~18.6 dB, however exact the build is. Builds are checked against a composite of the delivered layers instead.

### 2.4 Design vs assets — open points

- `gesture.png` says "tab to run"; the brief says "tap to run". The typo is baked into the asset.
  - In the mockup the hand matches the asset exactly (diff 0.01).
  - The text is rendered differently: same row, up to 1.5 px off horizontally, diff 19. As with the endcard headlines, the asset is the source of truth.
- The start-screen mockup shows obstacles (bacterium, worm, "Stress", "Tabu"). They do not match any `bac*` sprite 1:1, and "Stress" sits 2 px in front of the player. This reads as illustrative and conflicts with "each obstacle once" plus a "get ready" phase.
- Playfield bounds are not defined: is touching the cloud bands a fail, or only leaving the screen? Decided in A3: the clouds are walls (D-008, §2.4a).
- No assets for: mute toggle icon, "get ready" text, headline band. No fonts are provided (all copy is baked into PNGs).
- Format: the mockup is 9:16, current phones are ~9:19.5 (390×844, 430×932). The scaling strategy must handle the extra height.

### 2.4a Playfield limits at the player's columns

The player's x is fixed at 55.5–97.5 (CSS), so only these columns of the static clouds matter.

| Measurement (alpha ≥ 128) | CSS px |
|---|---|
| Lower edge of the top clouds over the player's columns | 224–234.5 (across the full width: 205–235.5) |
| Upper edge of the bottom clouds over the player's columns | 573.5–585.5 (across the full width: 566.5–598) |
| `player.png` opaque rows | 0–41, the full image height |
| **Player top limits without touching the clouds** (mask vs mask, `tools/audit/cloud-limits.mjs`) | **232.5 … 533.5** (exact), **230 … 535.5** with the game's 2 px tolerance (D-011) |
| Distance from the design start (258.5) | 26 above, 275 below, 301 in total (exact) |

### 2.4b Gut tubes along the track

Measured on the alpha mask of `gameplay.png`:
- The tube forms vertical runs about every 100–120 px, and the whole pattern repeats roughly every 1024 px.
- Full-height runs, i.e. a tube from the top to the bottom clouds, sit at x ≈ 176–224, 720–767, 1200–1247, 1744–1791 and 2240–2271. Between them are partial runs from the top or from the bottom.
- `tools/audit/level-check.mjs` checks every obstacle placement against this mask (box + 2 px fully opaque). The chosen positions are in D-010.

### 2.5 Audio

| File | Duration | Bitrate | Loudness (mean / peak) | Notes |
|---|---|---|---|---|
| `background_music/Funny Game Loop.mp3` | 57.8 s | 64 kbps | −12.1 / 0.0 dB | **72 ms silence at the start, 140 ms at the end** → audible gap with `<audio loop>` |
| `crash/Cartoon Crash Boing.mp3` | 2.1 s | 320 kbps | −16.7 / −0.9 dB | 0.5 s trailing silence |
| `endcard_fail/Fail.mp3` | 4.2 s | 320 kbps | −13.5 / 0.0 dB | 0.8 s trailing silence |
| `endcard_win/Celebrative Happy Woohoo Cheer 2.mp3` | 1.3 s | 320 kbps | −15.7 / −3.4 dB | |
| `endcard_win/applause.mp3` | 15.0 s | 320 kbps | **−23.1** / −4.0 dB | much quieter than the music |

All files are 44.1 kHz stereo.
- The four 320 kbps files are the obvious compression target.
- Levels need per-sound gain.

**Measured in A6** (`ffmpeg` `ebur128` with true peak; envelopes and silence from the decoded PCM):

| File | Integrated | True peak | Audible (above −60 dBFS) | Envelope | Gain in `audio.js` |
|---|---|---|---|---|---|
| music | −11.9 LUFS | +0.4 dBFS | 0.069–57.697 s | steady (LRA 1.0 LU) | −6.1 dB → −18 LUFS |
| crash | −9.2 LUFS | −0.6 dBFS | 0.10–1.74 s | loud until ~1.0 s, −16 dB at 1.0–1.2 s, then decays | −4.8 dB → −14 LUFS |
| fail | −7.7 LUFS | +0.1 dBFS | 0.03–3.73 s | | −6.3 dB → −14 LUFS |
| cheer | −9.7 LUFS | −3.3 dBFS | 0.06–1.07 s | | −4.3 dB → −14 LUFS |
| applause | −18.6 LUFS | −4.0 dBFS | 0.03–14.94 s | | +0.6 dB → −18 LUFS, a bed under the cheer |

After these gains every true peak is at or below −3.4 dBFS.

**Re-encoded in A8 (D-018).** The stereo width (side/mid energy) decided mono or stereo: music −10.6 dB, crash −20.4 dB, fail +1.9 dB, cheer −30.6 dB, applause −14.7 dB. The music is unchanged. Loudness was measured on the new files, decoded to stereo as Web Audio plays them:

| File | Encoding | Size | Integrated | True peak | Gain in `audio.js` |
|---|---|---|---|---|---|
| crash | mono 96 kbps | 85 608 → 26 376 B | −9.2 → −9.6 LUFS | +1.6 dBFS | −4.8 → −4.4 dB |
| fail | stereo 128 kbps | 168 229 → 68 171 B | −7.7 → −8.1 LUFS | −0.1 dBFS | −6.3 → −5.9 dB |
| cheer | mono 96 kbps | 51 200 → 16 031 B | −9.7 → −10.1 LUFS | −0.4 dBFS | −4.3 → −3.9 dB |
| applause | stereo 128 kbps | 601 861 → 241 624 B | −18.6 → −19.0 LUFS | −4.3 dBFS | +0.6 → +1.0 dB |

Durations are unchanged in Chromium's decoder (2.14, 4.21, 1.28 and 15.05 s). After the new gains the highest true peak is the crash at −2.8 dBFS. The mono files also halve their decoded memory.

**The music loop:**
- **Tempo:** the autocorrelation of the onset envelope peaks at 0.4, 0.8 and 1.6 s, i.e. 150 BPM in 1.6 s bars. **57.6 s is exactly 36 bars.** The content above −60 dBFS lasts 57.627 s; the extra 27 ms is the last note's decay.
- **Silence:** the decoded file starts with 1153 zero samples (26 ms, the encoder delay as `ffmpeg` decodes it) and noise below −60 dBFS up to 69.3 ms. It ends with 139 ms below −60 dBFS. Looping the whole file leaves a **208 ms silent gap** (measured in an `OfflineAudioContext` render).
- **Seam:** a hard cut at onset + 57.6 s falls on the decaying note (~0.14, −20 dBFS RMS) and jumps to ~0.001 at the start, a 0.147 step that clicks. The quietest frame within ±2 ms, 0.63 ms earlier, reduces the step to 0.0136, inside the music's normal sample-to-sample range (median 0.008, p99 0.074).
- `audio.js` computes the loop from the decoded buffer (first frame above −60 dBFS, plus 57.6 s, moved to the quietest frame within ±2 ms), so it survives decoders that trim the encoder delay differently and the re-encode in A8. In Chromium: `loopStart` 0.06934 s, `loopEnd` 57.66871 s.

### 2.6 Colours

| Use | Colour |
|---|---|
| Navy | `#0A1E49` |
| Gut tube | `#FDA090` |
| Border strip | `#D89C95` |
| Top edge of `logo.png` (rows 0–1) | `#FFFFFF`, opaque |
| Bottom edge of `border.png` (rows 634–640) | `#D89C95`, opaque — used for the stage's bottom cap |
| Bottom edge of the endcard mockups | `#0A1E49` |

---

## 3. Variant B — Fireplace

### 3.1 Geometry

- `bg-big.jpg` is 3360×1950 @2x = **1680×975 = 320 + 4 + 1032 + 4 + 320**, i.e. the parts sit with **4 px gaps**.
- Positions in the fireplace: left x 0, top x 324, right x 1360, all at y 0.
- Seam check on `bg-big` at those offsets (mean luma of 20 px strips either side of each gap): 103.2 | 103.6 and 72.0 | 69.1 → continuous.
- `layout.png` is **not 1:1**. It is a ≈0.972-scale screenshot with labels; content boxes are left (28, 50) 311×949, top (345, 50) 1003×244, right (1351, 50) 311×949. A debug overlay has to rescale per part.
- **Refined in B2** by matching each part's original `bg.jpg` in the moss areas of `layout.png` (scales 0.966–0.980, offsets ±6 px): the scale is **0.973** for all three, and the parts' backgrounds start at **(28, 50), (343, 50) and (1351, 50)** layout px. This fits the fireplace geometry: (343 − 28) / 0.973 = 323.7 ≈ 324 and (1351 − 28) / 0.973 = 1359.7 ≈ 1360. The 345 above is the frame around the top banner, not its content.
  - So a fireplace point (x, y) sits at (28 + 0.973 x, 50 + 0.973 y) in `layout.png`. The overlay scales the layout by 1 / 0.973 = 1.02775 (1730.73 × 1046.25 px) and shifts it by (−28.78 − part x, −51.39).
  - The integer-size resampling of the match limits this to about ±0.5 layout px.

### 3.2 Skyscraper layers (320×975, left and right)

| Asset | Content | Position |
|---|---|---|
| `left/bg.jpg`, `right/bg.jpg` | moss **with the product packshot baked in** | full frame; replaced in B1 by crops of `bg-big.jpg` (§3.5) |
| `box.png` (shared) | text panel `#0F6CA1` | full width, y 744.5–913.5 |
| `left/hl.png`, `right/hl.png` | copy, white | y 771.5–816 (right: lines 771.5–788 and 794.5–816) |
| `left/logo.png`, `right/logo.png` | logo (identical files, byte for byte) | x 66.5–254, y 60–190 |
| `cta.png` (shared, cropped) | "Jetzt entdecken" | 172.5×46.5 at (73.75, 838.5) — centred |

- **CTA corners (B2):** the transparent pixels in each corner of `cta.png` (after D-021) run 10, 8, 6, 5, 4, 3, 2, 2, 1, 1 per row, identically in all four corners, and fit a circle of radius 13.75 px @2x, i.e. **≈ 7 px** CSS.
- **CTA position re-measured (B2)** with the refined layout scale (§3.1): y 838.5 confirmed in both skyscrapers; the best x is 73.5 (left) and 73 (right), at a mean abs. diff of ≈ 28 per channel, because the button colours differ (P5). The centred 73.75 stays.

### 3.3 Top banner layers (1032×250)

| Asset | Content | Position |
|---|---|---|
| `top/bg.jpg` | moss and rock | full frame; replaced in B1 by a crop of `bg-big.jpg` (§3.5) |
| `top/hl.png` | 3-line headline with soft drop shadow (RGBA) | text cores: 40.5–76 (x 300.5–483), 94–143.5 (x 324.5–686), 161–210.5 (x 299.5–740); the shadow spans the full height |

### 3.4 Problems found

**P1 — Four PNGs lost their transparency.**
`box.png`, `cta.png`, `left/hl.png`, `right/hl.png` are palette PNGs **without a `tRNS` chunk**, so browsers render them fully opaque.

| File | Palette | What it means |
|---|---|---|
| `box.png` | black + `#0F6CA1` | black covers everything outside the panel |
| `left/hl.png`, `right/hl.png` | black + 10 × `#FFFFFF` | indices 1–9 sit on glyph edges (97–100% touch the background) → they were the anti-aliasing alpha levels, now pure white |
| `cta.png` | black + red/white ramps | 168 black corner pixels (≈42 per corner, radius ≈7 px); indices 1–6 are corner anti-aliasing |

**Repaired in B1 (D-021):** a `tRNS` chunk makes index 0 transparent in all four files; the decoded RGB is unchanged. The anti-aliasing levels of the other indices stay lost.

**P2 — Top headline copy differs from the layout.**

| Source | Copy | Hierarchy |
|---|---|---|
| Asset | "STARK BEI / HUSTENREIZ & / HALSSCHMERZEN." | line 1 smallest |
| Layout | "NATÜRLICH STARK / BEI HUSTENREIZ & / HALSSCHMERZEN." | line 1 largest |

**P3 — `bg-big.jpg` and the per-part `bg.jpg` files do not match each other.**

| | per-part `bg.jpg` | `bg-big.jpg` |
|---|---|---|
| Matches `layout.png` (packshot position/size, rock in top) | yes | no — right pack ~12% larger and moved, left pack offset by a few px, top shows a different crop (rock cut at the top edge), small blue sliver on the left pack |
| Seams line up | no — top→right jumps from luma 63 to 87, the rock ends at the top banner's edge | yes |
| Weight | 400 + 556 + 455 KB | 1.995 MB |
| Room for a continuous zoom across parts | no bleed outside each crop | yes |

Mean luma of the whole file: big 84, left 98, top 93, right 105.

How each part relates to `bg-big.jpg`, from template matching of moss and packshot crops:

| Part | Relation | Evidence (mean abs. diff, grey) |
|---|---|---|
| left | the same image, cropped 4 / 12 px @2x off (**2 px right, 6 px down** in CSS) | moss 7.0, packshot 1.3 at scale 1.00 |
| right | a zoomed-out version: in `bg-big` the packshot is **12% larger**, the moss ~16% | packshot 4.1 at scale 1.12, moss 10.1 at 1.16 |
| top | **not cut from `bg-big.jpg`** — no match at scales 1.0–1.45, mirrored or not | ≥ 41 everywhere (noise level) |

**Resolved in B1 (D-020):** every part uses its own crop of `bg-big.jpg` (§3.5); the packshot deviation from the layout is still open with the client (Q3).

**P4 — Packshots are baked into the backgrounds.**
There is no separate product layer, so "product slides in" cannot be done with the provided assets.

**P5 — Colour differences.**
- CTA: `#B80000` in the asset vs ≈`#A82217` in the layout.
- Text panel: in the layout it is ≈90% opaque (the moss texture shows through) and redder than `#0F6CA1`.
- The logo teal `#146E78` matches exactly, so this is not a colour-management artefact.

### 3.5 Background crops (B1, D-020)

Measured on 2026-11-06. Coordinates are fireplace CSS px (1680×975) unless marked @2x.

**Room for the shared zoom.** Each background scales around O = (840, 487.5), the centre of `bg-big.jpg`, with a scale s in [1, 1.10]. At scale s, a part's rectangle shows the source rectangle O + (rect − O) / s, so a part only needs extra moss on the side facing O:

| Part | Rectangle | Source reach at s = 1.10 | Crop | Margin left over |
|---|---|---|---|---|
| left | x 0–320, y 0–975 | x 76.4–367.3, y 44.3–930.7 | x 0–368, y 0–975 | 0.73 px on the right |
| top | x 324–1356, y 0–250 | x 370.9–1309.1, y 44.3–271.6 | x 320–1360, y 0–272 | 0.41 px at the bottom |
| right | x 1360–1680, y 0–975 | x 1312.7–1603.6, y 44.3–930.7 | x 1312–1680, y 0–975 | 0.73 px on the left |

**Crops.** Edges on the 16 px @2x grid of the source's 4:2:0 chroma blocks:

| File | Source @2x | Size | Position in the part | PSNR vs `bg-big.jpg` (Y / U / V, average) |
|---|---|---|---|---|
| `left/bg-crop.jpg` | x 0, y 0, 736×1950 | 411 728 B | (0, 0) | 48.8 / 50.4 / 51.4, 49.4 dB |
| `top/bg-crop.jpg` | x 640, y 0, 2080×544 | 432 880 B | (−4, 0) | 48.2 / 48.0 / 49.9, 48.4 dB |
| `right/bg-crop.jpg` | x 2624, y 0, 736×1950 | 390 984 B | (−48, 0) | 49.2 / 50.3 / 51.3, 49.7 dB |

- Source: the original `bg-big.jpg` (3360×1950, 4:2:0, quality ≈ 86 from its luma quantisation table), in git history at `085fb62`.
- Off the grid, at x 648 @2x, the top crop scores 41.5 / 43.4 dB in the chroma planes and weighs 478 470 B.
- **Seams after cropping** (mean luma of the 20 px strips either side of each gap, y 0–250): 103.2 | 103.6 and 72.1 | 69.2, against 103.2 | 103.6 and 72.0 | 69.1 in `bg-big.jpg` (§3.1).
