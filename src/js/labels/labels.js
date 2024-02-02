/** @type {{ [k: string]: (x?: Partial<{ seekOffset: number; playbackRate: number; }>) => string; }} */
export const nouns = {
  AUDIO_PLAYER: () => 'audio player',
  VIDEO_PLAYER: () => 'video player',
  VOLUME: () => 'volume',
  SEEK: () => 'seek',
  CLOSED_CAPTIONS: () => 'closed captions',
  PLAYBACK_RATE: ({ playbackRate = 1 } = {}) =>
    `current playback rate ${playbackRate}`,
  PLAYBACK_TIME: () => `playback time`,
  MEDIA_LOADING: () => `media loading`,
  SETTINGS: () => `settings`,
  AUDIO_TRACKS: () => `audio tracks`,
  QUALITY: () => `quality`,
};

/** @type {{ [k: string]: (x?: Partial<{ seekOffset: number; playbackRate: number; }>) => string; }} */
export const verbs = {
  PLAY: () => 'play',
  PAUSE: () => 'pause',
  MUTE: () => 'mute',
  UNMUTE: () => 'unmute',
  ENTER_AIRPLAY: () => 'start airplay',
  EXIT_AIRPLAY: () => 'stop airplay',
  ENTER_CAST: () => 'start casting',
  EXIT_CAST: () => 'stop casting',
  ENTER_FULLSCREEN: () => 'enter fullscreen mode',
  EXIT_FULLSCREEN: () => 'exit fullscreen mode',
  ENTER_PIP: () => 'enter picture in picture mode',
  EXIT_PIP: () => 'exit picture in picture mode',
  SEEK_FORWARD_N_SECS: ({ seekOffset = 30 } = {}) =>
    `seek forward ${seekOffset} seconds`,
  SEEK_BACK_N_SECS: ({ seekOffset = 30 } = {}) =>
    `seek back ${seekOffset} seconds`,
  SEEK_LIVE: () => 'seek to live',
  PLAYING_LIVE: () => 'playing live',
};

export default {
  ...nouns,
  ...verbs,
};
