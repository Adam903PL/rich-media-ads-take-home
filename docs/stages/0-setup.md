# Stage 0 — Setup

**Goal:** repository, original assets, documentation skeleton and coding standards in place, and questions sent to the recruiter, all before any ad code.

## 0.1 Repository skeleton
- **Status:** ✅ done
- **Commit:** `chore: initialize repository structure`
- **What was done:** new repository (not a fork) with `.gitignore`, `.gitattributes` (LF line endings, binary assets), `.editorconfig`, README skeleton and `DECISIONS.md`.
- **Decisions:** D-001 (no bundler), D-002 (dependencies added on demand).

## 0.2 Import of the provided assets
- **Status:** ✅ done
- **Commit:** `chore: import provided assets and designs`
- **What was done:** both variant folders copied unmodified (59 files, verified identical with `diff -rq`). Optimised versions will replace files in later commits, so the history shows exactly what changed.

## 0.3 Asset audit and questions
- **Status:** ✅ done
- **What was done:** every asset measured. Positions, bounding boxes, audio and colours are in [asset-audit.md](../asset-audit.md); six questions with defaults are in [questions.md](../questions.md).
- **Findings that change the plan:** missing transparency in four Variant B PNGs, top headline copy mismatch, the background-source conflict, packshots baked into the backgrounds, and the audio loop gap.
- **AI:** two corrections logged ([ai-log #1, #2](../ai-log.md)).

## 0.4 Maister docs and standards
- **Status:** ✅ done
- **Commits:** `docs: initialize maister project docs and standards`, `docs: add rich media ad standards`
- **What was done:**
  - `/maister:init` with a reduced selection: vision, tech-stack, architecture and roadmap; built-in standards only from `global`.
  - `standards-discover` scoped to config and docs. It found 29 standards, consolidated into `git-workflow`, `documentation`, `project-structure` and an EditorConfig rule in `coding-style`.
  - `standards-update` created the custom `ads` category (`assets`, `delivery`, `animation`, `lifecycle`) from the brief and the asset audit.
  - `CLAUDE.md` points to `.maister/docs/INDEX.md` and describes the reduced workflow.
- **Decisions:** D-003 (reduced Maister setup).
- **Deviations from plan:**
  - `/maister:init` uses plugin version 2.1.8, which has no dashboard output, so no `config.yml` was needed.
  - The user also selected `vision.md`. It is kept short because the brief already covers the goals.

## 0.5 Publish
- **Status:** ⏳ waiting for confirmation of the repository name
