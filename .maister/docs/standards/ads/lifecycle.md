## Lifecycle

### Preload with Explicit Failure
Preload all images and audio before the ad becomes interactive. A failed load is logged with the file name and stops the start; there is no silent fallback.

### Audio After the First Gesture
Create or resume the `AudioContext` only inside the first user-gesture handler; never attempt autoplay. A visible mute toggle controls a master gain node.

### Pause When Hidden
When `document.visibilityState` becomes `hidden`, pause the game loop, GSAP (`gsap.globalTimeline.pause()`) and audio (`AudioContext.suspend()`). When it becomes visible, resume cleanly and reset the frame clock, so time does not jump.

### Clean Restart
A replay or restart first tears down everything the previous run created — `requestAnimationFrame` handles, timers, event listeners, GSAP tweens and audio sources — so there are no doubled speeds, duplicated sounds or leftover timers. Keep one owner per run with an explicit `destroy()`.

### Clamped Delta-Time Loop
The game loop runs on `requestAnimationFrame` with delta time in seconds, clamped (e.g. to 1/30 s), so physics is frame-rate independent and does not jump after a stall.
