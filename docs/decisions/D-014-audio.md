# D-014 Audio (Variant A)

**Date / stage:** 2026-11-06 · A6 · **Status:** accepted

## Context
- **The brief:** background music during the game, a crash on a hit, fail and win sounds on the endcards. Audio only after the first interaction, a small mute toggle, and a pause when the ad is not visible.
- **The music loop has silence at both ends:** 69 ms before the first note and 139 ms after the last one. `<audio loop>` would leave a 208 ms gap every minute ([audit §2.5](../asset-audit.md)).
- **The levels differ widely:** the files range from −7.7 to −18.6 LUFS, and two of them have true peaks above 0 dBFS.
- **Touch activation:** on touch screens `pointerdown`, where the game starts, does not count as a user activation. A context started there would stay blocked on phones.
- No mute icon was provided (note N2 to the recruiter).

## Options
1. **`<audio>` elements**
   - Pros: no decoding code.
   - Cons: no gapless loop; per-element volume is unreliable on iOS; overlapping sounds need several elements.
2. **Web Audio with the loop points hard-coded from the `ffmpeg` measurement**
   - Pros: simple.
   - Cons: browsers trim the MP3 encoder delay differently, so fixed offsets drift by ~25 ms between decoders. They would also break after the re-encode in A8.
3. **Web Audio with the loop found in the decoded buffer**
   - Pros: gapless in every decoder, survives re-encoding.
   - Cons: a short scan of one buffer at start-up.

## Decision
**Option 3** (`variant-a-game/js/audio.js`).
- **Loading:** all five files are fetched and decoded once, during the preload, on an `OfflineAudioContext`. This needs no gesture and logs no autoplay warning. A failed file stops the start with its name.
- **Unlock:** the `AudioContext` is created on the first `pointerup`, `touchend`, `click` or `keydown`, which all grant activation. Every later gesture resumes it if it is not running, which also covers iOS interruptions. The music asked for on the first tap's `pointerdown` starts when the context exists, about 0.1 s later on touch.
- **Loop:**
  - It starts at the first frame above −60 dBFS and lasts 57.6 s (36 bars at 150 BPM).
  - Its end moves to the quietest frame within ±2 ms, so the seam does not click: the step at the seam is 0.0136 instead of 0.147.
  - One looping `AudioBufferSourceNode` plays it.
- **Levels:** one gain per sound from the measured loudness: effects at −14 LUFS, the music and the applause bed at −18 LUFS. All peaks stay at or below −3.4 dBFS; after the A8 re-encode the gains moved by up to 0.4 dB and the highest peak is −2.8 dBFS (D-018). A master gain carries mute.
- **Timing:**
  - Music: from the first tap of a run; fades out over 0.3 s when the run ends.
  - Crash: at the hit.
  - Fail: when the sad poo starts to drop, ~1.05 s after the hit, once the crash has decayed.
  - Cheer and applause: when the confetti bursts, ~0.75 s after the win.
  - The endcard sounds hang on cues in the endcard timelines, so they stay in sync with the animation and also fire under reduced motion.
- **Mute:** an inline SVG toggle in the campaign navy on the logo bar, above the endcards. A tap on it does not reach the game.
- **Pause and replay:** the context is suspended while the page is hidden. Replay fades out and stops every playing source in 20 ms.

## Consequences
- **Weight:** no new files; the icon is inline. The audio is still the original 1.37 MB until A8.
- **Memory:** the decoded buffers take ~28 MB as 32-bit stereo at 44.1 kHz (the music alone 20.4 MB).
- **Hold-down edge case:** a finger held down from the first tap until a crash has not granted activation yet, so that crash stays silent. Browsers allow no sound in that case.
- **Manual check (F2):** the levels and the loop seam need a listen on real phones, and the unlock needs testing on iOS Safari and Android Chrome.
