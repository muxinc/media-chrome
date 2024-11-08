export type LabelOptions = { seekOffset?: number; playbackRate?: number };

// Setting a code explicitely to null makes the error not show up in the UI.
export const errors = {
  1: null,
  2: 'Network Error: A network error caused the media download to fail.',
  3: 'Decode Error: A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.',
  4: 'Source Not Supported: An unsupported error occurred. The server or network failed, or your browser does not support this format.',
  5: 'Encryption Error: The media is encrypted and there are no keys to decrypt it.',
};

export const tooltipLabels = {
  ENTER_AIRPLAY: 'Start airplay',
  EXIT_AIRPLAY: 'Stop airplay',
  AUDIO_TRACK_MENU: 'Audio',
  CAPTIONS: 'Captions',
  ENABLE_CAPTIONS: 'Enable captions',
  DISABLE_CAPTIONS: 'Disable captions',
  START_CAST: 'Start casting',
  STOP_CAST: 'Stop casting',
  ENTER_FULLSCREEN: 'Enter fullscreen mode',
  EXIT_FULLSCREEN: 'Exit fullscreen mode',
  MUTE: 'Mute',
  UNMUTE: 'Unmute',
  ENTER_PIP: 'Enter picture in picture mode',
  EXIT_PIP: 'Enter picture in picture mode',
  PLAY: 'Play',
  PAUSE: 'Pause',
  PLAYBACK_RATE: 'Playback rate',
  RENDITIONS: 'Quality',
  SEEK_BACKWARD: 'Seek backward',
  SEEK_FORWARD: 'Seek forward',
  SETTINGS: 'Settings',
};

export const nouns: Record<string, (options?: LabelOptions) => string> = {
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

export const verbs: Record<string, (options?: LabelOptions) => string> = {
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
