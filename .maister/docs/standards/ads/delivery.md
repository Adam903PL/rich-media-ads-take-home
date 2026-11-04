## Delivery

### Click Tag Clickout
Every CTA opens the landing page in a new window through the click tag (Variant B: a click anywhere on a part). Read `window.clickTag` at click time, because ad servers may inject it after load.

    function openClickTag() {
      const clickTag = window.clickTag || 'https://example.com/landing';
      window.open(clickTag, '_blank');
    }

### 3 MB per Ad
Each shipped ad stays under 3 MB, including vendored libraries, images and audio. Variant A counts as one ad. Variant B counts as the whole fireplace: `top`, `left` and `right` together (D-004). Re-check the weight after every asset change.

### No Frameworks, No External Requests
No UI frameworks; GSAP is the only animation library. A shipped ad makes no external runtime requests (CDNs, web fonts, analytics): everything it needs lives inside its variant folder.

### Fixed Stage, Scaled as a Whole
Each ad is built on a fixed logical stage (A: 360×640; B: top 1032×250, left/right 320×975) and scaled as a whole: no breakpoints, no reflow. Variant A fills the visible viewport (`dvh` / `visualViewport`, mobile toolbars included) without distortion and without cutting important content.
