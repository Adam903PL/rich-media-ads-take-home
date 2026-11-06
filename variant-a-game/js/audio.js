// Game audio on the Web Audio API: preloaded buffers, a gapless music loop,
// per-sound levels, mute, and an AudioContext that starts only inside a user gesture.

const AUDIO_DIR = 'assets/music/';
// Levels from the integrated loudness of each file (docs/asset-audit.md, section 2.5):
// effects at −14 LUFS, the music and the applause bed under the cheer at −18 LUFS.
const SOUNDS = {
  music: { file: 'background_music/Funny Game Loop.mp3', gainDb: -6.1 },
  crash: { file: 'crash/Cartoon Crash Boing.mp3', gainDb: -4.8 },
  fail: { file: 'endcard_fail/Fail.mp3', gainDb: -6.3 },
  cheer: { file: 'endcard_win/Celebrative Happy Woohoo Cheer 2.mp3', gainDb: -4.3 },
  applause: { file: 'endcard_win/applause.mp3', gainDb: 0.6 },
};
// The music is 36 bars at 150 BPM; the file adds silence before and after them.
const LOOP_SECONDS = 57.6;
const AUDIBLE_LEVEL = 0.001; // −60 dBFS
const LOOP_END_SEARCH_SECONDS = 0.002;
const MUSIC_FADE_SECONDS = 0.3;
const STOP_FADE_SECONDS = 0.02;
const MUTE_FADE_SECONDS = 0.015;
// Events that grant user activation. On touch screens pointerdown does not, so the
// context is created or resumed on the release of the tap.
const GESTURE_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];

function decibelsToGain(decibels) {
  return 10 ** (decibels / 20);
}

async function loadBuffer(decoder, url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }
  return decoder.decodeAudioData(await response.arrayBuffer());
}

// Decodes every sound once, before the ad becomes interactive. An OfflineAudioContext
// decodes without needing a user gesture; its buffers play in any AudioContext.
export async function loadSounds() {
  const decoder = new OfflineAudioContext(2, 1, 44100);
  const names = Object.keys(SOUNDS);
  const urls = names.map((name) => AUDIO_DIR + SOUNDS[name].file);
  const results = await Promise.allSettled(urls.map((url) => loadBuffer(decoder, url)));
  const failed = results.filter((result) => result.status === 'rejected');

  if (failed.length > 0) {
    const files = urls.filter((url, index) => results[index].status === 'rejected').join(', ');
    throw new Error(`Gut Run: failed to load ${files}`, { cause: failed.map((result) => result.reason) });
  }
  return Object.fromEntries(names.map((name, index) => [name, results[index].value]));
}

// The loop starts at the first audible frame and lasts LOOP_SECONDS. Its end moves to the
// quietest frame within ±2 ms, so the jump back to the start does not click. It is found
// in the decoded buffer because decoders trim the MP3's encoder delay differently.
export function findLoop(buffer) {
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index));
  const level = (frame) => Math.max(...channels.map((samples) => Math.abs(samples[frame])));

  let start = 0;
  while (start < buffer.length && level(start) <= AUDIBLE_LEVEL) start++;
  const target = start + Math.round(LOOP_SECONDS * buffer.sampleRate);
  const search = Math.round(LOOP_END_SEARCH_SECONDS * buffer.sampleRate);
  if (target + search >= buffer.length) {
    throw new Error(`Gut Run: the music is shorter than its ${LOOP_SECONDS} s loop`);
  }

  let end = target;
  for (let frame = target - search; frame <= target + search; frame++) {
    if (level(frame) < level(end)) end = frame;
  }
  return { loopStart: start / buffer.sampleRate, loopEnd: end / buffer.sampleRate };
}

export function setupAudio(buffers, muteButton) {
  const { loopStart, loopEnd } = findLoop(buffers.music);
  const playing = new Set();
  let context = null;
  let master = null;
  let muted = false;
  let musicWanted = false;
  let music = null;

  function resumeContext() {
    if (context.state === 'running' || document.hidden) return;
    context.resume().catch((error) => console.warn('Gut Run: audio stays paused until the next tap', error));
  }

  function handleGesture() {
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(context.destination);
      if (musicWanted) startMusicSource();
    }
    resumeContext();
  }

  function startSound(name) {
    const source = context.createBufferSource();
    source.buffer = buffers[name];
    const gain = context.createGain();
    gain.gain.value = decibelsToGain(SOUNDS[name].gainDb);
    source.connect(gain).connect(master);
    const sound = { source, gain, stopping: false };
    playing.add(sound);
    source.addEventListener('ended', () => playing.delete(sound));
    return sound;
  }

  function fadeOut(sound, seconds) {
    const now = context.currentTime;
    sound.stopping = true;
    sound.gain.gain.setTargetAtTime(0, now, seconds / 4);
    sound.source.stop(now + seconds);
  }

  function startMusicSource() {
    music = startSound('music');
    Object.assign(music.source, { loop: true, loopStart, loopEnd });
    music.source.start(0, loopStart);
  }

  function setMuted(value) {
    muted = value;
    muteButton.setAttribute('aria-pressed', String(muted));
    master?.gain.setTargetAtTime(muted ? 0 : 1, context.currentTime, MUTE_FADE_SECONDS);
  }

  GESTURE_EVENTS.forEach((type) => document.addEventListener(type, handleGesture, { capture: true }));
  // A tap on the toggle must not reach #ad, where it would start the game or jump.
  muteButton.addEventListener('pointerdown', (event) => event.stopPropagation());
  muteButton.addEventListener('click', () => setMuted(!muted));

  return {
    // Before the first gesture there is no context yet; the music then starts with it.
    startMusic() {
      musicWanted = true;
      if (context) startMusicSource();
    },
    stopMusic() {
      musicWanted = false;
      if (music) fadeOut(music, MUSIC_FADE_SECONDS);
      music = null;
    },
    // A finger held down since the first tap has not granted activation yet, so there is
    // no context and the browser would not play anything; the sound is left out.
    play(name) {
      if (!context) return;
      startSound(name).source.start();
    },
    stopAll() {
      musicWanted = false;
      music = null;
      playing.forEach((sound) => {
        if (!sound.stopping) fadeOut(sound, STOP_FADE_SECONDS);
      });
    },
    suspend() {
      context?.suspend();
    },
    resume() {
      if (context) resumeContext();
    },
  };
}
