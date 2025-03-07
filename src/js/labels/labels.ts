import { t } from '../utils/i18n.js';

export type LabelOptions = { seekOffset?: number; playbackRate?: number };

export type MediaErrorLike = {
  code: number;
  message: string;
  [key: string]: any;
};

const defaultErrorTitles = {
  2: 'Network Error',
  3: 'Decode Error',
  4: 'Source Not Supported',
  5: 'Encryption Error',
};

const defaultErrorMessages = {
  2: 'A network error caused the media download to fail.',
  3: 'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.',
  4: 'An unsupported error occurred. The server or network failed, or your browser does not support this format.',
  5: 'The media is encrypted and there are no keys to decrypt it.',
};

// Returning null makes the error not show up in the UI.
export const formatError = (error: MediaErrorLike) => {
  if (error.code === 1) return null;
  return {
    title: defaultErrorTitles[error.code] ?? `Error ${error.code}`,
    message: defaultErrorMessages[error.code] ?? error.message,
  };
};

const translation = t;

export const tooltipLabels = {
  ENTER_AIRPLAY: translation('Start airplay'),
  EXIT_AIRPLAY: translation('Stop airplay'),
  AUDIO_TRACK_MENU: translation('Audio'),
  CAPTIONS: translation('Captions'),
  ENABLE_CAPTIONS: translation('Enable captions'),
  DISABLE_CAPTIONS: translation('Disable captions'),
  START_CAST: translation('Start casting'),
  STOP_CAST: translation('Stop casting'),
  ENTER_FULLSCREEN: translation('Enter fullscreen mode'),
  EXIT_FULLSCREEN: translation('Exit fullscreen mode'),
  MUTE: translation('Mute'),
  UNMUTE: translation('Unmute'),
  ENTER_PIP: translation('Enter picture in picture mode'),
  EXIT_PIP: translation('Exit picture in picture mode'),
  PLAY: translation('Play'),
  PAUSE: translation('Pause'),
  PLAYBACK_RATE: translation('Playback rate'),
  RENDITIONS: translation('Quality'),
  SEEK_BACKWARD: translation('Seek backward'),
  SEEK_FORWARD: translation('Seek forward'),
  SETTINGS: translation('Settings'),
};

export const nouns: Record<string, (options?: LabelOptions) => string> = {
  AUDIO_PLAYER: () => translation('audio player'),
  VIDEO_PLAYER: () => translation('video player'),
  VOLUME: () => translation('volume'),
  SEEK: () => translation('seek'),
  CLOSED_CAPTIONS: () => translation('closed captions'),
  PLAYBACK_RATE: ({ playbackRate = 1 } = {}) =>
    `${translation('Playback rate {playbackRate}', { playbackRate })}`,
  PLAYBACK_TIME: () => translation('playback time'),
  MEDIA_LOADING: () => translation('media loading'),
  SETTINGS: () => translation('settings'),
  AUDIO_TRACKS: () => translation('audio tracks'),
  QUALITY: () => translation('quality'),
};

export const verbs: Record<string, (options?: LabelOptions) => string> = {
  PLAY: () => translation('play'),
  PAUSE: () => translation('pause'),
  MUTE: () => translation('mute'),
  UNMUTE: () => translation('unmute'),
  ENTER_AIRPLAY: () => translation('start airplay'),
  EXIT_AIRPLAY: () => translation('stop airplay'),
  ENTER_CAST: () => translation('start casting'),
  EXIT_CAST: () => translation('stop casting'),
  ENTER_FULLSCREEN: () => translation('enter fullscreen mode'),
  EXIT_FULLSCREEN: () => translation('exit fullscreen mode'),
  ENTER_PIP: () => translation('enter picture in picture mode'),
  EXIT_PIP: () => translation('exit picture in picture mode'),
  SEEK_FORWARD_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${(translation('seek forward {seekOffset} seconds'), { seekOffset })}`,
  SEEK_BACK_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${translation('seek back {seekOffset} seconds', { seekOffset })}`,
  SEEK_LIVE: () => translation('seek to live'),
  PLAYING_LIVE: () => translation('playing live'),
};

export default {
  ...nouns,
  ...verbs,
};
