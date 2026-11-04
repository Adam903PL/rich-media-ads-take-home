## Assets

### 2x Assets at 50%
All provided images are exported at 2x: render them at exactly half their pixel size (CSS px = asset px ÷ 2). Never upscale, redraw or replace them. Full-frame layers (720×1280, 640×1950, 2064×500) are placed at 0,0 covering the whole stage, so their baked-in position stays correct.

### Positions from Measurements
Every position and size comes from `docs/asset-audit.md` or a new measurement with `tools/audit/`, never by eye. Add newly measured values to the audit. Document coordinates in CSS px unless marked @2x, with inclusive ranges.

### Delivered Asset Is the Source of Truth
When an asset differs from the mockup (copy, typesetting, colour), build with the asset as delivered and raise the mismatch in `docs/questions.md`. Never retouch an asset to match the mockup.

### Lossless Repairs and Compression Only
Asset processing is limited to compression, re-encoding, cropping and lossless repairs (e.g. restoring a missing `tRNS` chunk). Each change is its own commit and is listed in `DECISIONS.md` with the before/after weight.

### Transform Origin of Full-Frame Layers
When scaling or rotating a full-frame layer, set `transform-origin` to the centre of its content bounding box from the audit, not the frame centre, so it animates around the visible artwork.
