## Project Structure

### Self-Contained Variant Folders
Each variant folder (`variant-a-game/`, `variant-b-fireplace/`) is an independent deliverable with its own HTML, CSS, JS, assets and libraries; nothing is shared between variants at runtime. Only variant folders minus `design/` are shipped; everything else is documentation, tooling or reference.

### No Build Step
No bundler and no TypeScript: plain HTML, CSS and native ES modules served as-is with `npx serve .`. Nothing in a shipped ad may depend on `package.json` or dev tooling.

### Dependencies on Demand, Pinned
Add a dependency only in the first step that needs it, pinned to an exact version (no ranges), and avoid releases younger than about two weeks. Runtime libraries (e.g. GSAP) are vendored as minified files inside each variant folder that uses them, so the ad is self-contained and the library counts towards its weight.

### Tool Scripts Are Read-Only
Scripts in `tools/` are Node 18+ ESM (`.mjs`) with a one-line purpose comment at the top, documented in their folder's README with usage. They only read project files; any scratch output goes to the git-ignored `tools/out/`, never into variant folders.
