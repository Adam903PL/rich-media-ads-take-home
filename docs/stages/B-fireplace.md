# Stage B — Variant B, Fireplace

**Goal:** a three-part desktop fireplace (`top`, `left`, `right` plus a preview page) on one continuous moss surface, with a coordinated intro, a calm idle that stops within 30 s, clickout on every part, and all three parts together under 3 MB.

## B1 Background & asset prep
- **Status:** ✅ done
- **Commits:** `chore: replace variant B backgrounds with crops of bg-big.jpg`, `chore: restore transparency in variant B palette PNGs`
- **Time:** 1 h planned / ~1 h actual
- **Starting point:** no answer from the client to Q1–Q3 (checked 2026-11-06), so the defaults are built.
- **What was done:**
  - **Background source (D-020):**
    - each part gets its own crop of `bg-big.jpg`, the only source whose seams line up;
    - the crops carry extra moss on the side facing the fireplace centre, so all three backgrounds can zoom around one point, (840, 487.5), up to scale 1.10 (audit §3.5);
    - crop edges sit on the 16 px @2x grid of the source's chroma blocks, re-encoded with `ffmpeg -c:v mjpeg -q:v 2`;
    - `bg-big.jpg` and the per-part `bg.jpg` files left the shipped folder; the originals stay in history (`085fb62`).
  - **Transparency (D-021):** a one-entry `tRNS` chunk (index 0 → alpha 0) in `box.png`, `cta.png`, `left/hl.png` and `right/hl.png`, inserted by a one-off Node script from a scratch folder.
  - The CTA's rounded corners and the panel's 90% opacity (default of Q2) are CSS and follow in B2.
- **Decisions:** D-020 (background source, with a detailed record), D-021 (transparency).
- **Findings that change the plan:**
  - **The background zoom has hard limits** for B4 and B6:
    - scale 1 to 1.10 around (840, 487.5);
    - never below 1, because there is no moss outside `bg-big.jpg`'s edges, so "zooms in" can only start zoomed in and settle at the design, or end slightly zoomed in;
    - no translation drift, because the outer edges have no extra moss;
    - the parts have to run the same scale at the same moment, or the seams break during the zoom.
  - The upstream brief changed on 2026-11-05 (`2e8cc9a`). Only the wording changed: the "4 to 6 hours per variant" estimate was removed, and the README item reads "what you would do next with more time". The assets are unchanged. `docs/task-brief.md` follows it in F3.
- **Verification:**

  | Check | Result |
  |---|---|
  | Crop sizes (`tools/audit/dims.mjs`) | ✅ 736×1950, 2080×544, 736×1950 @2x |
  | Crops vs the same rectangle of `bg-big.jpg` | ✅ 49.4 / 48.4 / 49.7 dB (left / top / right) |
  | Seams (mean luma of 20 px strips either side of each gap, y 0–250) | ✅ 103.2 \| 103.6 and 72.1 \| 69.2, against 103.2 \| 103.6 and 72.0 \| 69.1 in `bg-big.jpg` |
  | Zoom reach at scale 1.10 inside each crop (script) | ✅ margins 0.73 (left), 0.41 (top), 0.73 px (right) |
  | PNG structure (`tools/audit/pngchunks.mjs`) | ✅ `IHDR PLTE tRNS IDAT IEND`, index 0 at alpha 0 |
  | PNG pixels vs `HEAD`, decoded independently | ✅ RGB identical; alpha 0 exactly on the formerly black pixels and 255 elsewhere (CTA: 168 corner pixels) |
  | All layers composited at their audit positions | ✅ no black areas; the moss runs on across the gaps ([preview](../img/b1-fireplace.jpg)) |
  | Weight (`variant-b-fireplace/assets`, the shipped folder so far) | ✅ 3 638 520 → **1 468 146 B** (1.40 MB, 49% of 3 MB) |

  The browser rendering is checked in B2, when the parts exist.
- **Standards checklist:** all items passed.
- **AI:** ai-log #20.

## B2 Static parts
- **Status:** ✅ done
- **Commit:** `feat: build variant B static parts`
- **Time:** 1.5 h planned / ~1 h actual
- **What was done:**
  - `top.html`, `left.html`, `right.html`: one `#stage` each with `data-part`, rendered 1:1 at the slot size, layers as `<img>` at 50% of their 2x size in the audit's order (D-022).
  - `css/style.css`, shared: the background crops at their §3.5 positions; the panel at opacity 0.9; the CTA centred at (73.75, 838.5) with 7 px corners (D-023).
  - `js/main.js`, shared:
    - fails fast on a missing `#stage` or an unknown part;
    - decodes every layer and keeps the stage hidden until then; a failed file throws `Fireplace <part>: failed to load <src>`;
    - reveals the stage afterwards.
  - `js/debug.js`: `?overlay=1` lays `design/layout.png` over the part at 50%, scaled by 1 / 0.973 and shifted to the part.
  - The markup is the end state of the intro, ready for `gsap.from` in B4. No GSAP, animation or clickout yet.
- **Decisions:** D-022 (part documents), D-023 (panel opacity and CTA corners, the default of Q2).
- **Findings:**
  - **The layout's scale is 0.973, not 0.972.** The top banner's content starts at x 343 in `layout.png`; the audit's 345 was its frame. Both are measured in audit §3.1. The re-measured CTA position stays at the centred 73.75 (§3.2).
  - **`npx serve` drops the query string** when it redirects `left.html` to `left`, so `?overlay=1` only works on the clean URL ([ai-log #21](../ai-log.md)). This matters for B3, if the preview ever passes flags to the iframes.
- **Verification:** Playwright MCP against `npx serve`.

  | Check | Result |
  |---|---|
  | Geometry (DOM) | ✅ stages 320×975 / 1032×250; every image at exactly 50% of its natural size; backgrounds at (0, 0), (−4, 0), (−48, 0); CTA at (73.75, 838.5) 172.5×46.5 with a 7 px radius; panel opacity 0.9 |
  | Pixel position against a composite of the same layers (luma, 1 px offset search) | ✅ the exact position scores 35.2 (left, DPR 2), 36.6 (right, DPR 2) and 36.2 dB (top, DPR 1); every 1 px shift ≤ 24.5 dB |
  | Absolute PSNR against that composite | ~30 dB: Chrome colour-manages the screenshot (+1 to +4 levels even on the PNG logo) and decodes and downscales the moss JPEG differently, so this number cannot prove the build ([ai-log #22](../ai-log.md)) |
  | Design overlay | ✅ logo, panel, copy and CTA coincide in both skyscrapers; the packshots and moss double, as expected from `bg-big.jpg` (D-020, P3); the top headline differs as in P2 ([overlay](../img/b2-overlay.jpg)) |
  | CTA corners at DPR 2 | ✅ smooth anti-aliased curve, no steps and no black |
  | Preload failure (routed 404 on `left/logo.png`) | ✅ `Fireplace left: failed to load assets/left/logo.png`; the stage stays `visibility: hidden` |
  | Console and network | ✅ no messages; only files under `variant-b-fireplace/`; no request for `debug.js` or `design/` without the flag |
  | Weight (`variant-b-fireplace` without `design/`) | ✅ 1 473 443 B (1.41 MB, 49% of 3 MB): assets 1 468 146 B, HTML / CSS / JS 5 297 B |

  The three parts side by side: [b2-parts.jpg](../img/b2-parts.jpg).
- **Standards checklist:** all items passed.
- **AI:** ai-log #21 and #22.
