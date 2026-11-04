# Project Vision

## Pitch
Rich media ads take-home (SF-FE-01-BAM) is a pair of HTML5 rich media ads — a mobile game ad and a desktop fireplace skin. They turn a designer's layout and 2x asset exports into working, animated creatives for a We The Folks junior frontend take-home.

## Problem Statement
Rich media ads run under hard constraints:
- They load inside unknown ad slots.
- Each must weigh under 3 MB.
- They cannot use UI frameworks.
- Audio autoplay is blocked until the user interacts.
- They have to be pixel-accurate to the design.

The task tests whether the candidate can deliver that reliably, and explain every decision, in a few days.

## Target Users
- **Ad viewers:**
  - Variant A: phone users, viewports 320×568 up to 430×932.
  - Variant B: desktop visitors of a publisher site framed by the fireplace.
- **Reviewers:** We The Folks engineers. They read the code, the commit history, README, DECISIONS.md and the AI note.

## Key Features
- **Variant A "Gut Run":**
  - tap-to-jump game with fair collision, where each obstacle appears once
  - fail endcard with clean replay, win endcard with confetti and applause
  - background music with mute, pause when the tab is hidden
- **Variant B Fireplace:**
  - three separate creatives on one continuous moss background
  - a coordinated 3–6 s intro, then a calm idle loop that stops after 30 s
  - clickout to the click tag, reduced-motion support

## Success Criteria
- Every required behaviour from the brief works ([task brief](../../../docs/task-brief.md)).
- Each ad stays under 3 MB, and the compression is documented.
- Positions match the measured design values ([asset audit](../../../docs/asset-audit.md)).
- Animations stay smooth on an average laptop and phone, and replay leaves no leftover timers or sounds.
- README, DECISIONS.md and the AI note are complete, and the repo is delivered by ~2026-11-08.

## Differentiators
- Measurement-first: positions come from scripts in `tools/audit/`, not from eyeballing.
- Every asset/design conflict is documented, with a default, before it is built.
- An honest log of AI mistakes and their fixes.
