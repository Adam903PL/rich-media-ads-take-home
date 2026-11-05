// Collision masks on the assets' native 2x pixel grid: two mask pixels per CSS px.
const MASK_SCALE = 2;
const ALPHA_THRESHOLD = 128;

export function createMask(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);

  let pixels;
  try {
    pixels = context.getImageData(0, 0, width, height).data;
  } catch (error) {
    throw new Error(`Gut Run: cannot read the pixels of ${image.getAttribute('src')} for collision`, { cause: error });
  }

  const data = new Uint8Array(width * height);
  for (let index = 0; index < data.length; index++) {
    data[index] = pixels[index * 4 + 3] >= ALPHA_THRESHOLD ? 1 : 0;
  }
  return { width, height, data };
}

// Removes every opaque pixel closer than `cssPixels` to a transparent one, so a
// contact has to be deeper than that before it counts.
export function erodeMask(mask, cssPixels) {
  const radius = Math.round(cssPixels * MASK_SCALE);
  const { width, height, data } = mask;
  const offsets = [];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius) offsets.push([dx, dy]);
    }
  }

  const isOpaque = (x, y) => x >= 0 && y >= 0 && x < width && y < height && data[y * width + x] === 1;
  const eroded = new Uint8Array(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isOpaque(x, y) && offsets.every(([dx, dy]) => isOpaque(x + dx, y + dy))) {
        eroded[y * width + x] = 1;
      }
    }
  }
  return { width, height, data: eroded };
}

// Positions are the masks' top-left corners in CSS px. Rejects by bounding box
// first, then samples mask `b` at the centre of every pixel of `a` in the shared area.
export function masksOverlap(a, ax, ay, b, bx, by) {
  const left = Math.max(ax, bx);
  const right = Math.min(ax + a.width / MASK_SCALE, bx + b.width / MASK_SCALE);
  const top = Math.max(ay, by);
  const bottom = Math.min(ay + a.height / MASK_SCALE, by + b.height / MASK_SCALE);
  if (left >= right || top >= bottom) return false;

  const startX = Math.max(0, Math.floor((left - ax) * MASK_SCALE));
  const endX = Math.min(a.width, Math.ceil((right - ax) * MASK_SCALE));
  const startY = Math.max(0, Math.floor((top - ay) * MASK_SCALE));
  const endY = Math.min(a.height, Math.ceil((bottom - ay) * MASK_SCALE));
  const offsetX = (ax - bx) * MASK_SCALE;
  const offsetY = (ay - by) * MASK_SCALE;

  for (let y = startY; y < endY; y++) {
    const sampleY = Math.floor(y + 0.5 + offsetY);
    if (sampleY < 0 || sampleY >= b.height) continue;
    for (let x = startX; x < endX; x++) {
      if (a.data[y * a.width + x] === 0) continue;
      const sampleX = Math.floor(x + 0.5 + offsetX);
      if (sampleX >= 0 && sampleX < b.width && b.data[sampleY * b.width + sampleX] === 1) return true;
    }
  }
  return false;
}
