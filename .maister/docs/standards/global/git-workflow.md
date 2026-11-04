## Git Workflow

### One Commit per Logical Unit
Every roadmap step ends in its own commit, and a commit covers one logical unit (one component, page, asset fix or doc set). Do not batch unrelated changes or several steps into one commit.

### Conventional Commit Messages
Prefix commit subjects with `feat:`, `fix:`, `refactor:`, `chore:`, `docs:` or `test:`, followed by a short, specific description of what changed. Avoid vague subjects such as "updates" or "fixes".

### Originals First, Optimised Files Separately
Provided assets were committed exactly as delivered. Any optimised or repaired version (compression, re-encode, `tRNS` fix, crop) replaces the original in its own later commit, so history shows exactly what changed and the commit message states how.

### Binary Media in .gitattributes
Images, audio, video and fonts are marked `binary` in `.gitattributes` (currently png, jpg, jpeg, webp, mp3, m4a, ogg, mp4, webm, woff2). When a new binary format enters the repo (e.g. gif, avif, wav, woff), add a `binary` line for it in the same commit.

### Untracked Artefacts and Secrets
Never commit `node_modules/`, `*.log`, OS metadata (`.DS_Store`, `Thumbs.db`), Playwright output (`test-results/`, `playwright-report/`) or tool scratch output (`tools/out/`). `.env` and `.env.*` stay ignored; only `.env.example` may be committed.
