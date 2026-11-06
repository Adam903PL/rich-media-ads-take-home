// Shared start of the three parts (D-026). In the preview every part reports `ready`, the
// preview answers `hold` and, once all three are ready, sends them one start time on a
// clock all documents share. A part without such a partner starts on its own.
export const MESSAGE = { ready: 'fireplace:ready', hold: 'fireplace:hold', start: 'fireplace:start' };

// A partner answers within milliseconds; the frame of an ad server never answers.
const SOLO_START_MS = 300;

// Lead the preview gives its start time, so the message reaches every part before it.
export const START_LEAD_MS = 150;

// Milliseconds since the epoch at sub-millisecond resolution, comparable across documents.
export function sharedNow() {
  return performance.timeOrigin + performance.now();
}

// Resolves with the shared start time, or with undefined when the part starts on its own:
// at once as a top-level page, or after SOLO_START_MS in a frame nobody answers from.
export function waitForStart(part) {
  if (window.parent === window) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    const listening = new AbortController();
    const soloStart = setTimeout(() => finish(undefined), SOLO_START_MS);

    function finish(startAt) {
      clearTimeout(soloStart);
      listening.abort();
      resolve(startAt);
    }

    window.addEventListener('message', (event) => {
      if (event.source !== window.parent) return;
      const { type, startAt } = event.data ?? {};
      if (type === MESSAGE.hold) clearTimeout(soloStart);
      if (type === MESSAGE.start && Number.isFinite(startAt)) finish(startAt);
    }, { signal: listening.signal });

    // The ad server's origin is not known in advance, and the message carries no data.
    window.parent.postMessage({ type: MESSAGE.ready, part }, '*');
  });
}
