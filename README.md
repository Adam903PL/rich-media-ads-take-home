# Rich media ads — take-home (SF-FE-01-BAM)

Two animated rich media ads built from a designer's layout and exported assets:

- **Variant A — Game Ad "Gut Run"**: mobile fullscreen tap-to-jump mini game (`variant-a-game/`)
- **Variant B — Fireplace Ad**: three-part animated desktop skin (`variant-b-fireplace/`)

> **Status:** work in progress. See [roadmap](.maister/docs/project/roadmap.md) for the current stage.

## Run locally

```bash
npx serve .
```

Then open `http://localhost:3000/variant-a-game/` or `http://localhost:3000/variant-b-fireplace/preview.html`.

### Dev flags

| Flag | Effect |
|---|---|
| `?overlay=1` | Variant A: lays the start-screen design over the stage at 50% opacity, to check alignment (needs the `design/` folder, which is not shipped) |
| `?debug=1` | Variant A: draws the collision masks (the player's after the 2 px erosion), their boxes and the player's cloud limits; whatever ended the run turns red |

## Repository layout

| Path | Contents |
|---|---|
| `variant-a-game/`, `variant-b-fireplace/` | the ads (only these folders are shipped) |
| `DECISIONS.md` | short decision log |
| `docs/` | working documentation: asset audit, questions, stage logs, decision details, AI log |
| `.maister/docs/` | project docs and coding standards used while building |

Design files (`*/design/`) and everything outside the variant folders are reference material and do not count towards the ad weight.
