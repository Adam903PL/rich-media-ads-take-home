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

## B3 Preview page
- **Status:** ✅ done
- **Commit:** `feat: add variant B preview page`
- **Time:** 0.5 h planned / ~0.75 h actual (most of it went into two verification artefacts, see Findings)
- **What was done:**
  - `preview.html`: `#fireplace` (1680×975) with three iframes at x 0, 324 and 1360 (`left.html`, `top.html`, `right.html`, each with a `title`), on the layout's background `#282828` (measured: rgb 40, 40, 40); the website area stays empty.
  - `js/preview.js`: fits the fireplace to the window as a whole, never above 1:1, with whole-pixel offsets; `?overlay=1` lays one `layout.png` over the whole fireplace through the existing `showDesignOverlay` in `js/debug.js`.
  - `css/preview.css`, separate from the shipped parts' `css/style.css`.
- **Decisions:** D-024 (preview page).
- **Findings:**
  - **The test browser draws every bottom edge about 0.4 px too low.** One row below the top banner shows ~40% of its content, in the preview and on the standalone `top` page. A plain red `div` of height 250 shows the same row at `255,153,153`, so it is the headless browser (it reports a device pixel ratio of 1.0000000149), not the ad. Vertical edges are exact. Checked again on real screens in F2.
  - Inside the preview at full size, a part renders exactly as on its own page (75.9 dB for the left part's iframe against `left`). The first comparison said otherwise because of a wrong reference ([ai-log #23](../ai-log.md)).
- **Verification:** Playwright MCP against `npx serve`.

  | Check | Result |
  |---|---|
  | 1920×1080 | ✅ scale 1, fireplace at (120, 53); iframes relative to it at (0, 0) 320×975, (324, 0) 1032×250, (1360, 0) 320×975; all parts `is-ready` |
  | Pixels at 1:1 against the B2 part screenshots composed in RGB | ✅ left 83.5, top 68.4, right 70.9 dB; gaps identical to the background. The middle scores 46.2 dB only because of the bottom-edge row above |
  | 1440×900 and 1366×768 | ✅ scale 0.857 and 0.788, the whole fireplace visible, no scrollbars on the page; every part's document stays at its slot size (320×975, 1032×250), so no scrollbars inside the iframes ([1440×900](../img/b3-preview.jpg)) |
  | Live resize 1920 → 1440 → 1366 → 1920 | ✅ rescaled each time, back to scale 1 at (120, 53) |
  | `/variant-b-fireplace/preview?overlay=1` | ✅ overlay at (−28.78, −51.39) 1730.7×1046.25; the layout's frames fall into the 4 px gaps; logos, panels, copy and CTAs coincide; packshots and the top headline differ as expected (P3, P2) ([overlay](../img/b3-preview-overlay.jpg)) |
  | Console and network | ✅ no messages from the ad; only files under `variant-b-fireplace/`; `debug.js` and `design/layout.png` only with the flag |
  | Parts | ✅ unchanged files; the shipped weight stays 1 473 443 B (the preview adds 2 852 B of its own, not shipped) |
- **Standards checklist:** all items passed.
- **AI:** ai-log #23.

## B4 Intro timelines
- **Status:** ✅ done
- **Commits:** `chore: vendor GSAP 3.15.0 for variant B`, `feat: add variant B intro timelines`
- **Time:** 1.5 h planned / ~1.25 h actual
- **What was done:**
  - **GSAP:** `vendor/gsap.min.js`, byte-identical to the Variant A copy (same SHA-512), loaded by a `defer` script before the module in each part (D-012).
  - **`js/intro.js`:** `setupIntro(stage, part)` builds one paused 3.5 s timeline per part on beats shared by all parts (D-025):

    | t (s) | Part | What |
    |---|---|---|
    | 0–3.5 | all | moss fades in (0.8 s) and settles from scale 1.08 to 1 around the fireplace centre |
    | 0.35 / 0.70 / 1.05 | top | headline lines rise 14 px and fade in; at 1.65 s the copies give way to the full image |
    | 0.45 | left, right | logo pops in from 0.8 |
    | 1.2 | left, right | panel opens upwards from its bottom edge |
    | 1.6 | left, right | copy rises 10 px |
    | 2.2–2.7 | left, right | CTA pops in last |

  - **Headline line by line:** three more copies of `top/hl.png` with static gradient masks fading over y 78–92 and 145.5–159.5, because the shadow between the lines is 20–30% opaque (audit §3.3).
  - **`js/main.js`:** builds the intro before the reveal, so the first frame appears first; plays it, or jumps to its end with reduced motion; pauses `gsap.globalTimeline` while the page is hidden.
  - `js/motion.js` and `js/dom.js` follow the Variant A modules (no shared runtime between variants).
- **Decisions:** D-025 (intro).
- **Findings:**
  - **The background settles instead of zooming in.** The brief's "background slowly zooms in" would end away from the layout; it can come back in B6 as a slow idle zoom that returns to 1.
  - **After the scale animation, Chrome draws the moss from a different decoded size.** The end state scores 57–59 dB against the static B2 screenshot, only in the moss, while every element is back at its exact position. It stays the same after 8 s and after removing the inline transform. With reduced motion, which never scales, the end state is identical to B2.
- **Verification:** Playwright MCP against `npx serve`.

  | Check | Result |
  |---|---|
  | Duration and end | ✅ 3.5 s in every part; afterwards 0 active tweens |
  | End state vs B2 | ✅ geometry unchanged; pixels 57–59 dB in the moss, see Findings; the top headline ends as the single full image (`.headline` visible, the copies hidden) |
  | Reduced motion | ✅ `progress` 1 at the reveal, 0 active tweens; identical to B2 (∞ / 71.8 dB) |
  | Shared zoom in the preview, all parts held at the same time (0, 0.4 … 3.5 s) | ✅ each background's rectangle in fireplace coordinates equals O + s (crop − O) to 0.001 px in all three parts, so the moss stays one surface; at scale 1.08 every crop still covers its whole part |
  | Headline build (0.6, 1.0, 1.3 s) | ✅ the shadow fades out softly below each new line, no straight edge |
  | Animated properties | ✅ inline styles hold only transform properties, `opacity` and `visibility` (from `autoAlpha`) |
  | Hidden page | ✅ the intro holds at 0.549 s for 0.8 s; after the page is shown again it continues (+0.216 s in 200 ms), no jump |
  | Smoothness in the preview (headless, orientation only) | ✅ 3.5 s of the intro without a frame over 20 ms (longest 13.2 ms) |
  | Console and network | ✅ no messages; only local files, now including `vendor/gsap.min.js` |
  | Weight (the shipped parts: `variant-b-fireplace` without `design/` and the preview files) | ✅ 1 552 278 B (1.48 MB, 52% of 3 MB) |

  Filmstrip at 0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4 and 3.5 s, read left to right and top to bottom: [b4-intro.jpg](../img/b4-intro.jpg). The parts still start on their own after their own preload; B5 adds the shared start.
- **Manual check left for the user:** the timing and the feel of the intro on a real laptop (F2).
- **Standards checklist:** all items passed.
- **AI:** ai-log #24.

## B5 Sync
- **Status:** ✅ done
- **Commit:** `feat: start the variant B parts together`
- **Time:** 0.5 h planned / ~0.5 h actual
- **What was done:**
  - **`js/sync.js`**, shared by the parts and the preview and free of GSAP (the preview does not load it): message types, `sharedNow()` (`performance.timeOrigin + performance.now()`), and `waitForStart(part)`. It resolves at once for a top-level page; in a frame it posts `fireplace:ready` and resolves with the preview's start time, or on its own after 300 ms without an answer.
  - **`js/main.js`:** with reduced motion the intro jumps to its end before the reveal and nothing is sent. Otherwise the reveal comes first, then `playAt()`: `gsap.delayedCall` until the shared start time, or a late start that far into the intro.
  - **`js/preview.js`:** `startPartsTogether()` answers each `ready` from its own frames with `hold` and, once all three are ready, sends them one `start` time 150 ms ahead. It fails fast if the three frames are missing.
- **Decisions:** D-026 (shared start).
- **Verification:** Playwright MCP against `npx serve`. An init script logged every message in every frame.

  | Check | Result |
  |---|---|
  | Preview, 6 loads (a fresh context, then 5 reloads) | ✅ every time all three parts got `hold` then `start` and none started on its own; the start time arrived 149–150 ms ahead; the intros ran within **0–4 ms** of each other |
  | Live frame 0.4 s into the shared start, nothing paused | ✅ the moss is one surface across the parts during the zoom; logos and the first headline line come in together ([b5-live.jpg](../img/b5-live.jpg)) |
  | Part as a top-level page | ✅ playing at the reveal |
  | Part in a frame whose parent never answers | ✅ starts on its own 306 ms after its `ready` |
  | A fake `start` posted from inside the part | ✅ ignored: the part still started on its own (310 ms) instead of waiting 5 s |
  | Fake `ready` messages posted by the preview window itself | ✅ ignored: no message reached any part |
  | Part hidden for 1 s while waiting for a start 2 s ahead | ✅ started 1 014 ms after the start time, at intro time 0, so no jump |
  | Reduced motion, standalone and in the preview | ✅ end state at once, no `ready` sent |
  | Console and network | ✅ no messages; only local files |
  | Weight (the shipped parts) | ✅ 1 554 778 B (1.48 MB, 52% of 3 MB) |
- **Standards checklist:** all items passed.
- **AI:** ai-log #25.
