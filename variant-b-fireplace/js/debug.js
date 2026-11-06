// Development aid, loaded only through ?overlay=1. design/ is not shipped with the ad.
export function showDesignOverlay(stage) {
  const overlay = new Image();
  overlay.className = 'design-overlay';
  overlay.src = 'design/layout.png';
  overlay.alt = '';
  stage.append(overlay);
}
