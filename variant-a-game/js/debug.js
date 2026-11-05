// Development aids, loaded only through URL parameters. design/ is not shipped with the ad.

export function showDesignOverlay(stage) {
  const overlay = new Image();
  overlay.className = 'layer design-overlay';
  overlay.src = 'design/01-start.png';
  overlay.alt = '';
  stage.append(overlay);
}
