## Animation

### Transform and Opacity Only
Animate only `transform` and `opacity` (GSAP `x`, `y`, `scale`, `rotation`, `autoAlpha`). Never animate layout properties (`top`, `left`, `width`, `height`, `margin`) or filters.

### Easing, No Abrupt Stops
Every tween has easing (e.g. `power2.out`, `back.out` for pops) and eases into its final position. Linear motion is only for continuous scrolling.

### Final State Equals the Design
The end state of every intro or entrance is the measured design layout. Build the static layout first, then animate *from* offsets (`gsap.from`), so the markup is the source of truth and the final state can be reached instantly.

### Reduced Motion
With `prefers-reduced-motion: reduce`, decorative timelines jump to their end (`progress(1)`) and ambient loops do not start. Gameplay motion in Variant A is functional and stays.

### Loops Stop Within 30 Seconds
Ambient loops (background drift, CTA pulse) stop or settle within 30 seconds of the ad starting.
