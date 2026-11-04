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
- **Status:** ⏳ in progress
